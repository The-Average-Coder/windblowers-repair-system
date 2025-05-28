import { useState, useEffect, useRef } from 'react';
import { useDroppable } from '@dnd-kit/core';

import eventBus from '../../../utils/eventBus';

import calendarModes from '../../../enums/calendarModes';

import './NavigationCalendar.css';

import caretLeftLight from '../../../images/caret-icons/caretLeftLight.png';
import caretRightLight from '../../../images/caret-icons/caretRightLight.png';
import caretLeftDark from '../../../images/caret-icons/caretLeftDark.png';
import caretRightDark from '../../../images/caret-icons/caretRightDark.png';

function NavigationCalendar(props) {

    // #### CONSTANTS
    const EVENT_DRAG_TO_NAVIGATE_TIMER = 800;
    const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const CALENDAR_MODE_CLASS_NAMES = ['day-mode', 'week-mode', 'month-mode'];


    // #### STATE VARIABLES
    const [year, setYear] = useState();
    const [month, setMonth] = useState();

    const [hoveredWeek, setHoveredWeek] = useState(null);
    const [hoveredMonth, setHoveredMonth] = useState(null);
    const hoverTimeout = useRef(null);


    // #### OTHER MISCELLANEOUS INITIALISATION
    const currentDate = new Date();
    

    // #### MONTH NAVIGATION DROPPABLES
    const {setNodeRef: monthForwardRef} = useDroppable({
        id: 'month-forward',
        data: { disabled: true }
    });

    const {setNodeRef: monthBackwardRef} = useDroppable({
        id: 'month-backward',
        data: { disabled: true }
    });


    // #### NAVIGATION FUNCTIONS
    const getNextMonthAndYear = () => {
        if (month >= 11) {
            return [0, year+1];
        }
        else {
            return [month+1, year];
        }
    }

    const getPreviousMonthAndYear = () => {
        if (month <= 0) {
            return [11, year-1];
        }
        else {
            return [month-1, year];
        }
    }

    const moveNavigationMonthForward = () => {
        const nextMonthAndYear = getNextMonthAndYear();
        setMonth(nextMonthAndYear[0])
        setYear(nextMonthAndYear[1])
    }

    const moveNavigationMonthBackward = () => {
        const previousMonthAndYear = getPreviousMonthAndYear();
        setMonth(previousMonthAndYear[0])
        setYear(previousMonthAndYear[1])
    }

    const handleDayClick = (day, month, year) => {
        props.setYear(year);
        props.setMonth(month);
        props.setDay(day);

        if (props.mode === calendarModes.WEEK) props.calculateWeekDates(year, month, day);
        else if (props.mode === calendarModes.MONTH) props.calculateMonthDates(year, month)
    }

    // #### EVENT HOVER NAVIGATION FUNCTIONS
    const clearHover = () => {
        if (hoverTimeout.current) {
            clearTimeout(hoverTimeout.current);
            hoverTimeout.current = null;
        }
        setHoveredWeek(null);
        setHoveredMonth(null);
    };

    useEffect(() => {
        const currentYear = currentDate.getFullYear()
        const currentMonth = currentDate.getMonth()

        setYear(currentYear);
        setMonth(currentMonth);
    }, [])

    useEffect(() => {
        const handleDragOver = (event) => {
            if (props.mode !== calendarModes.WEEK) return;

            // Check if the draggable is over a valid calendar week
            if (event.over && event.over.id.startsWith("week-")) {
                if (hoveredWeek !== event.over.id) {
                    setHoveredWeek(event.over.id);
            
                    // Clear any existing timeout
                    clearHover()
            
                    hoverTimeout.current = setTimeout(() => {
                        handleDayClick(parseInt(event.over.id.split('-')[1]), parseInt(event.over.id.split('-')[2]), parseInt(event.over.id.split('-')[3]))
                    }, EVENT_DRAG_TO_NAVIGATE_TIMER);
                }
            } else if (event.over && event.over.id.startsWith('month')) {
                if (hoveredMonth !== event.over.id) {
                    setHoveredMonth(event.over.id);
            
                    // Clear any existing timeout
                    clearHover()
            
                    if (event.over.id === 'month-forward') {
                        hoverTimeout.current = setTimeout(() => {
                            moveNavigationMonthForward()
                        }, EVENT_DRAG_TO_NAVIGATE_TIMER);
                    }
                    else {
                        hoverTimeout.current = setTimeout(() => {
                            moveNavigationMonthBackward()
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
    }, [props.month, props.year, props.day, props.mode])

    const renderedDays = () => {
        const firstWeekday = new Date(year, month, 1).getDay();
        const daysInCurrentMonth = new Date(year, month+1, 0).getDate();
        const lastWeekday = new Date(year, month, daysInCurrentMonth).getDay();
        const daysInPreviousMonth = new Date(year, month, 0).getDate();

        let day = 1;

        // Handle previous month's trailing days
        let prevMonthDays = daysInPreviousMonth - firstWeekday + 1;

        const weeks = [];

        while (day <= daysInCurrentMonth) {
            const weekDays = [];

            let weekFirstDay = 0;
            let weekMonth = 0;
            let weekYear = 0;

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
                    const dayNumber = prevMonthDays;
                    const previousMonthAndYear = getPreviousMonthAndYear();

                    if (weekFirstDay === 0) {
                        weekFirstDay = dayNumber;
                        weekMonth = previousMonthAndYear[0]
                        weekYear = previousMonthAndYear[1]
                    }

                    weekDays.push(
                        <button className={
                        `faded
                        ${dayNumber === props.day &&
                        previousMonthAndYear[0] === props.month &&
                        previousMonthAndYear[1] === props.year &&
                        'active'
                        }`
                        }
                        onClick={() => props.mode === calendarModes.DAY && handleDayClick(dayNumber, previousMonthAndYear[0], previousMonthAndYear[1])}>
                            {dayNumber}
                        </button>
                    );
                    prevMonthDays++;
                } else if (day <= daysInCurrentMonth) {
                    // Current month days
                    const dayNumber = day;

                    if (weekFirstDay === 0) {
                        weekFirstDay = dayNumber;
                        weekMonth = month
                        weekYear = year
                    }

                    weekDays.push(
                        <button className={dayNumber === currentDate.getDate() &&
                            month === currentDate.getMonth() &&
                            year === currentDate.getFullYear()
                            ? 'current-day'
                            :
                            dayNumber === props.day &&
                            month === props.month &&
                            year === props.year &&
                            'active'
                        }
                        onClick={() => props.mode === calendarModes.DAY && handleDayClick(dayNumber, month, year)}>
                            {dayNumber}
                        </button>
                    );
                    day++;
                } else if (lastWeekday !== 6 && lastWeekday >= 2) {
                    // Next month days
                    let nextMonthDay = day - daysInCurrentMonth;
                    const nextMonthAndYear = getNextMonthAndYear();

                    if (weekFirstDay === 0) {
                        weekFirstDay = nextMonthDay;
                        weekMonth = nextMonthAndYear[0]
                        weekYear = nextMonthAndYear[1]
                    }

                    weekDays.push(
                        <button className={
                        `faded
                        ${nextMonthDay === props.day &&
                        nextMonthAndYear[0] === props.month &&
                        nextMonthAndYear[1] === props.year &&
                        'active'
                        }`
                        }
                        onClick={() => props.mode === calendarModes.DAY && handleDayClick(nextMonthDay, nextMonthAndYear[0], nextMonthAndYear[1])}>
                            {nextMonthDay}
                        </button>
                    );
                    day++;
                }
            }

            if (weekDays.length > 0) {
                weeks.push(
                    <NavigationCalendarWeek
                        className={
                            props.mode === calendarModes.WEEK &&
                            weekFirstDay === props.day &&
                            weekMonth === props.month &&
                            weekYear === props.year
                            ? 'active'
                            : null
                        }
                        id={`week-${weekFirstDay}-${weekMonth}-${weekYear}`}
                        onClick={() => props.mode === calendarModes.WEEK && handleDayClick(weekFirstDay, weekMonth, weekYear)}
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
                <button ref={monthBackwardRef} onClick={moveNavigationMonthBackward}><img className='light' src={caretLeftLight} /><img className='dark' src={caretLeftDark} /></button>
                <p>{MONTHS[month]} {year}</p>
                <button ref={monthForwardRef} onClick={moveNavigationMonthForward}><img className='light' src={caretRightLight} /><img className='dark' src={caretRightDark} /></button>
            </div>

            <div className={`day-navigation ${CALENDAR_MODE_CLASS_NAMES[props.mode]}`}>
                {/* Top row of grid for day of the week headers */}
                <div className='days-of-the-week'>
                    <p>Tu</p>
                    <p>We</p>
                    <p>Th</p>
                    <p>Fr</p>
                    <p>Sa</p>
                </div>

                <div
                className={
                    `month-days
                    ${props.mode === calendarModes.MONTH &&
                    props.month === month &&
                    props.year === year
                    ? 'active'
                    : null
                }`}
                onClick={
                    () => props.mode === calendarModes.MONTH && handleDayClick(1, month, year)
                }>

                    {renderedDays()}
                    
                </div>
                
            </div>

        </div>
    );
}

function NavigationCalendarWeek (props) {
    const { setNodeRef } = useDroppable({
      id: props.id,
      data: { disabled: true }
    });

    return (
        <div ref={setNodeRef} className={`week ${props.className}`} onClick={props.onClick}>
            {props.children}
        </div>
    );
}

export default NavigationCalendar;