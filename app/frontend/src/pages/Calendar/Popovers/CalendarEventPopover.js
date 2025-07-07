import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import BlockTitle from '../../../components/Text/BlockTitle';
import DatePicker from '../../../components/Inputs/DatePicker';
import DropdownSelect from '../../../components/Inputs/DropdownSelect';
import HoursDropdownSelect from '../../../components/Inputs/HoursDropdownSelect';
import MinutesDropdownSelect from '../../../components/Inputs/MinutesDropdownSelect';
import TextInput from '../../../components/Inputs/TextInput';
import TextAreaInput from '../../../components/Inputs/TextAreaInput';
import ActionButton from '../../../components/Buttons/ActionButton';
import BlockTopRightButton from '../../../components/Buttons/BlockTopRightButton';

import eventBus from '../../../utils/eventBus';

import './CalendarEventPopover.css';

import closeLight from '../../../images/close-icon/closeLight.png';
import closeHoverLight from '../../../images/close-icon/closeHoverLight.png';
import closeDark from '../../../images/close-icon/closeDark.png';
import closeHoverDark from '../../../images/close-icon/closeHoverDark.png';
import titleLight from '../../../images/title-icons/titleLight.png';
import infoLight from '../../../images/info-icons/infoLight.png';

import axios from 'axios';

function CalendarEventPopover(props) {

    const navigate = useNavigate();

    const eventOptions = [
        { name: 'Repair', value: 'Repair' },
        { name: 'Other Event', value: 'Other Event' },
    ]
    
    
    // #### STATE VARIABLES
    const [tempRepairId, setTempRepairId] = useState()
    const [foundRepair, setFoundRepair] = useState({})

    useEffect(() => {
        setTempRepairId(props.calendarEvent.repair.id)
    }, [])
    

    // #### EVENT MANAGEMENT FUNCTIONS
    const updateCalendarEventType = (updatedType) => {
        const updatedColor = updatedType === 'Other Event' ? 'green' : (props.calendarEvent.repair && props.calendarEvent.repair.id ? getEventColorFromInstrumentType(props.calendarEvent.repair.instrument.type) : 'grey');
        props.updateCalendarEvent({...props.calendarEvent, type: updatedType, color: updatedColor});
        props.calendarEvent.type = updatedType;
        props.calendarEvent.color = updatedColor;
    }

    const updateCalendarEventTitle = (updatedTitle) => {
        props.updateCalendarEvent({...props.calendarEvent, title: updatedTitle});
        props.calendarEvent.title = updatedTitle;
    }

    const updateCalendarEventDescription = (updatedDescription) => {
        props.updateCalendarEvent({...props.calendarEvent, description: updatedDescription});
        props.calendarEvent.description = updatedDescription;
    }

    const updateCalendarEventDate = (updatedDate) => {
        props.updateCalendarEvent({...props.calendarEvent, date: updatedDate});
        props.closeFunction();
    }

    const updateCalendarEventHours = (updatedHours) => {
        props.updateCalendarEvent({...props.calendarEvent, time: updatedHours * 60 + props.calendarEvent.time % 60});
        props.calendarEvent.time = updatedHours * 60 + props.calendarEvent.time % 60;
    }

    const updateCalendarEventMinutes = (updatedMinutes) => {
        props.updateCalendarEvent({...props.calendarEvent, time: Math.floor(props.calendarEvent.time / 60) * 60 + parseInt(updatedMinutes)});
        props.calendarEvent.time = Math.floor(props.calendarEvent.time / 60) * 60 + parseInt(updatedMinutes);
    }

    const updateCalendarEventAllDay = (value) => {
        props.updateCalendarEvent({...props.calendarEvent, all_day: value});
        props.calendarEvent.all_day = value;
    }

    const updateTempRepairId = (value) => {
        setTempRepairId(value);
        setFoundRepair({});

        axios.get(`/api/repairs/get/${value}`)
            .then(response => {
                if (response.data.id === undefined) return;
                setFoundRepair(response.data);
            })
            .catch(error => console.log(error))
    }

    const getEventColorFromInstrumentType = (instrumentType) => {
        
        if (['Oboe', 'Cor Anglais', 'Oboe (Other)', 'Bassoon', 'Bassoon (Other)'].includes(instrumentType)) {
            return 'purple';
        }

        if (['Trumpet', 'Cornet', 'Trombone', 'French Horn', 'Brass (Other)'].includes(instrumentType)) {
            return 'orange'
        }
        
        return 'blue';
    }

    const setRepair = () => {
        console.log(foundRepair.instrument.type)
        props.updateCalendarEvent({...props.calendarEvent, repair: foundRepair, color: getEventColorFromInstrumentType(foundRepair.instrument.type)});
        setFoundRepair({});
    }

    useEffect(() => {
        eventBus.on('click', props.closeFunction);
        return () => eventBus.off('click', props.closeFunction);
    }, [])

    return (
        <div className='CalendarEventPopover' style={{left: `${props.position[0]}px`, top: `${props.position[1]}px`}} onClick={(e) => e.stopPropagation()}>
            <BlockTitle className='popover-title'>Edit Event</BlockTitle>

            <div className='event-details'>
                <DropdownSelect options={eventOptions} placeholder={'Select Event Type'} value={props.calendarEvent.type} onChange={updateCalendarEventType} />
            
                {props.calendarEvent.type === 'Repair' ? <>
                <TextInput placeholder='Repair ID' value={tempRepairId} onChange={updateTempRepairId} />
                {foundRepair.id !== undefined && <button className='select-repair-button' onClick={setRepair}>{foundRepair.id}</button>}
                </> : props.calendarEvent.type === 'Other Event' ? <>
                <TextInput icon={titleLight} placeholder='Title' value={props.calendarEvent.title} onChange={updateCalendarEventTitle} />
                <TextAreaInput icon={infoLight} placeholder='Description' value={props.calendarEvent.description} onChange={updateCalendarEventDescription} disableAutoResize />
                </> : null}

                <BlockTitle className='sub-title'>Date and Time</BlockTitle>

                <DatePicker value={props.calendarEvent.date} onChange={updateCalendarEventDate} />

                <div className='time-inputs'>
                    <HoursDropdownSelect disabled={props.calendarEvent.all_day} value={Math.floor(props.calendarEvent.time / 60)} onChange={updateCalendarEventHours} />
                    <MinutesDropdownSelect disabled={props.calendarEvent.all_day} value={props.calendarEvent.time % 60} onChange={updateCalendarEventMinutes} />
                </div>

                {props.calendarEvent.type === 'Other Event' && <div className='all-day-checkbox'>
                    <input type='checkbox' checked={props.calendarEvent.all_day} onChange={(e) => updateCalendarEventAllDay(e.target.checked)} />
                    <label>All Day Event</label>
                </div>}
                
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