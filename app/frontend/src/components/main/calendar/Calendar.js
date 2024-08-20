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
import axios from 'axios';


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
                color: event.status >= 2 ? '#808080' : event.color ? event.color : 'black',
                title: `${event.type ? event.type in instrumentTypeAbbreviations ? instrumentTypeAbbreviations[event.type] : event.type : ''} ${event.repair_id} ${Math.floor(event.time / 60)} Hrs ${event.time % 60} Mins`
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

    const subtractHexColor = (c1, c2) => {
        var hexStr = (parseInt(c1.slice(1), 16) - parseInt(c2.slice(1), 16)).toString(16);
        while (hexStr.length < 6) { hexStr = '0' + hexStr; } // Zero pad.
        console.log(c1)
        console.log(hexStr)
        return '#' + hexStr;
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
                <div className='priority-input' style={{backgroundColor: subtractHexColor(popUpEvent.backgroundColor, '#0A0A06')}}>
                    <p>{popUpPriority}</p>
                    <FontAwesomeIcon icon='fa-solid fa-caret-up' className='upper-spin-button' style={{backgroundColor: subtractHexColor(popUpEvent.backgroundColor, '#0F0E06')}} onClick={() => {dispatch(updateEventPriority({ id: parseInt(popUpEvent.id), priority: parseInt(popUpPriority+1) }));setPopUpPriority(popUpPriority+1)}} />
                    <FontAwesomeIcon icon='fa-solid fa-caret-down' className='lower-spin-button' style={{backgroundColor: subtractHexColor(popUpEvent.backgroundColor, '#0F0E06')}} onClick={() => {if (popUpPriority > 1){dispatch(updateEventPriority({ id: parseInt(popUpEvent.id), priority: parseInt(popUpPriority-1) }));setPopUpPriority(popUpPriority-1)}}} />
                </div>
                <ActionButton className='delete-button' buttonStyle={{backgroundColor: subtractHexColor(popUpEvent.backgroundColor, '#0A0A06')}} contents='Remove Event' onClick={() => deleteEvent(popUpEvent.id)} />
                <ActionButton className='navigate-button' buttonStyle={{backgroundColor: subtractHexColor(popUpEvent.backgroundColor, '#0A0A06')}} contents='Go To Repair' onClick={() => navigateToRepair(popUpEvent._def.extendedProps.repair_id)} />
            </div>
            : null}

        </div>
    );
}

export default Calendar;