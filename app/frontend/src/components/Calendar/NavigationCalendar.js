import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDroppable } from '@dnd-kit/core';

import eventBus from '../../utils/eventBus';

import NavigationCalendarWeek from './NavigationCalendarWeek';

import './NavigationCalendar.css';

import caretLeftLight from '../../images/caret-icons/caretLeftLight.png';
import caretRightLight from '../../images/caret-icons/caretRightLight.png';
import caretLeftDark from '../../images/caret-icons/caretLeftDark.png';
import caretRightDark from '../../images/caret-icons/caretRightDark.png';

function NavigationCalendar(props) {

    const EVENT_DRAG_TO_NAVIGATE_TIMER = 800;

    const navigate = useNavigate();
    const location = useLocation();

    const currentDate = new Date();

    const [year, setYear] = useState();
    const [month, setMonth] = useState();
    const [selectedYear, setSelectedYear] = useState();
    const [selectedMonth, setSelectedMonth] = useState();
    const [selectedWeek, setSelectedWeek] = useState();
    
    const [hoveredWeek, setHoveredWeek] = useState(null);
    const [hoveredMonth, setHoveredMonth] = useState(null);
    const hoverTimeout = useRef(null);

    
    const {setNodeRef: monthForwardRef} = useDroppable({
        id: 'month-forward',
        data: { disabled: true }
    });
    const {setNodeRef: monthBackwardRef} = useDroppable({
        id: 'month-backward',
        data: { disabled: true }
    });

    const clearHover = () => {
        if (hoverTimeout.current) {
            clearTimeout(hoverTimeout.current);
            hoverTimeout.current = null;
        }
        setHoveredWeek(null);
        setHoveredMonth(null);
    };

    const handleWeekClick = (week) => {
        navigate('/');

        setSelectedYear(year);
        setSelectedMonth(month);
        setSelectedWeek(week);

        if (props.closeFunction) props.closeFunction();

        eventBus.emit('weekSelected', [year, month, week]);
    }

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    useEffect(() => {
        const currentYear = currentDate.getFullYear()
        const currentMonth = currentDate.getMonth()
        const firstWeekday = new Date(currentYear, currentMonth, 1).getDay();
        const currentWeek = Math.floor((currentDate.getDate() + firstWeekday - 1) / 7) + 1

        setYear(currentYear);
        setMonth(currentMonth);

        setSelectedYear(currentYear);
        setSelectedMonth(currentMonth);
        setSelectedWeek(currentWeek);

        eventBus.emit('weekSelected', [currentYear, currentMonth, currentWeek]);
    }, [])

    useEffect(() => {
        const handleDragOver = (event) => {
            // Check if the draggable is over a valid calendar week
            if (event.over && event.over.id.startsWith("week-")) {
                if (hoveredWeek !== event.over.id) {
                    setHoveredWeek(event.over.id);
            
                    // Clear any existing timeout
                    clearHover()
            
                    hoverTimeout.current = setTimeout(() => {
                        handleWeekClick(parseInt(event.over.id.split('-')[1]))
                    }, EVENT_DRAG_TO_NAVIGATE_TIMER);
                }
            } else if (event.over && event.over.id.startsWith('month')) {
                if (hoveredMonth !== event.over.id) {
                    setHoveredMonth(event.over.id);
            
                    // Clear any existing timeout
                    clearHover()
            
                    if (event.over.id === 'month-forward') {
                        hoverTimeout.current = setTimeout(() => {
                            nextMonth()
                        }, EVENT_DRAG_TO_NAVIGATE_TIMER);
                    }
                    else {
                        hoverTimeout.current = setTimeout(() => {
                            previousMonth()
                        }, EVENT_DRAG_TO_NAVIGATE_TIMER);
                    }
                }
            } else {
                clearHover();
            }
        };
    
        const handleDragEnd = (event) => {
            clearHover();
        };

        eventBus.on('handleDragOver', handleDragOver);
        eventBus.on('handleDragEnd', handleDragEnd);
        return () => {
            eventBus.off('handleDragOver', handleDragOver);
            eventBus.off('handleDragEnd', handleDragEnd);
        }
    }, [month, year])

    useEffect(() => {
        if (location.pathname !== '/') {
            setSelectedWeek(0);
        }
    }, [location.pathname])

    const nextMonth = () => {
        if (month >= 11) {
            setMonth(0);
            setYear(year + 1);
        }
        else {
            setMonth(month + 1);
        }
    }

    const previousMonth = () => {
        if (month <= 0) {
            setMonth(11);
            setYear(year - 1);
        }
        else {
            setMonth(month - 1);
        }
    }

    const renderedDays = () => {
        const firstWeekday = new Date(year, month, 1).getDay();
        const daysInCurrentMonth = new Date(year, month+1, 0).getDate();
        const lastWeekday = new Date(year, month, daysInCurrentMonth).getDay();
        const daysInPreviousMonth = new Date(year, month, 0).getDate();


        const weeks = [];
        let day = 1;

        // Handle previous month's trailing days
        let prevMonthDays = daysInPreviousMonth - firstWeekday + 1;

        while (day <= daysInCurrentMonth) {
            const weekDays = [];

            for (let i = 0; i < 7; i++) {
                if (i === 0 || i === 1) {
                    if (prevMonthDays <= daysInPreviousMonth) {
                        prevMonthDays++;
                    }
                    else {
                        day++;
                    }
                    continue;
                }; // Skip Sunday and Monday

                if (prevMonthDays <= daysInPreviousMonth) {
                    // Previous month days
                    weekDays.push(
                        <button className="faded">
                            {prevMonthDays}
                        </button>
                    );
                    prevMonthDays++;
                } else if (day <= daysInCurrentMonth) {
                    // Current month days
                    weekDays.push(
                        <button className={day === currentDate.getDate() && month === currentDate.getMonth() && year === currentDate.getFullYear() ? 'current-day' : ''}>
                            {day}
                        </button>
                    );
                    day++;
                } else if (lastWeekday !== 6 && lastWeekday >= 2) {
                    // Next month days
                    let nextMonthDay = day - daysInCurrentMonth;
                    weekDays.push(
                      <button className="faded">
                        {nextMonthDay}
                      </button>
                    );
                    day++;
                }
            }

            if (weekDays.length > 0) {
                const weekNumber = weeks.length + 1;
                weeks.push(
                    <NavigationCalendarWeek
                        className={
                            selectedWeek === weekNumber &&
                            selectedMonth === month &&
                            selectedYear === year
                            ? 'active'
                            : null
                        }
                        onClick={() => handleWeekClick(weekNumber)}
                        id={`week-${weekNumber}-${month}-${year}`}
                    >
                        {weekDays}
                    </NavigationCalendarWeek>
                );
            }
        }

        return weeks;
    }

    return (
        <div className='NavigationCalendar'>
            
            <div className='month-navigation'>
                <button ref={monthBackwardRef} onClick={previousMonth}><img className='light' src={caretLeftLight} /><img className='dark' src={caretLeftDark} /></button>
                <p>{months[month]} {year}</p>
                <button ref={monthForwardRef} onClick={nextMonth}><img className='light' src={caretRightLight} /><img className='dark' src={caretRightDark} /></button>
            </div>

            <div className='day-navigation'>
                <div className='days-of-the-week'>
                    <p>Tu</p>
                    <p>We</p>
                    <p>Th</p>
                    <p>Fr</p>
                    <p>Sa</p>
                </div>

                {renderedDays()}
                
            </div>

        </div>
    );
}

export default NavigationCalendar;