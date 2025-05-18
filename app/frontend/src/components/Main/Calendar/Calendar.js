import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { DragOverlay } from '@dnd-kit/core';

import eventBus from '../../../utils/eventBus';
import repairStatuses from '../../../enums/repairStatuses';

import PageTitle from '../../Common/Text/PageTitle';
import ActionButton from '../../Common/Buttons/ActionButton';
import ContentBlock from '../../Common/Containers/ContentBlock';
import BlockTitle from '../../Common/Text/BlockTitle';
import BlockText from '../../Common/Text/BlockText';
import CalendarEvent from './CalendarEvent';
import AddCalendarEventButton from './AddCalendarEventButton';
import CalendarGridBox from './CalendarGridBox';
import CalendarEventPopover from './CalendarEventPopover';
import CreateEventPopover from './CreateEventPopover';
import CreateRepairWindow from './CreateRepairWindow';

import './Calendar.css';

import plusWhite from '../../../images/plus-icon/plusWhite.png';

function Calendar() {

    const [calendarEvents, setCalendarEvents] = useState([
        {
            id: 1,
            type: 'Repair',
            title: '',
            description: '',
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
            description: '',
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
            description: '',
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
            description: '',
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
            description: 'A Description',
            date: '21-03-2025',
            time: '480',
            color: 'red',
            repairer: 'Ryan',
        },
        {
            id: 6,
            type: 'Other Event',
            title: 'Holiday',
            description: 'A Description',
            date: '18-03-2025',
            time: '480',
            color: 'yellow',
            repairer: 'Purple',
        },
        {
            id: 7,
            type: 'Other Event',
            title: 'Holiday',
            description: 'A Description',
            date: '18-03-2025',
            time: '480',
            color: 'indigo',
            repairer: 'Ryan',
        },
        {
            id: 8,
            type: 'Repair',
            title: '',
            description: '',
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

    const navigate = useNavigate();

    const [repairers, setRepairers] = useState(['Purple', 'Ryan'])

    const [year, setYear] = useState();
    const [month, setMonth] = useState();
    const [week, setWeek] = useState();
    const [weekDates, setWeekDates] = useState(['', '', '', '', '']);

    const [activeEvent, setActiveEvent] = useState(null);

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    const date = new Date();

    const [popoverCalendarEvent, setPopoverCalendarEvent] = useState({})
    const [popoverPosition, setPopoverPosition] = useState([0, 0])
    const [createCalendarEventPopover, setCreateCalendarEventPopover] = useState({});

    const [createRepairWindowOpen, setCreateRepairWindowOpen] = useState(false);

    const updateCalendarEvent = (updatedCalendarEvent) => {
        setCalendarEvents(calendarEvents.filter(calendarEvent => calendarEvent.id !== updatedCalendarEvent.id).concat(updatedCalendarEvent))
    }

    const deleteCalendarEvent = (id) => {
        setCalendarEvents(calendarEvents.filter(calendarEvent => calendarEvent.id !== id))
        setPopoverCalendarEvent({});
    }

    const createCalendarEvent = (calendarEvent) => {
        setCalendarEvents(calendarEvents.concat(calendarEvent));
        setCreateCalendarEventPopover({})
    }

    const onClickCalendarEvent = (e, calendarEvent) => {
        if (e.detail === 2 && calendarEvent.repair !== undefined) {
            navigate(`/repair/${calendarEvent.repair.id}`);
            return;
        }

        e.stopPropagation();

        setCreateCalendarEventPopover({});
        setPopoverCalendarEvent(calendarEvent);

        const calendarEventRect = e.target.closest('.CalendarEvent').getBoundingClientRect();
        const scrollX = e.pageX - e.clientX;
        const scrollY = e.pageY - e.clientY;

        const calendarRect = calendarRef.current.getBoundingClientRect();

        let popoverX = 0; let popoverY = 0;

        if (calendarRect.width - (scrollX + calendarEventRect.x + calendarEventRect.width + 6) < 180) {
            popoverX = scrollX + calendarEventRect.x - 268
        }
        else {
            popoverX = scrollX + calendarEventRect.x + calendarEventRect.width + 8
        }

        if (calendarRect.height - (scrollY + calendarEventRect.y) < 20) {
            popoverY = scrollY + calendarEventRect.y + calendarEventRect.height - 312
        }
        else {
            popoverY = scrollY + calendarEventRect.y
        }

        setPopoverPosition([popoverX, popoverY])
    }

    const openAddCalendarEventPopover = (e, id, date, repairer) => {
        e.stopPropagation();

        setCreateCalendarEventPopover({id: id, date: date, repairer: repairer});
        setPopoverCalendarEvent({});

        const buttonRect = e.target.closest('.AddCalendarEventButton').getBoundingClientRect();
        const scrollX = e.pageX - e.clientX;
        const scrollY = e.pageY - e.clientY;

        const calendarRect = calendarRef.current.getBoundingClientRect();

        let popoverX = 0; let popoverY = 0;

        if (calendarRect.width - (scrollX + buttonRect.x + buttonRect.width + 6) < 180) {
            popoverX = scrollX + buttonRect.x - 268
        }
        else {
            popoverX = scrollX + buttonRect.x + buttonRect.width + 8
        }

        if (calendarRect.height - (scrollY + buttonRect.y) < 20) {
            popoverY = scrollY + buttonRect.y + buttonRect.height - 312
        }
        else {
            popoverY = scrollY + buttonRect.y
        }

        setPopoverPosition([popoverX, popoverY])
    }

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
                {calendarEvents.filter(calendarEvent => calendarEvent.repairer === repairer && parseInt(calendarEvent.date.split('-')[0]) === weekDate && parseInt(calendarEvent.date.split('-')[1])-1 === month && parseInt(calendarEvent.date.split('-')[2]) === year && calendarEvent !== activeEvent).map(calendarEvent => <CalendarEvent calendarEvent={calendarEvent} onClick={(e) => onClickCalendarEvent(e, calendarEvent)} />)}
                <AddCalendarEventButton onClick={(e) => openAddCalendarEventPopover(e, 1000, `${weekDate}-${month+1}-${year}`, repairer)} />
            </CalendarGridBox>
        )
        }
    </>)

    return (
        <div className='Calendar'>

            <PageTitle>{getPageTitle()} <div className='gap' /> <ActionButton onClick={() => setCreateRepairWindowOpen(true)} colored='true'><img src={plusWhite} />Create Repair</ActionButton></PageTitle>

            <ContentBlock>

                <div className='calendar-container' ref={calendarRef}>
                    <p className='calendar-grid-box days-of-the-week'></p>
                    <p className='calendar-grid-box days-of-the-week'>Tue <span className={date.getDate() === weekDates[0] && date.getMonth() === month && date.getFullYear() === year ? 'current-day' : ''}>{weekDates[0]}</span></p>
                    <p className='calendar-grid-box days-of-the-week'>Wed <span className={date.getDate() === weekDates[1] && date.getMonth() === month && date.getFullYear() === year && date.getDate() >= weekDates[0] ? 'current-day' : ''}>{weekDates[1]}</span></p>
                    <p className='calendar-grid-box days-of-the-week'>Thu <span className={date.getDate() === weekDates[2] && date.getMonth() === month && date.getFullYear() === year && date.getDate() >= weekDates[0] ? 'current-day' : ''}>{weekDates[2]}</span></p>
                    <p className='calendar-grid-box days-of-the-week'>Fri <span className={date.getDate() === weekDates[3] && date.getMonth() === month && date.getFullYear() === year && date.getDate() >= weekDates[0] ? 'current-day' : ''}>{weekDates[3]}</span></p>
                    <p className='calendar-grid-box days-of-the-week'>Sat <span className={date.getDate() === weekDates[4] && date.getMonth() === month && date.getFullYear() === year && date.getDate() >= weekDates[0] ? 'current-day' : ''}>{weekDates[4]}</span></p>

                    {renderedCalendarGrid}

                    {popoverCalendarEvent.id !== undefined ? 
                    <CalendarEventPopover calendarEvent={popoverCalendarEvent} updateCalendarEvent={updateCalendarEvent} deleteCalendarEvent={() => deleteCalendarEvent(popoverCalendarEvent.id)} position={popoverPosition} closeFunction={() => setPopoverCalendarEvent({})} />
                    : null}

                    {createCalendarEventPopover.id !== undefined ? 
                    <CreateEventPopover id={createCalendarEventPopover.id} date={createCalendarEventPopover.date} repairer={createCalendarEventPopover.repairer} createCalendarEvent={createCalendarEvent} position={popoverPosition} cancel={() => setCreateCalendarEventPopover({})} />
                    : null}
                </div>

            </ContentBlock>

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

            {createRepairWindowOpen ? <CreateRepairWindow closeFunction={() => setCreateRepairWindowOpen(false)} /> : null}

        </div>
    );
}

export default Calendar;