import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import eventBus from '../../utils/eventBus';

import './NavigationCalendar.css';

import caretLeftLight from '../../images/caret-icons/caretLeftLight.png';
import caretRightLight from '../../images/caret-icons/caretRightLight.png';
import caretLeftDark from '../../images/caret-icons/caretLeftDark.png';
import caretRightDark from '../../images/caret-icons/caretRightDark.png';

function NavigationCalendar() {

    const navigate = useNavigate();
    const location = useLocation();

    const currentDate = new Date();

    const [year, setYear] = useState();
    const [month, setMonth] = useState();
    const [selectedYear, setSelectedYear] = useState();
    const [selectedMonth, setSelectedMonth] = useState();
    const [selectedWeek, setSelectedWeek] = useState();

    const handleWeekClick = (week) => {
        navigate('/');

        setSelectedYear(year);
        setSelectedMonth(month);
        setSelectedWeek(week);

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
                    <div
                        className={
                            selectedWeek === weekNumber &&
                            selectedMonth === month &&
                            selectedYear === year
                            ? 'active'
                            : null
                        }
                        onClick={() => handleWeekClick(weekNumber)}
                    >
                        {weekDays}
                    </div>
                );
            }
        }

        return weeks;
    }

    return (
        <div className='NavigationCalendar'>
            
            <div className='month-navigation'>
                <button onClick={previousMonth}><img className='light' src={caretLeftLight} /><img className='dark' src={caretLeftDark} /></button>
                <p>{months[month]} {year}</p>
                <button onClick={nextMonth}><img className='light' src={caretRightLight} /><img className='dark' src={caretRightDark} /></button>
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