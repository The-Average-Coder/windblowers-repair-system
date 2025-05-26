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
                customer: {
                    firstname: 'Richard',
                    surname: 'Cox',
                    email: 'richardphilipcox@gmail.com',
                    phone: '07740300368',
                    address: '10 Cross Hill Close, LE12 6UJ'
                },
                instrument: {
                    type: 'Alto Saxophone',
                    manufacturer: 'Yamaha',
                    model: 'YAS-280',
                    serial_number: 'DEF456',
                    status: 1,
                },
                notes: 'Some assorted notes',
                assessment: {
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
                    notes: 'Some assessment notes'
                }
            }
        },
        {
            id: 4,
            type: 'Repair',
            title: '',
            description: '',
            date: '27-05-2025',
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
            time: '480',
            color: 'red',
            repairer: 'Ryan',
        },
        {
            id: 6,
            type: 'Other Event',
            title: 'Holiday',
            description: 'A Description',
            date: '31-05-2025',
            time: '480',
            color: 'yellow',
            repairer: 'Purple',
        },
        {
            id: 7,
            type: 'Other Event',
            title: 'Holiday',
            description: 'A Description',
            date: '31-05-2025',
            time: '480',
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
                customer: {
                    firstname: 'Richard',
                    surname: 'Cox',
                    email: 'richardphilipcox@gmail.com',
                    phone: '07740300368',
                    address: '10 Cross Hill Close, LE12 6UJ'
                },
                instrument: {
                    type: 'Alto Saxophone',
                    manufacturer: 'Yamaha',
                    model: 'YAS-280',
                    serial_number: 'DEF456',
                    status: 1,
                },
                notes: 'Some assorted notes',
                assessment: {
                    notes: 'Some assessment notes'
                }
            }
        }
    ])
    const [repairers, setRepairers] = useState(['Purple', 'Ryan']);


    // #### CONSTANTS
    const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    
    // #### STATE VARIABLES
    const [calendarMode, setCalendarMode] = useState(calendarModes.WEEK);

    const [year, setYear] = useState();
    const [month, setMonth] = useState();
    const [week, setWeek] = useState();
    const [day, setDay] = useState();

    const [weekDates, setWeekDates] = useState(['', '', '', '', '']);

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
    const handleDragStart = (event) => {
        eventBus.emit('handleDragStart', event)
    }

    const handleDragEnd = (event) => {
        eventBus.emit('handleDragEnd', event)
    }

    const handleDragOver = (event) => {
        eventBus.emit('handleDragOver', event)
    }


    // #### CALENDAR NAVIGATION FUNCTIONS
    const calculateWeekDates = (year, month, week) => {
        const firstWeekday = new Date(year, month, 1).getDay();
        const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
        const daysInPreviousMonth = new Date(year, month, 0).getDate();
        let firstDayOfTheWeek = (week-1) * 7 - firstWeekday + 3

        if (firstDayOfTheWeek <= 0) {
            firstDayOfTheWeek += daysInPreviousMonth
            setWeekDates([firstDayOfTheWeek-1 % daysInPreviousMonth + 1, (firstDayOfTheWeek) % daysInPreviousMonth + 1, (firstDayOfTheWeek+1) % daysInPreviousMonth + 1, (firstDayOfTheWeek+2) % daysInPreviousMonth + 1, (firstDayOfTheWeek+3) % daysInPreviousMonth + 1])
        }
        else if (firstDayOfTheWeek + 5 >= daysInCurrentMonth) {
            setWeekDates([firstDayOfTheWeek-1 % daysInCurrentMonth + 1, (firstDayOfTheWeek) % daysInCurrentMonth + 1, (firstDayOfTheWeek+1) % daysInCurrentMonth + 1, (firstDayOfTheWeek+2) % daysInCurrentMonth + 1, (firstDayOfTheWeek+3) % daysInCurrentMonth + 1])
        }
        else {
            setWeekDates([firstDayOfTheWeek, firstDayOfTheWeek+1, firstDayOfTheWeek+2, firstDayOfTheWeek+3, firstDayOfTheWeek+4])
        }
    }
    

    // #### CALENDAR EVENT MANAGEMENT FUNCTIONS
    const createCalendarEvent = (calendarEvent) => {
        setCalendarEvents(calendarEvents.concat(calendarEvent));
        closeCalendarEventPopover();
    }

    const updateCalendarEvent = (updatedCalendarEvent) => {
        setCalendarEvents(calendarEvents.filter(calendarEvent => calendarEvent.id !== updatedCalendarEvent.id).concat(updatedCalendarEvent))
        closeCalendarEventPopover();
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


    // #### CALENDAR EVENT POPOVER FUNCTIONS
    const openCalendarEventPopover = (e, calendarEvent) => {
        setPopoverCalendarEvent(calendarEvent);

        const calendarRect = calendarRef.current.getBoundingClientRect();
        const calendarEventRect = e.target.closest('.CalendarEvent').getBoundingClientRect();
        const pageScrollX = e.pageX - e.clientX;
        const pageScrollY = e.pageY - e.clientY;

        let popoverPositionX = 0; let popoverPositionY = 0;

        if (calendarRect.width - (pageScrollX + calendarEventRect.x + calendarEventRect.width + 6) < 180) {
            popoverPositionX = pageScrollX + calendarEventRect.x - 268
        }
        else {
            popoverPositionX = pageScrollX + calendarEventRect.x + calendarEventRect.width + 8
        }

        if (calendarRect.height - (pageScrollY + calendarEventRect.y) < 20) {
            popoverPositionY = pageScrollY + calendarEventRect.y + calendarEventRect.height - 312
        }
        else {
            popoverPositionY = pageScrollY + calendarEventRect.y
        }

        setPopoverPosition([popoverPositionX, popoverPositionY])
    }

    const closeCalendarEventPopover = () => {
        setPopoverCalendarEvent({});
    }

    const openAddCalendarEventPopover = (e, id, date, repairer) => {
        e.stopPropagation();

        closeCalendarEventPopover();
        setCreateCalendarEventPopover({id: id, date: date, repairer: repairer});

        const calendarRect = calendarRef.current.getBoundingClientRect();
        const buttonRect = e.target.closest('.AddCalendarEventButton').getBoundingClientRect();
        const pageScrollX = e.pageX - e.clientX;
        const pageScrollY = e.pageY - e.clientY;

        let popoverPositionX = 0; let popoverPositionY = 0;

        if (calendarRect.width - (pageScrollX + buttonRect.x + buttonRect.width + 6) < 180) {
            popoverPositionX = pageScrollX + buttonRect.x - 268
        }
        else {
            popoverPositionX = pageScrollX + buttonRect.x + buttonRect.width + 8
        }

        if (calendarRect.height - (pageScrollY + buttonRect.y) < 20) {
            popoverPositionY = pageScrollY + buttonRect.y + buttonRect.height - 312
        }
        else {
            popoverPositionY = pageScrollY + buttonRect.y
        }

        setPopoverPosition([popoverPositionX, popoverPositionY])
    }

    const closeAddCalendarEventPopover = () => {
        setCreateCalendarEventPopover({});
    }


    // #### YEAR/MONTH/WEEK/DAY INITIALISATION
    useEffect(() => {

        const currentYear = currentDate.getFullYear()
        const currentMonth = currentDate.getMonth()
        const firstWeekday = new Date(currentYear, currentMonth, 1).getDay();
        const currentWeek = Math.floor((currentDate.getDate() + firstWeekday - 1) / 7) + 1
        const currentDay = currentDate.getDate()

        setYear(currentYear);
        setMonth(currentMonth);
        setWeek(currentWeek);
        setDay(currentDay);

        calculateWeekDates(currentYear, currentMonth, currentWeek);

    }, [])





    /*
    useEffect(() => {
        const handleWeekSelected = (data) => {
            setPopoverCalendarEvent({});
            setCreateCalendarEventPopover(false);

            setYear(data[0]);
            setMonth(data[1]);
            setWeek(data[2]);

            const firstWeekday = new Date(data[0], data[1], 1).getDay();
            const daysInCurrentMonth = new Date(data[0], data[1] + 1, 0).getDate();
            const daysInPreviousMonth = new Date(data[0], data[1], 0).getDate();
            let firstDayOfTheWeek = (data[2]-1) * 7 - firstWeekday + 3

            if (firstDayOfTheWeek <= 0) {
                firstDayOfTheWeek += daysInPreviousMonth
                setWeekDates([firstDayOfTheWeek-1 % daysInPreviousMonth + 1, (firstDayOfTheWeek) % daysInPreviousMonth + 1, (firstDayOfTheWeek+1) % daysInPreviousMonth + 1, (firstDayOfTheWeek+2) % daysInPreviousMonth + 1, (firstDayOfTheWeek+3) % daysInPreviousMonth + 1])
            }
            else if (firstDayOfTheWeek + 5 >= daysInCurrentMonth) {
                setWeekDates([firstDayOfTheWeek-1 % daysInCurrentMonth + 1, (firstDayOfTheWeek) % daysInCurrentMonth + 1, (firstDayOfTheWeek+1) % daysInCurrentMonth + 1, (firstDayOfTheWeek+2) % daysInCurrentMonth + 1, (firstDayOfTheWeek+3) % daysInCurrentMonth + 1])
            }
            else {
                setWeekDates([firstDayOfTheWeek, firstDayOfTheWeek+1, firstDayOfTheWeek+2, firstDayOfTheWeek+3, firstDayOfTheWeek+4])
            }
        };

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
                const [repairer, day] = event.over.id.split(' ');
                const calendarEvent = calendarEvents.find(calendarEvent => calendarEvent.id === event.active.id);
                calendarEvent.repairer = repairer;
                calendarEvent.date = `${day}-${month+1}-${year}`
                setCalendarEvents(calendarEvents.filter(calendarEvent => calendarEvent.id !== event.active.id).concat(calendarEvent))
            }
        };

        eventBus.on('weekSelected', handleWeekSelected, true);
        eventBus.on('handleDragStart', handleDragStart);
        eventBus.on('handleDragEnd', handleDragEnd);
        return () => {
            eventBus.off('weekSelected', handleWeekSelected);
            eventBus.off('handleDragStart', handleDragStart);
            eventBus.off('handleDragEnd', handleDragEnd);
        }
    }, [month, year, calendarEvents])
    */

    const getCurrentViewDateRange = () => {

        if (calendarMode !== calendarModes.WEEK) return `${MONTHS[month]}, ${year}`;

        const firstWeekday = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month+1, 0).getDate();
        const lastWeekday = new Date(year, month, daysInMonth).getDay();

        if (week >= 2 && week <= 4) {
            return `${MONTHS[month]}, ${year}`;
        }
        if (week === 1) {
            if (firstWeekday <= 2) {
                return `${MONTHS[month]}, ${year}`;
            }
            else {
                if (month >= 1) {
                    return `${MONTHS[month-1]} - ${MONTHS[month]}, ${year}`;
                }
                else {
                    return `${MONTHS[11]}, ${year-1} - ${MONTHS[month]}, ${year}`;
                }
            }
        } 
        if (week === 5) {
            if (lastWeekday == 6 || lastWeekday <= 1) {
                return `${MONTHS[month]}, ${year}`;
            }
            else {
                if (month < 11) {
                    return `${MONTHS[month]} - ${MONTHS[month+1]}, ${year}`;
                }
                else {
                    return `${MONTHS[month]}, ${year} - ${MONTHS[0]}, ${year+1}`;
                }
            }
        }
        else {
            return '';
        }
    }





    const renderedCalendarGrid = repairers.map(repairer => <>

        <p className='calendar-grid-box repairer-name'>{repairer}</p>

        {weekDates.map(weekDate =>
            <CalendarGridBox uniqueId={`${repairer} ${weekDate}`}>
                {calendarEvents.filter(calendarEvent => calendarEvent.repairer === repairer && parseInt(calendarEvent.date.split('-')[0]) === weekDate && parseInt(calendarEvent.date.split('-')[1])-1 === month && parseInt(calendarEvent.date.split('-')[2]) === year && calendarEvent !== activeEvent).map(calendarEvent => <CalendarEvent calendarEvent={calendarEvent} onClick={(e) => onClickCalendarEvent(e, calendarEvent)} />)}
                <AddCalendarEventButton onClick={(e) => openAddCalendarEventPopover(e, 1000, `${weekDate}-${month+1}-${year}`, repairer)} />
            </CalendarGridBox>
        )}
    </>)





    return (
        <div className='Calendar'>

            <PageTitle>{getCurrentViewDateRange()}</PageTitle>

            <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragOver={handleDragOver}>

                <div className='calendar-content'>

                    <NavigationCalendar
                        year={year} setYear={setYear}
                        month={month} setMonth={setMonth}
                        week={week} setWeek={setWeek}
                        day={day} setDay={setDay}
                        mode={calendarMode}
                    />

                    <ContentBlock className='calendar-box'>

                        <div className='calendar-container' ref={calendarRef}>

                            {/* Top row of calendar grid */}
                            <p className='calendar-grid-box days-of-the-week'></p>
                            <p className='calendar-grid-box days-of-the-week'>Tue <span className={currentDate.getDate() === weekDates[0] && currentDate.getMonth() === month && currentDate.getFullYear() === year ? 'current-day' : ''}>{weekDates[0]}</span></p>
                            <p className='calendar-grid-box days-of-the-week'>Wed <span className={currentDate.getDate() === weekDates[1] && currentDate.getMonth() === month && currentDate.getFullYear() === year && currentDate.getDate() >= weekDates[0] ? 'current-day' : ''}>{weekDates[1]}</span></p>
                            <p className='calendar-grid-box days-of-the-week'>Thu <span className={currentDate.getDate() === weekDates[2] && currentDate.getMonth() === month && currentDate.getFullYear() === year && currentDate.getDate() >= weekDates[0] ? 'current-day' : ''}>{weekDates[2]}</span></p>
                            <p className='calendar-grid-box days-of-the-week'>Fri <span className={currentDate.getDate() === weekDates[3] && currentDate.getMonth() === month && currentDate.getFullYear() === year && currentDate.getDate() >= weekDates[0] ? 'current-day' : ''}>{weekDates[3]}</span></p>
                            <p className='calendar-grid-box days-of-the-week'>Sat <span className={currentDate.getDate() === weekDates[4] && currentDate.getMonth() === month && currentDate.getFullYear() === year && currentDate.getDate() >= weekDates[0] ? 'current-day' : ''}>{weekDates[4]}</span></p>

                            {renderedCalendarGrid}

                            {popoverCalendarEvent.id !== undefined && 
                            <CalendarEventPopover calendarEvent={popoverCalendarEvent} updateCalendarEvent={updateCalendarEvent} deleteCalendarEvent={() => deleteCalendarEvent(popoverCalendarEvent.id)} position={popoverPosition} closeFunction={() => setPopoverCalendarEvent({})} />}

                            {createCalendarEventPopover.id !== undefined && 
                            <CreateEventPopover id={createCalendarEventPopover.id} date={createCalendarEventPopover.date} repairer={createCalendarEventPopover.repairer} createCalendarEvent={createCalendarEvent} position={popoverPosition} cancel={() => setCreateCalendarEventPopover({})} />}

                        </div>

                    </ContentBlock>

                </div>
                
                {/* Calendar event drag overlay for navigating between different days/weeks/months */}
                {activeEvent && <DragOverlay>
                    <div className={`CalendarEvent ${activeEvent.color}`}>
                        {activeEvent.type === 'Repair' ?<>
                        <BlockTitle>{activeEvent.repair ? `Repair ${activeEvent.repair.id}` : ''}</BlockTitle>
                        <BlockText>{activeEvent.repair ? `${activeEvent.repair.instrument.manufacturer} ${activeEvent.repair.instrument.model} ${activeEvent.repair.instrument.type}` : ''}</BlockText>
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
        data: { disabled: false }
    });
    
    return (
        <div className='calendar-grid-box' ref={setNodeRef}>
            {props.children}
        </div>
    );
}

export default Calendar;