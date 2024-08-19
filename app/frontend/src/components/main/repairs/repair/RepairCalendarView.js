import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createCalendarEvent, deleteCalendarEvent, moveCalendarEvent, updateEventPriority } from '../../../../reducers/calendar_events/calendarEventsSlice';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import calendarEventColours from '../../../../enums/calendarEventColours';
import ActionButton from '../../../common/ActionButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { loadInstrument } from '../../../../reducers/instruments/instrumentsSlice';

function RepairCalendarView(props) {
    const [instrument, setInstrument] = useState();

    const [popUpShowing, setPopUpShowing] = useState(false);
    const [popUpPosition, setPopUpPosition] = useState([]);
    const [popUpWidth, setPopUpWidth] = useState(200);
    const [popUpEvent, setPopUpEvent] = useState();
    const [popUpPriority, setPopUpPriority] = useState();

    const [createPopUpShowing, setCreatePopUpShowing] = useState(false);
    const [createPopUpPosition, setCreatePopUpPosition] = useState([]);
    const [createPopUpDate, setCreatePopUpDate] = useState();
    const [createPopUpWidth, setCreatePopUpWidth] = useState(200);
    const [createPopUpTime, setCreatePopUpTime] = useState(0);
    const [createPopUpPriority, setCreatePopUpPriority] = useState();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const popUpRef = useRef(null);
    const createEventPopUpRef = useRef(null);

    const instrumentsLoading = useSelector(state => {
        return state.activeInstruments.instrumentsLoading;
    });

    const loadingInstrument = useSelector(state => {
        return state.activeInstruments.loadingInstrument;
    })

    const activeInstrument = useSelector(state => {
        const instrument = state.activeInstruments.activeInstruments.find(instrument => instrument.id === props.repair.instrument_id);
        return instrument ? instrument : null;
    });

    const loadedInstrument = useSelector(state => {
        const loadedInstrument = state.activeInstruments.loadedInstrument;
        return loadedInstrument ? loadedInstrument : null;
    })

    useEffect(() => {
        setInstrument(activeInstrument)
    }, [activeInstrument])

    useEffect(() => {
        if (!instrumentsLoading && activeInstrument === null) {
            dispatch(loadInstrument(props.repair.instrument_id))
        }
        else {
            setInstrument(activeInstrument);
        }
    }, [instrumentsLoading])

    useEffect(() => {
        if (loadedInstrument) setInstrument(loadedInstrument);
    }, [loadingInstrument, loadedInstrument])

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    })

    const showPopUp = (info) => {
        const rect = info.el.getBoundingClientRect();
        setPopUpShowing(true);
        setPopUpPosition([rect.left + window.scrollX, rect.top + window.scrollY]);
        setPopUpWidth(rect.width)
        setPopUpEvent(info.event);
        setPopUpPriority(info.event.extendedProps.priority);
    }

    const handleOutsideClick = (e) => {
        if (popUpRef.current && !popUpRef.current.contains(e.target))  {
            setPopUpShowing(false);
        }if (createEventPopUpRef.current && !createEventPopUpRef.current.contains(e.target))  {
            setCreatePopUpShowing(false);
        }
    }

    const moveEvent = (info) => {
        dispatch(moveCalendarEvent({ id: parseInt(info.event.id), start: info.event.start }));
    }

    const createEvent = (info) => {
        const rect = info.dayEl.getBoundingClientRect();
        setCreatePopUpShowing(true);
        setCreatePopUpPosition([rect.left + window.scrollX + 2, rect.top + window.scrollY + 32]);
        setCreatePopUpDate(info.dateStr)
        setCreatePopUpWidth(rect.width - 4)
        setCreatePopUpPriority(1);
        console.log(info)
    }

    const cancelCreateEvent = () => {
        setCreatePopUpShowing(false);
    }

    const submitCreateEvent = () => {
        dispatch(createCalendarEvent({ repair_id: parseInt(props.repair.id), instrument_type: instrument.type, color: calendarEventColours.OPEN,
            time: createPopUpTime, start: createPopUpDate, priority: createPopUpPriority }));
        setCreatePopUpShowing(false);
    }

    const navigateToRepair = (repairId) => {
        navigate(`/repairs/repair/${repairId}`);
    }

    const deleteEvent = (eventId) => {
        dispatch(deleteCalendarEvent(parseInt(eventId)));
        setPopUpShowing(false);
    }

    const updateTime = (hours, minutes) => {
        const newTime = hours * 60 + minutes
        setCreatePopUpTime(newTime)
    }

    return (
        <div className='repair-calendar-view'>
                <FullCalendar
                    height='100%'
                    plugins={[ dayGridPlugin, interactionPlugin ]}
                    initialView='dayGridMonth'
                    headerToolbar={{start: 'title', center: '', end: 'prev,next'}}
                    buttonText={{month: 'Single Month', threeMonth: 'Three Months'}}
                    hiddenDays={[0,1]}
                    events={props.events}
                    editable={true}
                    eventStartEditable={true}
                    eventDurationEditable={false}
                    eventOrder='-priority,title'
                    eventOrderStrict={true}
                    eventClick={showPopUp}
                    eventDrop={moveEvent}
                    dateClick={createEvent}
                    defaultAllDay={true}
                    fixedWeekCount={false}
                />

                {popUpShowing ?
                <div className='popup' style={{top: popUpPosition[1], left: popUpPosition[0], width: `${popUpWidth}px`, backgroundColor: popUpEvent.backgroundColor}} ref={popUpRef} >
                    <p className='popup-title'>{popUpEvent.title}</p>
                    {
                    popUpEvent.backgroundColor === 'limegreen' ?
                    <>
                    <div className='priority-input-green'>
                        <p>{popUpPriority}</p>
                        <FontAwesomeIcon icon='fa-solid fa-caret-up' className='upper-spin-button-green' onClick={() => {dispatch(updateEventPriority({ id: parseInt(popUpEvent.id), priority: parseInt(popUpPriority+1) }));setPopUpPriority(popUpPriority+1)}} />
                        <FontAwesomeIcon icon='fa-solid fa-caret-down' className='lower-spin-button-green' onClick={() => {if (popUpPriority > 1){dispatch(updateEventPriority({ id: parseInt(popUpEvent.id), priority: parseInt(popUpPriority-1) }));setPopUpPriority(popUpPriority-1)}}} />
                    </div>
                    <ActionButton className='delete-button-green' contents='Remove Event' onClick={() => deleteEvent(popUpEvent.id)} />
                    <ActionButton className='navigate-button-green' contents='Go To Repair' onClick={() => navigateToRepair(popUpEvent._def.extendedProps.repair_id)} />
                    </>
                    :
                    popUpEvent.backgroundColor === calendarEventColours.OPEN ?
                    <>
                    <div className='priority-input'>
                        <p>{popUpPriority}</p>
                        <FontAwesomeIcon icon='fa-solid fa-caret-up' className='upper-spin-button' onClick={() => {dispatch(updateEventPriority({ id: parseInt(popUpEvent.id), priority: parseInt(popUpPriority+1) }));setPopUpPriority(popUpPriority+1)}} />
                        <FontAwesomeIcon icon='fa-solid fa-caret-down' className='lower-spin-button' onClick={() => {if (popUpPriority > 1){dispatch(updateEventPriority({ id: parseInt(popUpEvent.id), priority: parseInt(popUpPriority-1) }));setPopUpPriority(popUpPriority-1)}}} />
                    </div>
                    <ActionButton className='delete-button' contents='Remove Event' onClick={() => deleteEvent(popUpEvent.id)} />
                    <ActionButton className='navigate-button' contents='Go To Repair' onClick={() => navigateToRepair(popUpEvent._def.extendedProps.repair_id)} />
                    </>
                    :
                    <>
                    <div className='priority-input-grey'>
                        <p>{popUpPriority}</p>
                        <FontAwesomeIcon icon='fa-solid fa-caret-up' className='upper-spin-button-grey' onClick={() => {dispatch(updateEventPriority({ id: parseInt(popUpEvent.id), priority: parseInt(popUpPriority+1) }));setPopUpPriority(popUpPriority+1)}} />
                        <FontAwesomeIcon icon='fa-solid fa-caret-down' className='lower-spin-button-grey' onClick={() => {if (popUpPriority > 1){dispatch(updateEventPriority({ id: parseInt(popUpEvent.id), priority: parseInt(popUpPriority-1) }));setPopUpPriority(popUpPriority-1)}}} />
                    </div>
                    
                    <ActionButton className='delete-button-grey' contents='Remove Event' onClick={() => deleteEvent(popUpEvent.id)} />
                    <ActionButton className='navigate-button-grey' contents='Go To Repair' onClick={() => navigateToRepair(popUpEvent._def.extendedProps.repair_id)} />
                    </>
                    }
                </div>
                : null }

                {createPopUpShowing ? 
                <div className='create-popup' style={{top: createPopUpPosition[1], left: createPopUpPosition[0], width: `${createPopUpWidth}px`}} ref={createEventPopUpRef} >
                    <p className='popup-title'>Create Task:</p>
                    <div className='time-input'>
                        <select className='time-hours' value={Math.floor(createPopUpTime / 60)} onChange={(e) => updateTime(parseInt(e.target.value), createPopUpTime % 60)}>
                            <option value='0' selected>0 Hours</option>
                            <option value='1'>1 Hour</option> 
                            <option value='2'>2 Hours</option> 
                            <option value='3'>3 Hours</option> 
                            <option value='4'>4 Hours</option>
                            <option value='5'>5 Hours</option>
                            <option value='6'>6 Hours</option>
                            <option value='7'>7 Hours</option>
                            <option value='8'>8 Hours</option>
                            <option value='9'>9 Hours</option>
                            <option value='10'>10 Hours</option>
                            <option value='11'>11 Hours</option>
                            <option value='12'>12 Hours</option>
                            <option value='13'>13 Hours</option>
                            <option value='14'>14 Hours</option>
                            <option value='15'>15 Hours</option>
                            <option value='16'>16 Hours</option>
                            <option value='17'>17 Hours</option>
                            <option value='18'>18 Hours</option>
                            <option value='19'>19 Hours</option>
                            <option value='20'>20 Hours</option>
                            <option value='21'>21 Hours</option>
                            <option value='22'>22 Hours</option>
                            <option value='23'>23 Hours</option>
                            <option value='24'>24 Hours</option>
                        </select>
                        <select className='time-minutes' value={createPopUpTime % 60} onChange={(e) => updateTime(Math.floor(createPopUpTime / 60), parseInt(e.target.value))}>
                            <option value='0' selected>0 Minutes</option>
                            <option value='15'>15 Minutes</option> 
                            <option value='30'>30 Minutes</option> 
                            <option value='45'>45 Minutes</option>
                        </select>
                    </div>
                    <div className='priority-input'>
                        <p>{createPopUpPriority}</p>
                        <FontAwesomeIcon icon='fa-solid fa-caret-up' className='upper-spin-button' onClick={() => {dispatch(updateEventPriority({ id: parseInt(popUpEvent.id), priority: parseInt(popUpPriority+1) }));setPopUpPriority(popUpPriority+1)}} />
                        <FontAwesomeIcon icon='fa-solid fa-caret-down' className='lower-spin-button' onClick={() => {if (popUpPriority > 1){dispatch(updateEventPriority({ id: parseInt(popUpEvent.id), priority: parseInt(popUpPriority-1) }));setPopUpPriority(popUpPriority-1)}}} />
                    </div>
                    <ActionButton className='cancel-button' contents='Cancel' onClick={cancelCreateEvent} />
                    <ActionButton className='submit-button' contents='Create' onClick={submitCreateEvent} />
                </div>
                : null }
        </div>
    );
}

export default RepairCalendarView;