import { useEffect, useState, useRef } from 'react';
import { 
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';

import eventBus from '../../../utils/eventBus';
import repairStatuses from '../../../enums/repairStatuses';

import PageTitle from '../../Common/Text/PageTitle';
import ActionButton from '../../Common/Buttons/ActionButton';
import ContentBlock from '../../Common/Containers/ContentBlock';

import './Calendar.css';

import plusWhite from '../../../images/plus-icon/plusWhite.png';
import CalendarEvent from './CalendarEvent';
import AddCalendarEventButton from './AddCalendarEventButton';
import CalendarGridBox from './CalendarGridBox';
import CalendarEventPopover from './CalendarEventPopover';

function Calendar() {

    const [calendarEvents, setCalendarEvents] = useState([
        {
            id: 1,
            type: 'Repair',
            title: '',
            date: '20-03-2025',
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
            date: '20-03-2025',
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
            date: '21-03-2025',
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
            date: '19-03-2025',
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
            date: '21-03-2025',
            time: '480',
            color: 'red',
            repairer: 'Ryan',
        },
        {
            id: 6,
            type: 'Other Event',
            title: 'Holiday',
            date: '18-03-2025',
            time: '480',
            color: 'yellow',
            repairer: 'Purple',
        },
        {
            id: 7,
            type: 'Other Event',
            title: 'Holiday',
            date: '18-03-2025',
            time: '480',
            color: 'indigo',
            repairer: 'Ryan',
        },
        {
            id: 8,
            type: 'Repair',
            title: '',
            date: '19-03-2025',
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

    const calendarRef = useRef(null);

    const [repairers, setRepairers] = useState(['Purple', 'Ryan'])

    const [year, setYear] = useState();
    const [month, setMonth] = useState();
    const [week, setWeek] = useState();
    const [weekDates, setWeekDates] = useState(['', '', '', '', '']);

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    const date = new Date();

    const [popoverCalendarEvent, setPopoverCalendarEvent] = useState({})
    const [popoverPosition, setPopoverPosition] = useState([0, 0])

    const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 5 }});
    const touchSensor = useSensor(TouchSensor, { activationConstraint: { distance: 5 }});
    const keyboardSensor = useSensor(KeyboardSensor);
    
    const sensors = useSensors(
        mouseSensor,
        touchSensor,
        keyboardSensor,
    );

    const updateCalendarEvent = (updatedCalendarEvent) => {
        setCalendarEvents(calendarEvents.filter(calendarEvent => calendarEvent.id !== updatedCalendarEvent.id).concat(updatedCalendarEvent))
    }

    const openPopover = (e, calendarEvent) => {
        e.stopPropagation();

        setPopoverCalendarEvent(calendarEvent)

        const calendarEventRect = e.target.closest('.CalendarEvent').getBoundingClientRect();
        const scrollX = e.pageX - e.clientX;
        const scrollY = e.pageY - e.clientY;

        const calendarRect = calendarRef.current.getBoundingClientRect();

        let popoverX = 0; let popoverY = 0;

        if (calendarRect.width - (scrollX + calendarEventRect.x + calendarEventRect.width + 6) < 180) {
            popoverX = scrollX + calendarEventRect.x - 228
        }
        else {
            popoverX = scrollX + calendarEventRect.x + calendarEventRect.width + 8
        }

        if (calendarRect.height - (scrollY + calendarEventRect.y) < 100) {
            popoverY = scrollY + calendarEventRect.y + calendarEventRect.height - 212
        }
        else {
            popoverY = scrollY + calendarEventRect.y
        }

        setPopoverPosition([popoverX, popoverY])
    }

    const handleDragEnd = (event) => {
        setPopoverCalendarEvent({})

        if (event.over) {
            const [repairer, day] = event.over.id.split(' ');
            const calendarEvent = calendarEvents.find(calendarEvent => calendarEvent.id === event.active.id);
            calendarEvent.repairer = repairer;
            calendarEvent.date = `${day}${calendarEvent.date.slice(2)}`
            setCalendarEvents(calendarEvents.filter(calendarEvent => calendarEvent.id !== event.active.id).concat(calendarEvent))
        }
    }

    useEffect(() => {
        const handleWeekSelected = (data) => {
            setPopoverCalendarEvent({})

            setYear(data[0])
            setMonth(data[1])
            setWeek(data[2])

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

        eventBus.on('weekSelected', handleWeekSelected);
        return () => eventBus.off('weekSelected', handleWeekSelected);
    }, [])

    const getPageTitle = () => {
        const firstWeekday = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month+1, 0).getDate();
        const lastWeekday = new Date(year, month, daysInMonth).getDay();

        if (week >= 2 && week <= 4) {
            return `${months[month]}, ${year}`;
        }
        if (week === 1) {
            if (firstWeekday <= 2) {
                return `${months[month]}, ${year}`;
            }
            else {
                if (month >= 1) {
                    return `${months[month-1]} - ${months[month]}, ${year}`;
                }
                else {
                    return `${months[11]}, ${year-1} - ${months[month]}, ${year}`;
                }
            }
        } 
        if (week === 5) {
            if (lastWeekday == 6 || lastWeekday <= 1) {
                return `${months[month]}, ${year}`;
            }
            else {
                if (month < 11) {
                    return `${months[month]} - ${months[month+1]}, ${year}`;
                }
                else {
                    return `${months[month]}, ${year} - ${months[0]}, ${year+1}`;
                }
            }
        }
        else {
            return '';
        }
    }

    const renderedCalendarGrid = repairers.map(repairer => <>
        <p className='calendar-grid-box repairer-name'>{repairer}</p>
        {
        weekDates.map(weekDate => <CalendarGridBox uniqueId={`${repairer} ${weekDate}`}>
                {calendarEvents.filter(calendarEvent => calendarEvent.repairer === repairer && parseInt(calendarEvent.date.slice(0, 2)) === weekDate).map(calendarEvent => <CalendarEvent calendarEvent={calendarEvent} onClick={(e) => openPopover(e, calendarEvent)} />)}
                <AddCalendarEventButton />
            </CalendarGridBox>
        )
        }
    </>)

    return (
        <div className='Calendar'>

            <PageTitle>{getPageTitle()} <div className='gap' /> <ActionButton colored='true'><img src={plusWhite} />Create Repair</ActionButton></PageTitle>

            <ContentBlock>

                <DndContext sensors={sensors} onDragEnd={handleDragEnd}>

                    <div className='calendar-container' ref={calendarRef} onClick={() => setPopoverCalendarEvent({})}>
                        <p className='calendar-grid-box days-of-the-week'></p>
                        <p className='calendar-grid-box days-of-the-week'>Tue <span className={date.getDate() === weekDates[0] ? 'current-day' : ''}>{weekDates[0]}</span></p>
                        <p className='calendar-grid-box days-of-the-week'>Wed <span className={date.getDate() === weekDates[1] ? 'current-day' : ''}>{weekDates[1]}</span></p>
                        <p className='calendar-grid-box days-of-the-week'>Thu <span className={date.getDate() === weekDates[2] ? 'current-day' : ''}>{weekDates[2]}</span></p>
                        <p className='calendar-grid-box days-of-the-week'>Fri <span className={date.getDate() === weekDates[3] ? 'current-day' : ''}>{weekDates[3]}</span></p>
                        <p className='calendar-grid-box days-of-the-week'>Sat <span className={date.getDate() === weekDates[4] ? 'current-day' : ''}>{weekDates[4]}</span></p>

                        {renderedCalendarGrid}

                        {popoverCalendarEvent.id !== undefined ? 
                        <CalendarEventPopover calendarEvent={popoverCalendarEvent} updateCalendarEvent={updateCalendarEvent} position={popoverPosition} />
                        : null}
                    </div>
                    
                </DndContext>

            </ContentBlock>

        </div>
    );
}

export default Calendar;