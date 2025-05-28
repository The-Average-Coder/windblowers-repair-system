import { useEffect, useState } from 'react';

import BlockTitle from '../../../components/Text/BlockTitle';
import DropdownSelect from '../../../components/Inputs/DropdownSelect';
import HoursDropdownSelect from '../../../components/Inputs/HoursDropdownSelect';
import MinutesDropdownSelect from '../../../components/Inputs/MinutesDropdownSelect';
import TextInput from '../../../components/Inputs/TextInput';
import TextAreaInput from '../../../components/Inputs/TextAreaInput';
import ActionButton from '../../../components/Buttons/ActionButton';
import BlockTopRightButton from '../../../components/Buttons/BlockTopRightButton';

import eventBus from '../../../utils/eventBus';

// Reuse styling from CalendarEventPopover as they are essentially the same
import './CalendarEventPopover.css';

import closeLight from '../../../images/close-icon/closeLight.png';
import closeHoverLight from '../../../images/close-icon/closeHoverLight.png';
import closeDark from '../../../images/close-icon/closeDark.png';
import closeHoverDark from '../../../images/close-icon/closeHoverDark.png';
import titleLight from '../../../images/title-icons/titleLight.png';
import infoLight from '../../../images/info-icons/infoLight.png';

function CreateEventPopover(props) {

    const eventOptions = [
        { name: 'Repair', value: 'Repair' },
        { name: 'Other Event', value: 'Other Event' },
    ]

    const [calendarEvent, updateCalendarEvent] = useState({
        id: props.id,
        type: '',
        title: '',
        description: '',
        date: props.date,
        time: '0',
        color: '',
        repairer: props.repairer,
        repair: null
    })

    const createCalendarEvent = () => {
        if (calendarEvent.type === '' || calendarEvent.type === 'Other Event' && calendarEvent.title === '' || calendarEvent.type === 'Repair' && calendarEvent.repair === null) return;
        props.createCalendarEvent(calendarEvent)
    }

    const updateCalendarEventType = (updatedType) => {
        updateCalendarEvent({...calendarEvent, type: updatedType});
    }

    const updateCalendarEventTitle = (updatedTitle) => {
        updateCalendarEvent({...calendarEvent, title: updatedTitle});
        
    }

    const updateCalendarEventDescription = (updatedDescription) => {
        updateCalendarEvent({...calendarEvent, description: updatedDescription});
    }

    const updateCalendarEventHours = (updatedHours) => {
        updateCalendarEvent({...calendarEvent, time: updatedHours * 60 + calendarEvent.time % 60});
    }

    const updateCalendarEventMinutes = (updatedMinutes) => {
        updateCalendarEvent({...calendarEvent, time: Math.floor(calendarEvent.time / 60) * 60 + parseInt(updatedMinutes)});
    }

    useEffect(() => {
        eventBus.on('click', props.cancel);
        return () => eventBus.off('click', props.cancel);
    }, [])

    return (
        <div className='CalendarEventPopover' style={{left: `${props.position[0]}px`, top: `${props.position[1]}px`}} onClick={(e) => e.stopPropagation()}>
            <BlockTitle className='popover-title'>Create Event</BlockTitle>

            <div className='event-details'>
                <DropdownSelect options={eventOptions} placeholder={'Select Event Type'} value={calendarEvent.type} onChange={updateCalendarEventType} />
            
                {calendarEvent.type === 'Repair' ? <>
                <TextInput placeholder='Serial Number' value={calendarEvent.repair.instrument.serial_number} />
                </> : calendarEvent.type === 'Other Event' ? <>
                <TextInput icon={titleLight} placeholder='Title' value={calendarEvent.title} onChange={updateCalendarEventTitle} />
                <TextAreaInput icon={infoLight} placeholder='Description' value={calendarEvent.description} onChange={updateCalendarEventDescription} disableAutoResize />
                </> : null}

                <div className='time-inputs'>
                    <HoursDropdownSelect value={Math.floor(calendarEvent.time / 60)} onChange={updateCalendarEventHours} />
                    <MinutesDropdownSelect value={calendarEvent.time % 60} onChange={updateCalendarEventMinutes} />
                </div>
                
            </div>

            <div className='action-buttons'>
                <ActionButton className='delete-event-button' onClick={props.cancel}>Cancel</ActionButton>
                <ActionButton className='open-repair-button' colored='true' onClick={createCalendarEvent}>Save</ActionButton>
            </div>
        
            <BlockTopRightButton onClick={props.cancel} light={closeLight} lightHover={closeHoverLight} dark={closeDark} darkHover={closeHoverDark} />
        </div>
    );
}

export default CreateEventPopover;