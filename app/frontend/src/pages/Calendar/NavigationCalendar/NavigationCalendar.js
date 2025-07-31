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

    // Drag and drop hover over navigation calendar to navigate
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


    // #### UTILITY FUNCTIONS
    const compareDates = (date1, date2) => {
        return date1.getFullYear() === date2.getFullYear()
            && date1.getMonth() === date2.getMonth()
            && date1.getDate() === date2.getDate();
    }

    const getNextMonth = (year, month) => {
        return new Date(year, month+1).getMonth();
    }

    const getYearOfNextMonth = (year, month) => {
        return new Date(year, month+1).getFullYear();
    }

    const getPreviousMonth = (year, month) => {
        return new Date(year, month-1).getMonth();
    }

    const getYearOfPreviousMonth = (year, month) => {
        return new Date(year, month-1).getFullYear();
    }

    const getFirstWeekDateOfDate = (date) => {
        const firstWeekDateDay = date.getDate() - date.getDay() + 2;
        return new Date(date.getFullYear(), date.getMonth(), firstWeekDateDay);
    }

    const getNumberOfDaysInMonth = (firstMonthDate) => {
        return new Date(firstMonthDate.getFullYear(), firstMonthDate.getMonth() + 1, 0).getDate();
    }

    const getFirstWeekdayOfMonth = (firstMonthDate) => {
        return firstMonthDate.getDay();
    }

    const getLastWeekdayOfMonth = (firstMonthDate) => {
        return new Date(firstMonthDate.getFullYear(), firstMonthDate.getMonth() + 1, 0).getDay();
    }

    /*
        Get a date object for the day number of a month, including negative numbers
        and numbers greater than the length of the month
    */
    const getDateOfMonthDay = (firstMonthDate, monthDay) => {
        return new Date(firstMonthDate.getFullYear(), firstMonthDate.getMonth(), monthDay);
    }

    // Returns a date string in the form 'dd-mm-yyyy' from a date object
    const getDateStringFromDate = (date) => {
        return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    }

    // Returns a date object from a date string in the form 'dd-mm-yyyy'
    const getDateFromDateString = (dateString) => {
        return new Date(dateString.split('-')[2], parseInt(dateString.split('-')[1])-1, dateString.split('-')[0]);
    }


    // #### NAVIGATION FUNCTIONS
    const moveNavigationMonthForward = () => {
        setMonth(getNextMonth(year, month))
        setYear(getYearOfNextMonth(year, month))
    }

    const moveNavigationMonthBackward = () => {
        setMonth(getPreviousMonth(year, month))
        setYear(getYearOfPreviousMonth(year, month))
    }

    const handleDateClick = (dateClicked) => {
        if (props.mode === calendarModes.DAY)
            props.navigateToDay(dateClicked)

        else if (props.mode === calendarModes.WEEK)
            props.navigateToWeek(getFirstWeekDateOfDate(dateClicked))

        else if (props.mode === calendarModes.MONTH)
            props.navigateToMonth(dateClicked)
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
                        handleDateClick(getDateFromDateString(event.over.id.slice(5)))
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
    }, [month, year, props.mode])


    // #### RENDER FUNCTIONS
    const getRenderedDays = () => {

        let dayButtons = []

        const firstMonthDate = new Date(year, month, 1);

        const numberOfDaysInMonth = getNumberOfDaysInMonth(firstMonthDate);
        const firstWeekdayOfMonth = getFirstWeekdayOfMonth(firstMonthDate);
        const lastWeekdayOfMonth = getLastWeekdayOfMonth(firstMonthDate);

        // Calculate first and last month days, filling out the first and last week with days from other months
        const firstMonthDay = 2 - firstWeekdayOfMonth;
        const lastMonthDay = numberOfDaysInMonth + ((6 - lastWeekdayOfMonth) % 5)

        for (let i = firstMonthDay; i <= lastMonthDay; i++) {

            const monthDate = getDateOfMonthDay(firstMonthDate, i);

            if (monthDate.getDay() < 2) continue; // Sunday or Monday

            dayButtons.push(

                <button
                    className={
                        `${(i < 1 || i > numberOfDaysInMonth) && 'faded'}
                        ${compareDates(monthDate, currentDate) && 'current-day'}
                        ${compareDates(monthDate, new Date(props.year, props.month, props.day)) && 'active'}`
                    }
                    onClick={() => props.mode === calendarModes.DAY && handleDateClick(monthDate)}
                >
                    {monthDate.getDate()}
                </button>

            )

        }

        let navigationCalendarWeeks = []
        const numberOfWeeks = parseInt(dayButtons.length / 5)

        for (let i = 0; i < numberOfWeeks; i++) {

            const firstWeekDate = new Date(year, month, firstMonthDay + i * 7 + 1)

            navigationCalendarWeeks.push(
                <NavigationCalendarWeek
                    className={
                        props.mode === calendarModes.WEEK &&
                        compareDates(firstWeekDate, new Date(props.year, props.month, props.day)) &&
                        'active'
                    }
                    id={`week-${getDateStringFromDate(firstWeekDate)}`}
                    onClick={() => props.mode === calendarModes.WEEK && handleDateClick(firstWeekDate)}
                >
                    {dayButtons.slice(i*5, i*5+5)}
                </NavigationCalendarWeek>
            );

        }

        return navigationCalendarWeeks;
    }

    return (
        <div className='NavigationCalendar'>
            
            <div className='month-navigation'>
                <button
                    ref={monthBackwardRef}
                    onClick={moveNavigationMonthBackward}
                >
                    <img className='light' src={caretLeftLight} />
                    <img className='dark' src={caretLeftDark} />
                </button>

                <p>{MONTHS[month]} {year}</p>

                <button
                    ref={monthForwardRef}
                    onClick={moveNavigationMonthForward}
                >
                    <img className='light' src={caretRightLight} />
                    <img className='dark' src={caretRightDark} />
                </button>
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
                        ? 'active' : null}`
                    }
                    onClick={() => props.mode === calendarModes.MONTH && handleDateClick(new Date(year, month, 1))}
                >

                    {getRenderedDays()}
                    
                </div>
                
            </div>

        </div>
    );
}


/*
    Component for holding the days in each week on the navigation calendar.
*/

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