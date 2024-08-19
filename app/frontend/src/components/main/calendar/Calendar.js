import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { deleteCalendarEvent, moveCalendarEvent, updateEventPriority } from '../../../reducers/calendar_events/calendarEventsSlice';
import calendarEventColours from '../../../enums/calendarEventColours';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import PageTitle from '../../common/PageTitle';
import ActionButton from '../../common/ActionButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


function Calendar() {
    const [popUpShowing, setPopUpShowing] = useState(false);
    const [popUpPosition, setPopUpPosition] = useState([]);
    const [popUpWidth, setPopUpWidth] = useState(200);
    const [popUpEvent, setPopUpEvent] = useState();
    const [popUpPriority, setPopUpPriority] = useState();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const instrumentTypeAbbreviations = {
        'Contrabass Clarinet': 'Contra Clarinet',
        'Soprano Saxophone': 'Soprano Sax',
        'Alto Saxophone': 'Alto Sax',
        'Tenor Saxophone': 'Tenor Sax',
        'Baritone Saxophone': 'Baritone Sax',
        'Bass Saxophone': 'Bass Sax',
        'Saxophone (Other)': 'Sax (Other)',
        'Soprano Recorder': 'Sop Recorder',
    }

    const popUpRef = useRef(null);

    const events = useSelector(state => {
        const rawData = state.recentCalendarEvents.recentCalendarEvents;
        return rawData.map(event => {
            return {
                ...event,
                title: `${event.instrument_type ? event.instrument_type in instrumentTypeAbbreviations ? instrumentTypeAbbreviations[event.instrument_type] : event.instrument_type : ''} ${event.repair_id} ${Math.floor(event.time / 60)} Hrs ${event.time % 60} Mins`
            }
        })
    })

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    })

    const showPopUp = (info) => {
        const rect = info.el.getBoundingClientRect();
        setPopUpShowing(true);
        setPopUpPosition([rect.left, rect.top]);
        setPopUpWidth(rect.width)
        setPopUpEvent(info.event);
        setPopUpPriority(info.event.extendedProps.priority);
    }

    const handleOutsideClick = (e) => {
        if (popUpRef.current && !popUpRef.current.contains(e.target))  {
            setPopUpShowing(false);
        }
    }

    const moveEvent = (info) => {
        dispatch(moveCalendarEvent({ id: parseInt(info.event.id), start: info.event.start }));
    }

    const navigateToRepair = (repairId) => {
        navigate(`/repairs/repair/${repairId}`);
    }

    const deleteEvent = (eventId) => {
        dispatch(deleteCalendarEvent(parseInt(eventId)));
        setPopUpShowing(false);
    }

    return (
        <div className='calendar'>
            
            <div className='title'>
                <PageTitle title='Calendar' />
            </div>

            <div className='calendar-box'>

                <FullCalendar
                    height='100%'
                    plugins={[ dayGridPlugin, interactionPlugin ]}
                    initialView='dayGridMonth'
                    headerToolbar={{start: 'title', center: '', end: 'prev,next'}}
                    buttonText={{month: 'Single Month', threeMonth: 'Three Months'}}
                    hiddenDays={[0,1]}
                    events={events}
                    editable={true}
                    eventStartEditable={true}
                    eventDurationEditable={false}
                    eventOrder='-priority,title'
                    eventOrderStrict={true}
                    eventClick={showPopUp}
                    eventDrop={moveEvent}
                    defaultAllDay={true}
                    fixedWeekCount={false}
                />
                
            </div>

            {popUpShowing ?
            <div className='popup' style={{top: popUpPosition[1], left: popUpPosition[0], width: `${popUpWidth}px`, backgroundColor: popUpEvent.backgroundColor}} ref={popUpRef} >
                <p className='popup-title'>{popUpEvent.title}</p>
                {
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
            : null}

        </div>
    );
}

export default Calendar;