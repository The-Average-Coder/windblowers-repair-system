import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { DndContext, useSensor, useSensors, KeyboardSensor, MouseSensor } from '@dnd-kit/core';

import axios from 'axios';

import calendarModes from '../../enums/calendarModes';
import eventBus from '../../utils/eventBus';

import PageTitle from '../../components/Text/PageTitle';
import ContentBlock from '../../components/Containers/ContentBlock';

import CalendarDayView from'./CalendarViews/CalendarDayView';
import CalendarWeekView from './CalendarViews/CalendarWeekView';
import CalendarMonthView from './CalendarViews/CalendarMonthView';

import DragOverlayCalendarEvent from './Events/DragOverlayCalendarEvent';

import ExistingCalendarEventPopover from './Popovers/ExistingCalendarEventPopover';
import NewCalendarEventPopover from './Popovers/NewCalendarEventPopover';

import NavigationCalendar from './NavigationCalendar/NavigationCalendar';
import SchedulingRepairWidget from './Widgets/SchedulingRepairWidget';

import './Calendar.css';
import FilterByRepairerWidget from './Widgets/FilterByRepairerWidget';

/*
    Primary component for calendar page. Stores all events, manages the rendering of the grid
    and contained events, navigation through the calendar, creation and updating of calendar events.
*/

function Calendar() {

    // #### STATE VARIABLES
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [repairers, setRepairers] = useState([]);

    // Settings
    const [detailsSettings, setDetailsSettings] = useState([]);
    const [jobTypes, setJobTypes] = useState([]);
    const [instrumentStatuses, setInstrumentStatuses] = useState([]);

    // Current State
    const [calendarMode, setCalendarMode] = useState(calendarModes.WEEK);

    const [year, setYear] = useState();
    const [month, setMonth] = useState();
    const [day, setDay] = useState();

    const [draggingEvent, setDraggingEvent] = useState(null);

    // Popovers
    const [popoverCalendarEvent, setPopoverCalendarEvent] = useState({})
    const [createCalendarEventPopover, setCreateCalendarEventPopover] = useState({});
    const [popoverPosition, setPopoverPosition] = useState([0, 0])

    // Scheduling Repair Widget
    const [schedulingRepair, setSchedulingRepair] = useState({})

    // Filter By Repairer Widget
    const [repairerFilter, setRepairerFilter] = useState(0);


    // #### DATABASE FETCH DATA
    useEffect(() => {
        axios.get('/api/calendarEvents/get')
            .then(response => setCalendarEvents(response.data))
            .catch(error => console.log(error));
        
        axios.get('/api/repairers/get')
            .then(response => setRepairers(response.data))
            .catch(error => console.log(error));
        
        axios.get('/api/settings/getJobTypes')
            .then(response => setJobTypes(response.data))
            .catch(error => console.log(error));

        axios.get('/api/settings/getInstrumentStatuses')
            .then(response => setInstrumentStatuses(response.data))
            .catch(error => console.log(error));
        
        axios.get('/api/settings/getCalendarDetailSettings')
            .then(response => setDetailsSettings(response.data))
            .catch(error => console.log(error));
    }, [])


    // #### CONSTANTS
    const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']


    // #### DRAG AND DROP INITIALISATION
    const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 5 }});
    const keyboardSensor = useSensor(KeyboardSensor);
    
    const sensors = useSensors(
        mouseSensor,
        keyboardSensor,
    )


    // #### OTHER MISCELLANEOUS INITIALISATION 
    const navigate = useNavigate();
    const location = useLocation();
    const calendarRef = useRef(null);
    const currentDate = new Date();


    // #### UTILITY FUNCTIONS
    const findEventById = (id) => {
        return calendarEvents.find(calendarEvent => calendarEvent.id === id);
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


    // #### SET WIDGET IF SCHEDULING REPAIR
    useEffect(() => {
        // Check state to see whether a specific repair is being scheduled
        if (location.state === null) return;

        setSchedulingRepair(location.state.scheduling_repair);
        window.history.replaceState({}, '') // Clear state for reloads etc
    }, [])

    const removeSchedulingRepair = () => {
        setSchedulingRepair({});
    }


    // #### CALENDAR EVENT POPOVER FUNCTIONS
    const openCalendarEventPopover = (e, calendarEvent) => {
        setPopoverCalendarEvent(calendarEvent);

        const calendarEventRect = e.target.closest('.CalendarEvent').getBoundingClientRect();

        setPopoverPosition(calculatePopoverPosition(e, calendarEventRect));
    }

    const closeCalendarEventPopover = () => {
        setPopoverCalendarEvent({});
    }

    const openAddCalendarEventPopover = (e, date, repairerId) => {
        e.stopPropagation();

        closeCalendarEventPopover();
        
        const creatingCalendarEvent = {
            date: date,
            repairer_id: repairerId,
            repair: schedulingRepair.id ? schedulingRepair : null
        }
        setCreateCalendarEventPopover(creatingCalendarEvent);

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


    // #### DRAG AND DROP EVENTS
    const handleDragOver = (event) => {
        eventBus.emit('handleDragOver', event)
    }

    const handleDragStart = (event) => {
        setDraggingEvent(findEventById(event.active.id));
    }
    
    const handleDragEnd = (event) => {
        closeCalendarEventPopover();
        setDraggingEvent(null);

        if (event.over) {
            // Event is over calendar grid day

            // Make sure grid day isn't disabled
            if (event.over.data.current.disabled) return;

            const [repairerId, date] = event.over.id.split(' ');

            const calendarEvent = findEventById(event.active.id);
            calendarEvent.repairer_id = parseInt(repairerId);
            calendarEvent.date = date

            updateCalendarEvent(calendarEvent)
        }
    }


    // #### CALENDAR NAVIGATION FUNCTIONS
    const updateCalendarMode = (newCalendarMode) => {
        if (newCalendarMode === calendarMode) return;

        // If switching to month
        if (newCalendarMode === calendarModes.MONTH) {
            setCalendarMode(newCalendarMode);

            setDay(1);

            return;
        };

        // If switching to day
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

        // Switching to week
        let firstWeekDate;

        // If switching from day to week
        if (calendarMode === calendarModes.DAY) {

            // Set week to week of currently selected day
            firstWeekDate = getFirstWeekDateOfDate(new Date(year, month, day))
        }

        // If switching from month to week
        else if (calendarMode === calendarModes.MONTH) {

            // If month viewing is current month
            if (month === currentDate.getMonth()) {

                // Set week to current week
                firstWeekDate = getFirstWeekDateOfDate(currentDate);
            }
            else {

                // Set week to first week in month
                firstWeekDate = getFirstWeekDateOfDate(new Date(year, month, 1));

            }
        }

        navigateToWeek(firstWeekDate);
        
    }

    const navigateForward = () => {
        if (calendarMode === calendarModes.MONTH) {
            setMonth(getNextMonth(year, month));
            setYear(getYearOfNextMonth(year, month));
        }
        else if (calendarMode === calendarModes.WEEK) {
            const nextWeek = new Date(year, month, day+7);

            setDay(nextWeek.getDate());
            setMonth(nextWeek.getMonth());
            setYear(nextWeek.getFullYear());
        }
        else if (calendarMode === calendarModes.DAY) {
            let nextDay = new Date(year, month, day+1);

            // Skip Sunday and Monday
            while (nextDay.getDay() <= 1)
                nextDay = new Date(nextDay.getFullYear(), nextDay.getMonth(), nextDay.getDate()+1)

            setDay(nextDay.getDate());
            setMonth(nextDay.getMonth());
            setYear(nextDay.getFullYear());
        }
    }

    const navigateBack = () => {
        if (calendarMode === calendarModes.MONTH) {
            setMonth(getPreviousMonth(year, month));
            setYear(getYearOfPreviousMonth(year, month));
        }
        else if (calendarMode === calendarModes.WEEK) {
            const previousWeek = new Date(year, month, day-7);

            setDay(previousWeek.getDate());
            setMonth(previousWeek.getMonth());
            setYear(previousWeek.getFullYear());
        }
        else if (calendarMode === calendarModes.DAY) {
            let previousDay = new Date(year, month, day-1);

            // Skip Sunday and Monday
            while (previousDay.getDay() <= 1)
                previousDay = new Date(previousDay.getFullYear(), previousDay.getMonth(), previousDay.getDate()-1)
            
            setDay(previousDay.getDate());
            setMonth(previousDay.getMonth());
            setYear(previousDay.getFullYear());
        }
    }

    const navigateToWeek = (firstWeekDate) => {
        setYear(firstWeekDate.getFullYear());
        setMonth(firstWeekDate.getMonth());
        setDay(firstWeekDate.getDate());
        setCalendarMode(calendarModes.WEEK);
    }

    const navigateToMonth = (month) => {
        setYear(month.getFullYear());
        setMonth(month.getMonth());
    }

    const navigateToDay = (date) => {
        setYear(date.getFullYear());
        setMonth(date.getMonth());
        setDay(date.getDate())
    }

    const navigateToToday = () => {
        let date = currentDate;
        if (calendarMode === calendarModes.WEEK) date = getFirstWeekDateOfDate(currentDate);
        navigateToDay(date)
    }
    

    // #### CALENDAR EVENT MANAGEMENT FUNCTIONS
    const createCalendarEvent = (calendarEvent) => {
        axios.post('/api/calendarEvents/create', calendarEvent)
            .then(response => {
                setCalendarEvents(calendarEvents.concat({...calendarEvent, id: response.data.insertId}))
            })
            .catch(error => console.log(error));

        closeAddCalendarEventPopover();
    }

    const updateCalendarEvent = (updatedCalendarEvent) => {
        axios.put('/api/calendarEvents/update', updatedCalendarEvent)
            .catch(error => console.log(error));

        setCalendarEvents(calendarEvents.filter(calendarEvent => calendarEvent.id !== updatedCalendarEvent.id).concat(updatedCalendarEvent))
    }

    const deleteCalendarEvent = (id) => {
        axios.delete(`/api/calendarEvents/delete/${id}`)
            .catch(error => console.log(error));

        setCalendarEvents(calendarEvents.filter(calendarEvent => calendarEvent.id !== id))
        closeCalendarEventPopover();
    }

    const onClickCalendarEvent = (e, calendarEvent) => {
        // If double click, navigate to repair page
        if (e.detail === 2 && calendarEvent.repair !== null && calendarEvent.repair.id !== undefined) {
            navigate(`/repair/${calendarEvent.repair.id}`);
            return;
        }

        // Else open popover

        e.stopPropagation();

        closeCalendarEventPopover();
        closeAddCalendarEventPopover();

        openCalendarEventPopover(e, calendarEvent)
    }


    // #### YEAR/MONTH/WEEK/DAY INITIALISATION
    useEffect(() => {
        const firstWeekDate = getFirstWeekDateOfDate(currentDate);

        navigateToWeek(firstWeekDate)
    }, [])


    // #### SAVE AND LOAD SESSION
    useEffect(() => {

        // Load data
        const raw = sessionStorage.getItem('calendarViewState');
        console.log(raw)
        
        if (raw) {

            const { calendarMode, year, month, day } = JSON.parse(raw);

            setCalendarMode(calendarMode);

            if (calendarMode === calendarModes.DAY) {
                navigateToDay(new Date(year, month, day))
            }
            if (calendarMode === calendarModes.WEEK) {
                navigateToDay(getFirstWeekDateOfDate(new Date(year, month, day)))
            }
            else {
                navigateToMonth(new Date(year, month, 1))
            }

            return;

        }

        // If no data, then go to this week
        const firstWeekDate = getFirstWeekDateOfDate(currentDate);

        navigateToWeek(firstWeekDate)
    }, [])

    useEffect(() => {
        const calendarState = { calendarMode, year, month, day };
        sessionStorage.setItem('calendarViewState', JSON.stringify(calendarState));
    }, [calendarMode, year, month, day]);


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


    return (
        <div className='Calendar'>

            <PageTitle static='true'>

                <p className='date-range'>{getCurrentViewDateRange()}</p>

                <div className='calendar-mode-toggle'>
                    <button className={calendarMode === calendarModes.DAY && 'active'} onClick={() => updateCalendarMode(calendarModes.DAY)}>Day</button>
                    <button className={calendarMode === calendarModes.WEEK && 'active'} onClick={() => updateCalendarMode(calendarModes.WEEK)}>Week</button>
                    <button className={calendarMode === calendarModes.MONTH && 'active'} onClick={() => updateCalendarMode(calendarModes.MONTH)}>Month</button>
                </div>

                <button className='today-button' onClick={navigateToToday}>Today</button>

                <div className='navigation-arrows'>
                    <button onClick={navigateBack}>{'<'}</button>
                    <button onClick={navigateForward}>{'>'}</button>
                </div>
                
            </PageTitle>

            <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragOver={handleDragOver}>

                <div className='calendar-content'>

                    <div className='sidebar'>
                        <NavigationCalendar
                            mode={calendarMode}
                            year={year}
                            month={month}
                            day={day}
                            navigateToMonth={navigateToMonth}
                            navigateToWeek={navigateToWeek}
                            navigateToDay={navigateToDay}
                        />

                        {calendarMode === calendarModes.MONTH &&
                        <FilterByRepairerWidget repairers={repairers} repairerFilter={repairerFilter} updateRepairerFilter={setRepairerFilter} />
                        }
                        
                        {schedulingRepair.id &&
                        <SchedulingRepairWidget schedulingRepair={schedulingRepair} removeSchedulingRepair={removeSchedulingRepair} />
                        }
                    </div>

                    <ContentBlock className='calendar-box' ref={calendarRef}>

                        {/* Correct view calendar */}
                        {calendarMode === calendarModes.DAY &&
                        <CalendarDayView
                            calendarEvents={calendarEvents}
                            date={new Date(year, month, day)}
                            repairers={repairers}
                            detailsSettings={detailsSettings}
                            jobTypes={jobTypes}
                            instrumentStatuses={instrumentStatuses}
                            onClickCalendarEvent={onClickCalendarEvent}
                        />
                        }

                        {calendarMode === calendarModes.WEEK &&
                        <CalendarWeekView
                            calendarEvents={calendarEvents}
                            firstWeekDate={new Date(year, month, day)}
                            repairers={repairers}
                            detailsSettings={detailsSettings}
                            jobTypes={jobTypes}
                            instrumentStatuses={instrumentStatuses}
                            schedulingRepairDeadline={schedulingRepair.deadline}
                            onClickCalendarEvent={onClickCalendarEvent}
                            openAddCalendarEventPopover={openAddCalendarEventPopover}
                        />
                        }

                        {calendarMode === calendarModes.MONTH &&
                        <CalendarMonthView
                            calendarEvents={calendarEvents}
                            firstMonthDate={new Date(year, month, day)}
                            repairers={repairers}
                            repairerFilter={repairerFilter}
                            navigateToWeek={navigateToWeek}
                        />
                        }

                        {/* Edit event popover */}
                        {popoverCalendarEvent.id !== undefined &&
                        <ExistingCalendarEventPopover calendarEvent={popoverCalendarEvent} updateCalendarEvent={updateCalendarEvent} deleteCalendarEvent={() => deleteCalendarEvent(popoverCalendarEvent.id)} position={popoverPosition} closeFunction={() => setPopoverCalendarEvent({})} />}

                        {/* Create event popover */}
                        {createCalendarEventPopover.date !== undefined &&
                        <NewCalendarEventPopover date={createCalendarEventPopover.date} repairerId={createCalendarEventPopover.repairer_id} schedulingRepair={createCalendarEventPopover.repair} createCalendarEvent={createCalendarEvent} position={popoverPosition} cancel={() => setCreateCalendarEventPopover({})} />}

                    </ContentBlock>

                </div>
                
                {/* Calendar event drag overlay for navigating between different weeks
                and therefore different drag and drop contexts*/}
                {draggingEvent && <DragOverlayCalendarEvent
                    draggingEvent={draggingEvent}
                    detailsSettings={detailsSettings}
                    instrumentStatuses={instrumentStatuses}
                    jobTypes={jobTypes}
                />}
            
            </DndContext>

        </div>
    );
}

export default Calendar;