import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import BlockTitle from '../../Common/Text/BlockTitle';
import DropdownSelect from '../../Common/Inputs/DropdownSelect';
import TextInput from '../../Common/Inputs/TextInput';
import TextAreaInput from '../../Common/Inputs/TextAreaInput';
import ActionButton from '../../Common/Buttons/ActionButton';
import BlockTopRightButton from '../../Common/Buttons/BlockTopRightButton';

import eventBus from '../../../utils/eventBus';

import './CalendarEventPopover.css';

import closeLight from '../../../images/close-icon/closeLight.png';
import closeHoverLight from '../../../images/close-icon/closeHoverLight.png';
import closeDark from '../../../images/close-icon/closeDark.png';
import closeHoverDark from '../../../images/close-icon/closeHoverDark.png';
import titleLight from '../../../images/title-icons/titleLight.png';
import infoLight from '../../../images/info-icons/infoLight.png';

function CalendarEventPopover(props) {

    const navigate = useNavigate();

    const eventOptions = [
        { name: 'Repair', value: 'Repair' },
        { name: 'Other Event', value: 'Other Event' },
    ]

    const timeHoursOptions = [
        { name: '0 Hours', value: 0 },
        { name: '1 Hour', value: 1 },
        { name: '2 Hours', value: 2 },
        { name: '3 Hours', value: 3 },
        { name: '4 Hours', value: 4 },
        { name: '5 Hours', value: 5 },
        { name: '6 Hours', value: 6 },
        { name: '7 Hours', value: 7 },
        { name: '8 Hours', value: 8 }
    ]

    const timeMinutesOptions = [
        { name: '0 Minutes', value: 0 },
        { name: '15 Minutes', value: 15 },
        { name: '30 Minutes', value: 30 },
        { name: '45 Minutes', value: 45 }
    ]

    const updateCalendarEventType = (updatedType) => {
        props.updateCalendarEvent({...props.calendarEvent, type: updatedType});
        props.calendarEvent.type = updatedType;
    }

    const updateCalendarEventTitle = (updatedTitle) => {
        props.updateCalendarEvent({...props.calendarEvent, title: updatedTitle});
        props.calendarEvent.title = updatedTitle;
    }

    const updateCalendarEventDescription = (updatedDescription) => {
        props.updateCalendarEvent({...props.calendarEvent, description: updatedDescription});
        props.calendarEvent.description = updatedDescription;
    }

    const updateCalendarEventHours = (updatedHours) => {
        props.updateCalendarEvent({...props.calendarEvent, time: updatedHours * 60 + props.calendarEvent.time % 60});
        props.calendarEvent.time = updatedHours * 60 + props.calendarEvent.time % 60;
    }

    const updateCalendarEventMinutes = (updatedMinutes) => {
        props.updateCalendarEvent({...props.calendarEvent, time: Math.floor(props.calendarEvent.time / 60) * 60 + parseInt(updatedMinutes)});
        props.calendarEvent.time = Math.floor(props.calendarEvent.time / 60) * 60 + parseInt(updatedMinutes);
    }

    useEffect(() => {
        eventBus.on('click', props.closeFunction);
        return () => eventBus.off('click', props.closeFunction);
    }, [])

    return (
        <div className='CalendarEventPopover' style={{left: `${props.position[0]}px`, top: `${props.position[1]}px`}} onClick={(e) => e.stopPropagation()}>
            <BlockTitle>Edit Event</BlockTitle>

            <div className='event-details'>
                <DropdownSelect options={eventOptions} placeholder={'Select Event Type'} value={props.calendarEvent.type} onChange={updateCalendarEventType} />
            
                {props.calendarEvent.type === 'Repair' ? <>
                <TextInput placeholder='Serial Number' value={props.calendarEvent.repair.instrument.serial_number} />
                </> : props.calendarEvent.type === 'Other Event' ? <>
                <TextInput icon={titleLight} placeholder='Title' value={props.calendarEvent.title} onChange={updateCalendarEventTitle} />
                <TextAreaInput icon={infoLight} placeholder='Description' value={props.calendarEvent.description} onChange={updateCalendarEventDescription} disableAutoResize />
                </> : null}

                <div className='time-inputs'>
                    <DropdownSelect options={timeHoursOptions} value={Math.floor(props.calendarEvent.time / 60)} onChange={updateCalendarEventHours} />
                    <DropdownSelect options={timeMinutesOptions} value={props.calendarEvent.time % 60} onChange={updateCalendarEventMinutes} />
                </div>
                
            </div>

            <div className='action-buttons'>
                <ActionButton className='delete-event-button' onClick={props.deleteCalendarEvent}>Delete Event</ActionButton>
                {props.calendarEvent.type === 'Repair' ?
                <ActionButton className='open-repair-button' colored='true' onClick={() => navigate(`/repair/${props.calendarEvent.repair.id}`)}>Open Repair</ActionButton>
                : null}
            </div>
        
            <BlockTopRightButton onClick={props.closeFunction} light={closeLight} lightHover={closeHoverLight} dark={closeDark} darkHover={closeHoverDark} />
        </div>
    );
}

export default CalendarEventPopover;