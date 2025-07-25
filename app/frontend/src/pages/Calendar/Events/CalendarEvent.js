import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

import BlockTitle from '../../../components/Text/BlockTitle';
import BlockText from '../../../components/Text/BlockText';

import './CalendarEvent.css';

import calendarModes from '../../../enums/calendarModes';

function CalendarEvent(props) {

    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: props.calendarEvent.id,
    });
    const style = {
        transform: CSS.Translate.toString(transform),
    };

    return (
        <div className={`CalendarEvent ${props.calendarEvent.color}`} ref={setNodeRef} style={style} {...listeners} {...attributes} onClick={props.onClick}>
            
            {props.calendarEvent.type === 'Repair' ? <>

            {/* Repair Event */}
            <BlockTitle>{props.calendarEvent.repair ? `Repair ${props.calendarEvent.repair.id}` : 'Repair Not Found'}</BlockTitle>
            
            {props.calendarEvent.repair && props.calendarEvent.repair.id !== undefined && props.detailsSettings.length > 0 && <>

            {/* Instrument */}
            {props.mode === calendarModes.DAY && <>

            {props.detailsSettings.find(detail => detail.name === 'Instrument').day_enabled &&
            <BlockText>{props.calendarEvent.repair && props.calendarEvent.repair.instrument && `${props.calendarEvent.repair.instrument.manufacturer} ${props.calendarEvent.repair.instrument.model} ${props.calendarEvent.repair.instrument.type}`}</BlockText>}

            {props.detailsSettings.find(detail => detail.name === 'Serial Number').day_enabled &&
            <BlockText>{props.calendarEvent.repair && props.calendarEvent.repair.instrument && props.calendarEvent.repair.instrument.serial_number}</BlockText>}
            
            {props.detailsSettings.find(detail => detail.name === 'Instrument Status').day_enabled &&
            <BlockText>{props.calendarEvent.repair && props.calendarEvent.repair.instrument && props.instrumentStatuses.length > 0 && `${props.instrumentStatuses.find(instrumentStatus => instrumentStatus.id === props.calendarEvent.repair.instrument.status).status}`}</BlockText>}
            
            {props.calendarEvent.repair.in_house ?
            <BlockText>In House Repair</BlockText>
            :
            props.detailsSettings.find(detail => detail.name === 'Customer').day_enabled &&
            <BlockText>{props.calendarEvent.repair && `${props.calendarEvent.repair.customer.firstname} ${props.calendarEvent.repair.customer.surname}`}</BlockText>}

            {props.detailsSettings.find(detail => detail.name === 'Job Type').day_enabled &&
            <BlockText>{props.calendarEvent.repair && props.calendarEvent.repair.assessment && props.jobTypes.length > 0 && `${props.jobTypes.find(jobType => jobType.id === props.calendarEvent.repair.assessment.job_type).name}`}</BlockText>}
            
            </>}

            {props.mode === calendarModes.WEEK && <>
            {props.detailsSettings.find(detail => detail.name === 'Instrument').week_enabled &&
            <BlockText>{props.calendarEvent.repair && `${props.calendarEvent.repair.instrument.manufacturer} ${props.calendarEvent.repair.instrument.model} ${props.calendarEvent.repair.instrument.type}`}</BlockText>}

            {props.detailsSettings.find(detail => detail.name === 'Serial Number').week_enabled &&
            <BlockText>{props.calendarEvent.repair && props.calendarEvent.repair.instrument.serial_number}</BlockText>}
            
            {props.detailsSettings.find(detail => detail.name === 'Instrument Status').week_enabled &&
            <BlockText>{props.calendarEvent.repair && props.instrumentStatuses.length > 0 && `${props.instrumentStatuses.find(instrumentStatus => instrumentStatus.id === props.calendarEvent.repair.instrument.status).status}`}</BlockText>}
            
            {props.calendarEvent.repair.in_house ?
            <BlockText>In House Repair</BlockText>
            :
            props.detailsSettings.find(detail => detail.name === 'Customer').week_enabled &&
            <BlockText>{props.calendarEvent.repair && `${props.calendarEvent.repair.customer.firstname} ${props.calendarEvent.repair.customer.surname}`}</BlockText>}

            {props.detailsSettings.find(detail => detail.name === 'Job Type').week_enabled &&
            <BlockText>{props.calendarEvent.repair && props.calendarEvent.repair.assessment && props.jobTypes.length > 0 && `${props.jobTypes.find(jobType => jobType.id === props.calendarEvent.repair.assessment.job_type).name}`}</BlockText>}
            
            </>}

            </>}

            
            </> : <>

            {/* Other Event */}
            <BlockTitle>{props.calendarEvent.title}</BlockTitle>
            {props.calendarEvent.description ? <BlockText>{props.calendarEvent.description} </BlockText> : null}
            
            </>}

            <BlockText>{props.calendarEvent.all_day ? 'All Day' : `${Math.floor(props.calendarEvent.time / 60)} Hrs ${props.calendarEvent.time % 60} Mins`}</BlockText>
            
        </div>
    );
}

export default CalendarEvent;