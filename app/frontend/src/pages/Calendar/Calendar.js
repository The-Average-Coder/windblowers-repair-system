import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { DndContext, useSensor, useSensors, KeyboardSensor, MouseSensor, TouchSensor, DragOverlay, useDroppable } from '@dnd-kit/core';

import eventBus from '../../utils/eventBus';

import repairStatuses from '../../enums/repairStatuses';
import calendarModes from '../../enums/calendarModes';

import PageTitle from '../../components/Text/PageTitle';
import ContentBlock from '../../components/Containers/ContentBlock';
import BlockTitle from '../../components/Text/BlockTitle';
import BlockText from '../../components/Text/BlockText';

import CalendarEvent from './Events/CalendarEvent';
import AddCalendarEventButton from './Events/AddCalendarEventButton';

import CalendarEventPopover from './Popovers/CalendarEventPopover';
import CreateEventPopover from './Popovers/CreateEventPopover';

import './Calendar.css';
import NavigationCalendar from './NavigationCalendar/NavigationCalendar';

function Calendar() {

    // #### RAW DATA FOR TESTING
    const [calendarEvents, setCalendarEvents] = useState([
        {
            id: 1,
            type: 'Repair',
            title: '',
            description: '',
            date: '27-05-2025',
            time: '90',
            color: 'green',
            repairer: 'Purple',
            repair: {
                id: 2508004,
                status: repairStatuses.OPEN,
                customer: {
                    firstname: 'Josh',
                    surname: 'Cox',
                    email: 'joshuajosephcox@gmail.com',
                    phone: '07796593187',
                    address: '10 Cross Hill Close, LE12 6UJ'
                },
                instrument: {
                    type: 'Flute',
                    manufacturer: 'Pearl',
                    model: '505',
                    serial_number: 'ABC123',
                    status: 1,
                },
                notes: 'Some assorted notes',
                assessment: {
                    job_type: 0,
                    notes: 'Some assessment notes'
                }
            }
        },
        {
            id: 2,
            type: 'Repair',
            title: '',
            description: '',
            date: '28-05-2025',
            time: '120',
            color: 'purple',
            repairer: 'Purple',
            repair: {
                id: 2509002,
                status: repairStatuses.OPEN,
                in_house: true,
                instrument: {
                    type: 'Alto Saxophone',
                    manufacturer: 'Yamaha',
                    model: 'YAS-280',
                    serial_number: 'DEF456',
                    status: 1,
                },
                notes: 'Some assorted notes',
                assessment: {
                    job_type: 1,
                    notes: 'Some assessment notes'
                }
            }
        },
        {
            id: 3,
            type: 'Repair',
            title: '',
            description: '',
            date: '28-05-2025',
            time: '60',
            color: 'orange',
            repairer: 'Purple',
            repair: {
                id: 2508004,
                status: repairStatuses.OPEN,
                customer: {
                    firstname: 'Josh',
                    surname: 'Cox',
                    email: 'joshuajosephcox@gmail.com',
                    phone: '07796593187',
                    address: '10 Cross Hill Close, LE12 6UJ'
                },
                instrument: {
                    type: 'Flute',
                    manufacturer: 'Pearl',
                    model: '505',
                    serial_number: 'ABC123',
                    status: 1,
                },
                notes: 'Some assorted notes',
                assessment: {
                    job_type: 0,
                    notes: 'Some assessment notes'
                }
            }
        },
        {
            id: 4,
            type: 'Repair',
            title: '',
            description: '',
            date: '28-05-2025',
            time: '150',
            color: 'blue',
            repairer: 'Ryan',
            repair: {
                id: 2508004,
                status: repairStatuses.OPEN,
                customer: {
                    firstname: 'Josh',
                    surname: 'Cox',
                    email: 'joshuajosephcox@gmail.com',
                    phone: '07796593187',
                    address: '10 Cross Hill Close, LE12 6UJ'
                },
                instrument: {
                    type: 'Flute',
                    manufacturer: 'Pearl',
                    model: '505',
                    serial_number: 'ABC123',
                    status: 1,
                },
                notes: 'Some assorted notes',
                assessment: {
                    job_type: 0,
                    notes: 'Some assessment notes'
                }
            }
        },
        {
            id: 5,
            type: 'Other Event',
            title: 'Holiday',
            description: 'A Description',
            date: '30-05-2025',
            time: '0',
            all_day: true,
            color: 'red',
            repairer: 'Purple',
        },
        {
            id: 6,
            type: 'Other Event',
            title: 'Holiday',
            description: 'A Description',
            date: '31-05-2025',
            time: '0',
            all_day: true,
            color: 'yellow',
            repairer: 'Purple',
        },
        {
            id: 7,
            type: 'Other Event',
            title: 'Holiday',
            description: 'A Description',
            date: '29-05-2025',
            time: '0',
            all_day: true,
            color: 'indigo',
            repairer: 'Ryan',
        },
        {
            id: 8,
            type: 'Repair',
            title: '',
            description: '',
            date: '29-05-2025',
            time: '300',
            color: 'turquoise',
            repairer: 'Purple',
            repair: {
                id: 2509002,
                status: repairStatuses.OPEN,
                in_house: true,
                instrument: {
                    type: 'Alto Saxophone',
                    manufacturer: 'Yamaha',
                    model: 'YAS-280',
                    serial_number: 'DEF456',
                    status: 1,
                },
                notes: 'Some assorted notes',
                assessment: {
                    job_type: 1,
                    notes: 'Some assessment notes'
                }
            }
        }
    ])

    const [repairers, setRepairers] = useState([
        { id: 1, name: 'Purple', hours: [8, 8, 8, 8, 4] },
        { id: 2, name: 'Ryan', hours: [0, 8, 8, 0, 0] }
    ])
    
    const [detailsSettings, setDetailsSettings] = useState([
        { id: 0, name: 'Instrument', dayEnabled: true, weekEnabled: true },
        { id: 1, name: 'Serial Number', dayEnabled: false, weekEnabled: false },
        { id: 2, name: 'Instrument Status', dayEnabled: true, weekEnabled: false },
        { id: 3, name: 'Customer', dayEnabled: false, weekEnabled: false },
        { id: 4, name: 'Job Type', dayEnabled: true, weekEnabled: false }
    ]);

    const [jobTypes, setJobTypes] = useState([
        { id: 1, name: 'Repad', notes: 'bla bla bla' },
        { id: 2, name: 'Clean', notes: 'whish whosh whish whosh' },
        { id: 3, name: 'Wax', notes: 'wax on wax off, wax on wax off' },
    ]);
    const [instrumentStatuses, setInstrumentStatuses] = useState([
        { id: 1, status: 'Not Yet Dropped Off' },
        { id: 2, status: 'In Workshop' }
    ]);

    
    // #### CONSTANTS
    const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const DAYS = ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    

    // #### STATE VARIABLES
    const [calendarMode, setCalendarMode] = useState(calendarModes.WEEK);

    const [year, setYear] = useState();
    const [month, setMonth] = useState();
    const [week, setWeek] = useState();
    const [day, setDay] = useState();

    const [weekDates, setWeekDates] = useState(['', '', '', '', '']);
    const [monthDates, setMonthDates] = useState([]);

    const [activeEvent, setActiveEvent] = useState(null);

    const [popoverCalendarEvent, setPopoverCalendarEvent] = useState({})
    const [popoverPosition, setPopoverPosition] = useState([0, 0])
    const [createCalendarEventPopover, setCreateCalendarEventPopover] = useState({});


    // #### DRAG AND DROP INITIALISATION
    const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 5 }});
    const touchSensor = useSensor(TouchSensor, { activationConstraint: { distance: 5 }});
    const keyboardSensor = useSensor(KeyboardSensor);
    
    const sensors = useSensors(
        mouseSensor,
        touchSensor,
        keyboardSensor,
    )


    // #### OTHER MISCELLANEOUS INITIALISATION 
    const navigate = useNavigate();   
    const calendarRef = useRef(null);
    const currentDate = new Date();


    // #### DRAG AND DROP EVENTS
    const handleDragOver = (event) => {
        eventBus.emit('handleDragOver', event)
    }


    // #### CALENDAR NAVIGATION FUNCTIONS
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

    const calculateWeekDates = (year, month, day) => {

        const numDaysInMonth = new Date(year, month + 1, 0).getDate();
        const firstWeekDate = day - new Date(year, month, day).getDay() + 2;

        setWeekDates([
            firstWeekDate,
            firstWeekDate % numDaysInMonth + 1,
            (firstWeekDate + 1) % numDaysInMonth + 1,
            (firstWeekDate + 2) % numDaysInMonth + 1,
            (firstWeekDate + 3) % numDaysInMonth + 1,
        ])
    }

    const calculateMonthDates = (year, month) => {
        setMonthDates([]);

        let newMonthDates = [];

        const firstWeekday = new Date(year, month, 1).getDay();
        const numDaysInCurrentMonth = new Date(year, month+1, 0).getDate();
        const lastWeekday = new Date(year, month, numDaysInCurrentMonth).getDay();
        const numDaysInPreviousMonth = new Date(year, month, 0).getDate();
        
        let day = 1;

        // Handle previous month's trailing days
        let prevMonthDays = numDaysInPreviousMonth - firstWeekday + 1;

        while (day <= numDaysInCurrentMonth) {
            for (let i = 0; i < 7; i++) {
                if (i === 0 || i === 1) {
                    if (prevMonthDays <= numDaysInPreviousMonth) {
                        prevMonthDays++;
                    }
                    else {
                        day++;
                    }
                    continue;
                }; // Skip Sunday and Monday

                if (prevMonthDays <= numDaysInPreviousMonth) {
                    // Previous month days
                    newMonthDates.push(prevMonthDays);
                    prevMonthDays++;
                } else if (day <= numDaysInCurrentMonth) {
                    // Current month days
                    newMonthDates.push(day);
                    day++;
                } else if (lastWeekday !== 6 && lastWeekday >= 2) {
                    // Next month days
                    const nextMonthDay = day - numDaysInCurrentMonth;
                    newMonthDates.push(nextMonthDay)
                    day++;
                }
            }
        }

        setMonthDates(newMonthDates);
    }

    const updateCalendarMode = (newCalendarMode) => {
        if (newCalendarMode === calendarMode) return;

        setWeekDates(['', '', '', '', '']);
        setMonthDates([]);

        if (newCalendarMode === calendarModes.MONTH) {
            setCalendarMode(newCalendarMode);
            calculateMonthDates(year, month);
            return;
        };

        if (newCalendarMode === calendarModes.DAY) {
            const currentDay = currentDate.getDate();
            const currentDayOfTheWeek = currentDate.getDay();

            const nextWorkingDay = currentDay + Math.max(2 - currentDayOfTheWeek, 0);

            setDay(nextWorkingDay);
            setMonth(new Date(currentDate.getFullYear(), currentDate.getMonth(), nextWorkingDay).getMonth());
            setYear(new Date(currentDate.getFullYear(), currentDate.getMonth(), nextWorkingDay).getFullYear());

            setCalendarMode(newCalendarMode);
            return;
        }

        if (calendarMode === calendarModes.DAY) {
            // Set week to week of currently selected day
            const firstWeekDate = day - new Date(year, month, day).getDay() + 2;

            if (firstWeekDate <= 0) {
                const previousMonthAndYear = getPreviousMonthAndYear();
                const numDaysInPreviousMonth = new Date(year, month, 0).getDate();

                setYear(previousMonthAndYear[1]);
                setMonth(previousMonthAndYear[0]);
                setDay(firstWeekDate + numDaysInPreviousMonth);

                calculateWeekDates(previousMonthAndYear[1], previousMonthAndYear[0], firstWeekDate + numDaysInPreviousMonth);
            }
            else {
                setDay(firstWeekDate);

                calculateWeekDates(year, month, firstWeekDate);
            }
            
            setCalendarMode(newCalendarMode);
            return;
        }

        if (calendarMode === calendarModes.MONTH) {
            if (month === currentDate.getMonth()) {
                // Set week to current week
                const firstWeekDate = currentDate.getDate() - new Date(year, month, currentDate.getDate()).getDay() + 2;

                if (firstWeekDate <= 0) {
                    const previousMonthAndYear = getPreviousMonthAndYear();
                    const numDaysInPreviousMonth = new Date(year, month, 0).getDate();

                    setYear(previousMonthAndYear[1]);
                    setMonth(previousMonthAndYear[0]);
                    setDay(firstWeekDate + numDaysInPreviousMonth);

                    calculateWeekDates(previousMonthAndYear[1], previousMonthAndYear[0], firstWeekDate + numDaysInPreviousMonth);
                }
                else {
                    setDay(firstWeekDate);

                    calculateWeekDates(year, month, firstWeekDate);
                }
                
                setCalendarMode(newCalendarMode);
                return;
            }

            // Set week to first week in month
            const numDaysInPreviousMonth = new Date(year, month, 0).getDate();
            const firstWeekDate = (numDaysInPreviousMonth - new Date(year, month, 1).getDay() + 2) % numDaysInPreviousMonth + 1;

            if (firstWeekDate >= 15) {
                const previousMonthAndYear = getPreviousMonthAndYear();
                setYear(previousMonthAndYear[1]);
                setMonth(previousMonthAndYear[0]);
                setDay(firstWeekDate);

                calculateWeekDates(previousMonthAndYear[1], previousMonthAndYear[0], firstWeekDate);
                
                setCalendarMode(newCalendarMode);
                return;
            }
            setDay(firstWeekDate);

            calculateWeekDates(year, month, firstWeekDate);

            setCalendarMode(newCalendarMode);
            return;
        }
        
    }

    const navigateForward = () => {
        if (calendarMode === calendarModes.MONTH) {
            const nextMonthAndYear = getNextMonthAndYear()
            setDay(1);
            setMonth(nextMonthAndYear[0]);
            setYear(nextMonthAndYear[1]);
            calculateMonthDates(nextMonthAndYear[1], nextMonthAndYear[0])
        }
        else if (calendarMode === calendarModes.WEEK) {
            const nextWeek = new Date(year, month, day+7);
            setDay(nextWeek.getDate());
            setMonth(nextWeek.getMonth());
            setYear(nextWeek.getFullYear());
            calculateWeekDates(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate())
        }
        else if (calendarMode === calendarModes.DAY) {
            let nextDay = new Date(year, month, day+1);
            while (nextDay.getDay() <= 1) nextDay = new Date(nextDay.getFullYear(), nextDay.getMonth(), nextDay.getDate()+1)
            setDay(nextDay.getDate());
            setMonth(nextDay.getMonth());
            setYear(nextDay.getFullYear());
            calculateWeekDates(nextDay.getFullYear(), nextDay.getMonth(), nextDay.getDate())
        }
    }

    const navigateBack = () => {
        if (calendarMode === calendarModes.MONTH) {
            const previousMonthAndYear = getPreviousMonthAndYear()
            setDay(1);
            setMonth(previousMonthAndYear[0]);
            setYear(previousMonthAndYear[1]);
            calculateMonthDates(previousMonthAndYear[1], previousMonthAndYear[0])
        }
        else if (calendarMode === calendarModes.WEEK) {
            const previousWeek = new Date(year, month, day-7);
            setDay(previousWeek.getDate());
            setMonth(previousWeek.getMonth());
            setYear(previousWeek.getFullYear());
            calculateWeekDates(previousWeek.getFullYear(), previousWeek.getMonth(), previousWeek.getDate())
        }
        else if (calendarMode === calendarModes.DAY) {
            let previousDay = new Date(year, month, day-1);
            while (previousDay.getDay() <= 1) previousDay = new Date(previousDay.getFullYear(), previousDay.getMonth(), previousDay.getDate()-1)
            setDay(previousDay.getDate());
            setMonth(previousDay.getMonth());
            setYear(previousDay.getFullYear());
            calculateWeekDates(previousDay.getFullYear(), previousDay.getMonth(), previousDay.getDate())
        }
    }
    

    // #### CALENDAR EVENT MANAGEMENT FUNCTIONS
    const createCalendarEvent = (calendarEvent) => {
        setCalendarEvents(calendarEvents.concat(calendarEvent));
        closeAddCalendarEventPopover();
    }

    const updateCalendarEvent = (updatedCalendarEvent) => {
        setCalendarEvents(calendarEvents.filter(calendarEvent => calendarEvent.id !== updatedCalendarEvent.id).concat(updatedCalendarEvent))
    }

    const deleteCalendarEvent = (id) => {
        setCalendarEvents(calendarEvents.filter(calendarEvent => calendarEvent.id !== id))
        closeCalendarEventPopover();
    }

    const onClickCalendarEvent = (e, calendarEvent) => {
        // If double click, navigate to repair page
        if (e.detail === 2 && calendarEvent.repair !== undefined) {
            navigate(`/repair/${calendarEvent.repair.id}`);
            return;
        }

        e.stopPropagation();

        closeCalendarEventPopover();
        closeAddCalendarEventPopover();

        openCalendarEventPopover(e, calendarEvent)
    }

    const handleDragStart = (event) => {
        setActiveEvent(calendarEvents.find(calendarEvent => calendarEvent.id === event.active.id));
    };
    
    const handleDragEnd = (event) => {
        setPopoverCalendarEvent({});
        setActiveEvent(null);

        if (event.over) {
            if (event.over.data.current.disabled === true) {
                return;
            }

            const [repairerName, date] = event.over.id.split(' ');
            const calendarEvent = calendarEvents.find(calendarEvent => calendarEvent.id === event.active.id);
            calendarEvent.repairer = repairerName;
            calendarEvent.date = date
            setCalendarEvents(calendarEvents.filter(calendarEvent => calendarEvent.id !== event.active.id).concat(calendarEvent))
        }
    };


    // #### CALENDAR EVENT POPOVER FUNCTIONS
    const openCalendarEventPopover = (e, calendarEvent) => {
        setPopoverCalendarEvent(calendarEvent);

        const calendarEventRect = e.target.closest('.CalendarEvent').getBoundingClientRect();

        setPopoverPosition(calculatePopoverPosition(e, calendarEventRect));
    }

    const closeCalendarEventPopover = () => {
        setPopoverCalendarEvent({});
    }

    const openAddCalendarEventPopover = (e, id, date, repairer) => {
        e.stopPropagation();

        closeCalendarEventPopover();
        setCreateCalendarEventPopover({id: id, date: date, repairer: repairer});

        const buttonRect = e.target.closest('.AddCalendarEventButton').getBoundingClientRect();

        setPopoverPosition(calculatePopoverPosition(e, buttonRect));
    }

    const closeAddCalendarEventPopover = () => {
        setCreateCalendarEventPopover({});
    }

    const calculatePopoverPosition = (e, clickedRect) => {
        const calendarRect = calendarRef.current.getBoundingClientRect();
        const pageScrollX = e.pageX - e.clientX;
        const pageScrollY = e.pageY - e.clientY;

        let popoverPositionX = 0; let popoverPositionY = 0;

        if ((calendarRect.width - pageScrollX) - (clickedRect.x + clickedRect.width + 6 - pageScrollX) < 180) {
            popoverPositionX = pageScrollX + clickedRect.x - 268
        }
        else {
            popoverPositionX = pageScrollX + clickedRect.x + clickedRect.width + 8
        }

        if ((calendarRect.height - pageScrollY) - (clickedRect.y - pageScrollY) < 200) {
            popoverPositionY = pageScrollY + clickedRect.y + clickedRect.height - 372
        }
        else {
            popoverPositionY = pageScrollY + clickedRect.y
        }

        return [popoverPositionX, popoverPositionY];
    }


    // #### YEAR/MONTH/WEEK/DAY INITIALISATION
    useEffect(() => {
        const currentYear = currentDate.getFullYear()
        const currentMonth = currentDate.getMonth()
        const currentDay = currentDate.getDate()
        
        // Set week to week of currently selected day
        const firstWeekDate = currentDay - new Date(currentYear, currentMonth, currentDay).getDay() + 2;

        if (firstWeekDate <= 0) {
            
            const numDaysInPreviousMonth = new Date(currentYear, currentMonth, 0).getDate();

            if (month <= 0) {
                setYear(currentYear-1);
                setMonth(11);
                setDay(firstWeekDate + numDaysInPreviousMonth);
                calculateWeekDates(currentYear-1, 11, firstWeekDate + numDaysInPreviousMonth);
            }
            else {
                setYear(currentYear);
                setMonth(currentMonth-1);
                setDay(firstWeekDate + numDaysInPreviousMonth);
                calculateWeekDates(currentYear, currentMonth-1, firstWeekDate + numDaysInPreviousMonth);
            }
        }
        else {
            setYear(currentYear);
            setMonth(currentMonth);
            setDay(firstWeekDate);

            calculateWeekDates(currentYear, currentMonth, firstWeekDate);
        }
    }, [])


    // #### PAGE TITLE
    const getCurrentViewDateRange = () => {
        if (calendarMode !== calendarModes.WEEK) return `${MONTHS[month]}, ${year}`;

        const numDaysInMonth = new Date(year, month+1, 0).getDate();
        const firstWeekDate = day - new Date(year, month, day).getDay() + 2;

        if (firstWeekDate <= numDaysInMonth - 4) return `${MONTHS[month]}, ${year}`;

        // Week overlaps into next month

        if (month < 11) return `${MONTHS[month]} - ${MONTHS[month+1]}, ${year}`;

        // Week overlaps into next year

        return `${MONTHS[11]}, ${year} - ${MONTHS[0]}, ${year+1}`;
    }


    // #### RENDERED CALENDAR VIEWS
    const renderedDayCalendarGrid = <div className='day-calendar'>

        <p className='day-title'>{DAYS[new Date(year, month, day).getDay() - 2]} <span className={currentDate.getDate() === day && currentDate.getMonth() === month && currentDate.getFullYear() === year ? 'current-day' : ''}>{day}</span></p>

        <div className='calendar-flex-container'>

            {/* Calendar flex: repairers */}
            {repairers.map(repairer => <div className='repairer-column'>
                <div className='title-row'>
                    {repairer.name}
                </div>

                <div className={`events-row ${repairer.hours[new Date(year, month, day).getDay() - 2] === 0 && 'disabled'}`}>
                    {calendarEvents.filter(calendarEvent => calendarEvent.repairer === repairer.name && parseInt(calendarEvent.date.split('-')[0]) === day && parseInt(calendarEvent.date.split('-')[1])-1 === month && parseInt(calendarEvent.date.split('-')[2]) === year && calendarEvent !== activeEvent).map(calendarEvent => <CalendarEvent calendarEvent={calendarEvent} mode={calendarMode} detailsSettings={detailsSettings} jobTypes={jobTypes} instrumentStatuses={instrumentStatuses} onClick={(e) => onClickCalendarEvent(e, calendarEvent)} />)}
                </div>
            </div>)}

            <div className='repairer-column'>
                <div className='title-row'>
                    Miscellaneous
                </div>

                <div className='events-row'>
                    {calendarEvents.filter(calendarEvent => calendarEvent.repairer === 'misc' && parseInt(calendarEvent.date.split('-')[0]) === day && parseInt(calendarEvent.date.split('-')[1])-1 === month && parseInt(calendarEvent.date.split('-')[2]) === year && calendarEvent !== activeEvent).map(calendarEvent => <CalendarEvent calendarEvent={calendarEvent} mode={calendarMode} detailsSettings={detailsSettings} jobTypes={jobTypes} instrumentStatuses={instrumentStatuses} onClick={(e) => onClickCalendarEvent(e, calendarEvent)} />)}
                </div>
            </div>

        </div>

    </div>

    const renderedWeekCalendarGrid = <div className='week-calendar'>

        {/* Top row of calendar grid */}
        <p className='calendar-grid-box days-of-the-week'></p>
        <p className='calendar-grid-box days-of-the-week'>Tue <span className={currentDate.getDate() === weekDates[0] && currentDate.getMonth() === month && currentDate.getFullYear() === year ? 'current-day' : ''}>{weekDates[0]}</span></p>
        <p className='calendar-grid-box days-of-the-week'>Wed <span className={currentDate.getDate() === weekDates[1] && currentDate.getMonth() === month && currentDate.getFullYear() === year && currentDate.getDate() >= weekDates[0] ? 'current-day' : ''}>{weekDates[1]}</span></p>
        <p className='calendar-grid-box days-of-the-week'>Thu <span className={currentDate.getDate() === weekDates[2] && currentDate.getMonth() === month && currentDate.getFullYear() === year && currentDate.getDate() >= weekDates[0] ? 'current-day' : ''}>{weekDates[2]}</span></p>
        <p className='calendar-grid-box days-of-the-week'>Fri <span className={currentDate.getDate() === weekDates[3] && currentDate.getMonth() === month && currentDate.getFullYear() === year && currentDate.getDate() >= weekDates[0] ? 'current-day' : ''}>{weekDates[3]}</span></p>
        <p className='calendar-grid-box days-of-the-week'>Sat <span className={currentDate.getDate() === weekDates[4] && currentDate.getMonth() === month && currentDate.getFullYear() === year && currentDate.getDate() >= weekDates[0] ? 'current-day' : ''}>{weekDates[4]}</span></p>

        {/* Calendar grid: repairers */}
        {repairers.map(repairer => <>
            <p className='calendar-grid-box repairer-name'>{repairer.name}</p>

            {weekDates.map((weekDate, index) => {

                let actualMonth = month;
                let actualYear = year;

                if (weekDate <= index) {
                    const nextMonthAndYear = getNextMonthAndYear();
                    actualMonth = nextMonthAndYear[0];
                    actualYear = nextMonthAndYear[1];
                }
                

                const weekDay = new Date(actualYear, actualMonth, weekDate).getDay()
                let maxTime = repairer.hours[weekDay-2] * 60;

                const daysEvents = calendarEvents.filter(calendarEvent => calendarEvent.repairer === repairer.name && parseInt(calendarEvent.date.split('-')[0]) === weekDate && parseInt(calendarEvent.date.split('-')[1])-1 === actualMonth && parseInt(calendarEvent.date.split('-')[2]) === actualYear)

                let scheduledTime = 0;
                daysEvents.forEach(event => {
                    if (activeEvent && event.id === activeEvent.id) return;
                    if (event.type === 'Repair')
                        scheduledTime += parseInt(event.time);
                    else {
                        if (event.all_day)
                            maxTime -= parseInt(repairer.hours[weekDay-2] * 60);
                        else
                            scheduledTime += parseInt(event.time);
                    }
                })

                const percentageFull = maxTime <= 0 ? 1 : scheduledTime / maxTime;
                const heatValue = percentageFull === 0 ? 0 : percentageFull <= 0.25 && 1 || percentageFull <= 0.6 && 2 || 3;

                const heatCSSVariables = ['var(--calendar-green-border)', 'var(--calendar-yellow-border)', 'var(--calendar-orange-border)', 'var(--calendar-red-border)']

                const disabled = repairer.hours[new Date(actualYear, actualMonth, weekDate).getDay() - 2] === 0

                return <CalendarGridBox disabled={disabled} uniqueId={`${repairer.name} ${weekDate.toString().padStart(2, '0')}-${(actualMonth+1).toString().padStart(2, '0')}-${actualYear}`}>
                    {calendarEvents.filter(calendarEvent => calendarEvent.repairer === repairer.name && parseInt(calendarEvent.date.split('-')[0]) === weekDate && parseInt(calendarEvent.date.split('-')[1])-1 === actualMonth && parseInt(calendarEvent.date.split('-')[2]) === actualYear && calendarEvent !== activeEvent).map(calendarEvent => <CalendarEvent calendarEvent={calendarEvent} mode={calendarMode} detailsSettings={detailsSettings} jobTypes={jobTypes} instrumentStatuses={instrumentStatuses} onClick={(e) => onClickCalendarEvent(e, calendarEvent)} />)}
                    
                    {!disabled && <>
                    
                    <AddCalendarEventButton onClick={(e) => openAddCalendarEventPopover(e, 1000, `${weekDate.toString().padStart(2, '0')}-${(month+1).toString().padStart(2, '0')}-${year}`, repairer.name)} />
                
                    <div className='time-heat-bar'>
                        <div className='heat' style={{backgroundColor: heatCSSVariables[heatValue], flex: percentageFull}} />
                        <div className='heat' style={{flex: 1 - percentageFull}} />
                    </div>
                    </>}

                </CalendarGridBox>
            })}
        </>)}
    
        {/* Calendar grid: miscellaneous */}
        <p className='calendar-grid-box repairer-name'>Miscellaneous</p>

        {weekDates.map((weekDate, index) => {

            let actualMonth = month;
            let actualYear = year;

            if (weekDate <= index) {
                const nextMonthAndYear = getNextMonthAndYear();
                actualMonth = nextMonthAndYear[0];
                actualYear = nextMonthAndYear[1];
            }

            return <CalendarGridBox uniqueId={`misc ${weekDate.toString().padStart(2, '0')}-${(actualMonth+1).toString().padStart(2, '0')}-${actualYear}`}>
                {calendarEvents.filter(calendarEvent => calendarEvent.repairer === 'misc' && parseInt(calendarEvent.date.split('-')[0]) === weekDate && parseInt(calendarEvent.date.split('-')[1])-1 === month && parseInt(calendarEvent.date.split('-')[2]) === year && calendarEvent !== activeEvent).map(calendarEvent => <CalendarEvent calendarEvent={calendarEvent} mode={calendarMode} detailsSettings={detailsSettings} jobTypes={jobTypes} instrumentStatuses={instrumentStatuses} onClick={(e) => onClickCalendarEvent(e, calendarEvent)} />)}
                <AddCalendarEventButton onClick={(e) => openAddCalendarEventPopover(e, 1000, `${weekDate}-${month+1}-${year}`, 'misc')} />
            </CalendarGridBox>
        })}
        
    </div>

    const renderedMonthCalendarGrid = <div className='month-calendar'>

        {/* Top row of calendar grid */}
        <p className='calendar-grid-box days-of-the-week'>Tue</p>
        <p className='calendar-grid-box days-of-the-week'>Wed</p>
        <p className='calendar-grid-box days-of-the-week'>Thu</p>
        <p className='calendar-grid-box days-of-the-week'>Fri</p>
        <p className='calendar-grid-box days-of-the-week'>Sat</p>

        {/* Calendar grid */}
        {monthDates.map((monthDate, index) => {
            // Find actual month and year of day
            let actualMonth = month;
            let actualYear = year;

            if (monthDate - index > 10) {
                const previousMonthAndYear = getPreviousMonthAndYear();
                actualMonth = previousMonthAndYear[0]
                actualYear = previousMonthAndYear[1]
            }
            else if (index - monthDate > 10) {
                const nextMonthAndYear = getNextMonthAndYear();
                actualMonth = nextMonthAndYear[0]
                actualYear = nextMonthAndYear[1]
            }

            const weekDay = new Date(actualYear, actualMonth, monthDate).getDay()
            let maxTime = 0;
            repairers.forEach(repairer => {
                maxTime += repairer.hours[weekDay-2] * 60;
            })

            const daysEvents = calendarEvents.filter(calendarEvent => parseInt(calendarEvent.date.split('-')[0]) === monthDate && parseInt(calendarEvent.date.split('-')[1])-1 === actualMonth && parseInt(calendarEvent.date.split('-')[2]) === actualYear)

            let scheduledTime = 0;
            daysEvents.forEach(event => {
                if (event.type === 'Repair')
                    scheduledTime += parseInt(event.time);
                else {
                    if (event.all_day)
                        maxTime -= parseInt(repairers.find(repairer => event.repairer === repairer.name).hours[weekDay-2] * 60)
                    else
                        scheduledTime += parseInt(event.time);
                }
            })


            const percentageFull = maxTime <= 0 ? 1 : scheduledTime / maxTime;
            const heatValue = percentageFull === 0 ? 0 : percentageFull <= 0.25 && 1 || percentageFull <= 0.6 && 2 || 3;

            return (
                <CalendarGridBox uniqueId={monthDate}
                    className={`${month !== actualMonth && 'faded'} ${['empty', 'quiet', 'moderate', 'busy'][heatValue]}`}
                    onClick={() => {
                        const firstWeekDate = monthDate - new Date(actualYear, actualMonth, monthDate).getDay() + 2;

                        setYear(new Date(actualYear, actualMonth, firstWeekDate).getFullYear());
                        setMonth(new Date(actualYear, actualMonth, firstWeekDate).getMonth());
                        setDay(new Date(actualYear, actualMonth, firstWeekDate).getDate());

                        calculateWeekDates(new Date(actualYear, actualMonth, firstWeekDate).getFullYear(), new Date(actualYear, actualMonth, firstWeekDate).getMonth(), new Date(actualYear, actualMonth, firstWeekDate).getDate());
                        
                        setCalendarMode(calendarModes.WEEK);
                    }}>
                    <p className='date'>{monthDate}</p>
                </CalendarGridBox>
            );
            }
        )}

    </div>

    return (
        <div className='Calendar'>

            <PageTitle static='true'>
                <p className='date-range'>{getCurrentViewDateRange()}</p>
                <div className='calendar-mode-toggle'>
                    <button className={calendarMode === calendarModes.DAY && 'active'} onClick={() => updateCalendarMode(calendarModes.DAY)}>Day</button>
                    <button className={calendarMode === calendarModes.WEEK && 'active'} onClick={() => updateCalendarMode(calendarModes.WEEK)}>Week</button>
                    <button className={calendarMode === calendarModes.MONTH && 'active'} onClick={() => updateCalendarMode(calendarModes.MONTH)}>Month</button>
                </div>
                <div className='navigation-arrows'>
                    <button onClick={navigateBack}>{'<'}</button>
                    <button onClick={navigateForward}>{'>'}</button>
                </div>
            </PageTitle>

            <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragOver={handleDragOver}>

                <div className='calendar-content'>

                    <NavigationCalendar
                        year={year} setYear={setYear}
                        month={month} setMonth={setMonth} calculateMonthDates={calculateMonthDates}
                        week={week} setWeek={setWeek} calculateWeekDates={calculateWeekDates}
                        day={day} setDay={setDay}
                        mode={calendarMode}
                    />

                    <ContentBlock className='calendar-box' ref={calendarRef}>

                        {/* Correct view calendar */}
                        {calendarMode === calendarModes.DAY && renderedDayCalendarGrid}
                        {calendarMode === calendarModes.WEEK && renderedWeekCalendarGrid}
                        {calendarMode === calendarModes.MONTH && renderedMonthCalendarGrid}

                        {/* Edit event popover */}
                        {popoverCalendarEvent.id !== undefined && 
                        <CalendarEventPopover calendarEvent={popoverCalendarEvent} updateCalendarEvent={updateCalendarEvent} deleteCalendarEvent={() => deleteCalendarEvent(popoverCalendarEvent.id)} position={popoverPosition} closeFunction={() => setPopoverCalendarEvent({})} />}

                        {/* Create event popover */}
                        {createCalendarEventPopover.id !== undefined && 
                        <CreateEventPopover id={createCalendarEventPopover.id} date={createCalendarEventPopover.date} repairer={createCalendarEventPopover.repairer} createCalendarEvent={createCalendarEvent} position={popoverPosition} cancel={() => setCreateCalendarEventPopover({})} />}

                    </ContentBlock>

                </div>
                
                {/* Calendar event drag overlay for navigating between different days/weeks/months */}
                {activeEvent && <DragOverlay>
                    <div className={`CalendarEvent ${activeEvent.color}`}>
                        {activeEvent.type === 'Repair' ?<>
                        <BlockTitle>{activeEvent.repair ? `Repair ${activeEvent.repair.id}` : ''}</BlockTitle>
                        
                        {/* Instrument */}
                        {calendarMode === calendarModes.DAY && <>

                        {detailsSettings.find(detail => detail.name === 'Instrument').dayEnabled &&
                        <BlockText>{activeEvent.repair && `${activeEvent.repair.instrument.manufacturer} ${activeEvent.repair.instrument.model} ${activeEvent.repair.instrument.type}`}</BlockText>}

                        {detailsSettings.find(detail => detail.name === 'Serial Number').dayEnabled &&
                        <BlockText>{activeEvent.repair && `Serial: ${activeEvent.repair.instrument.serial_number}`}</BlockText>}
                        
                        {detailsSettings.find(detail => detail.name === 'Instrument Status').dayEnabled &&
                        <BlockText>{activeEvent.repair && `${instrumentStatuses[activeEvent.repair.instrument.status].status}`}</BlockText>}
                        
                        {activeEvent.repair.customer.in_house ?
                        <BlockText>In House Repair</BlockText>
                        :
                        detailsSettings.find(detail => detail.name === 'Customer').dayEnabled &&
                        <BlockText>{activeEvent.repair && `${activeEvent.repair.customer.firstname} ${activeEvent.repair.customer.surname}`}</BlockText>}

                        {detailsSettings.find(detail => detail.name === 'Job Type').dayEnabled &&
                        <BlockText>{activeEvent.repair && `${jobTypes[activeEvent.repair.assessment.job_type].name}`}</BlockText>}
                        
                        </>}

                        {calendarMode === calendarModes.WEEK && <>
                        
                        {detailsSettings.find(detail => detail.name === 'Instrument').weekEnabled &&
                        <BlockText>{activeEvent.repair && `${activeEvent.repair.instrument.manufacturer} ${activeEvent.repair.instrument.model} ${activeEvent.repair.instrument.type}`}</BlockText>}

                        {detailsSettings.find(detail => detail.name === 'Serial Number').weekEnabled &&
                        <BlockText>{activeEvent.repair && `Serial: ${activeEvent.repair.instrument.serial_number}`}</BlockText>}
                        
                        {detailsSettings.find(detail => detail.name === 'Instrument Status').weekEnabled &&
                        <BlockText>{activeEvent.repair && `${instrumentStatuses[activeEvent.repair.instrument.status].status}`}</BlockText>}
                        
                        {activeEvent.repair.in_house ?
                        <BlockText>In House Repair</BlockText>
                        :
                        detailsSettings.find(detail => detail.name === 'Customer').weekEnabled &&
                        <BlockText>{activeEvent.repair && `${activeEvent.repair.customer.firstname} ${activeEvent.repair.customer.surname}`}</BlockText>}

                        {detailsSettings.find(detail => detail.name === 'Job Type').weekEnabled &&
                        <BlockText>{activeEvent.repair && `${jobTypes[activeEvent.repair.assessment.job_type].name}`}</BlockText>}
                        
                        </>}                        
                        <BlockText>{activeEvent.repair ? `${Math.floor(activeEvent.time / 60)} Hrs ${activeEvent.time % 60} Mins` : ''}</BlockText>
                        </> : <>
                        <BlockTitle>{activeEvent.title} </BlockTitle>
                        {activeEvent.description ? <BlockText>{activeEvent.description} </BlockText> : null}
                        <BlockText>{`${Math.floor(activeEvent.time / 60)} Hrs ${activeEvent.time % 60} Mins`}</BlockText>
                        </>}
                    </div>
                </DragOverlay>}
            
            </DndContext>

        </div>
    );
}

function CalendarGridBox(props) {
    const {setNodeRef} = useDroppable({
        id: props.uniqueId,
        data: { disabled: props.disabled }
    });
    
    return (
        <div className={`calendar-grid-box ${props.disabled && 'disabled'} ${props.className}`} onClick={props.onClick} ref={setNodeRef}>
            {props.children}
        </div>
    );
}

export default Calendar;