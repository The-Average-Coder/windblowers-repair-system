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
            
            {props.calendarEvent.type === 'Repair' ?<>

            {/* Repair Event */}
            <BlockTitle>{props.calendarEvent.repair ? `Repair ${props.calendarEvent.repair.id}` : 'Repair Not Found'}</BlockTitle>
            
            {/* Instrument */}
            {props.mode === calendarModes.DAY && <>

            {props.detailsSettings.find(detail => detail.name === 'Instrument').dayEnabled &&
            <BlockText>{props.calendarEvent.repair && `${props.calendarEvent.repair.instrument.manufacturer} ${props.calendarEvent.repair.instrument.model} ${props.calendarEvent.repair.instrument.type}`}</BlockText>}

            {props.detailsSettings.find(detail => detail.name === 'Serial Number').dayEnabled &&
            <BlockText>{props.calendarEvent.repair && `Serial: ${props.calendarEvent.repair.instrument.serial_number}`}</BlockText>}
            
            {props.detailsSettings.find(detail => detail.name === 'Instrument Status').dayEnabled &&
            <BlockText>{props.calendarEvent.repair && `${props.instrumentStatuses[props.calendarEvent.repair.instrument.status].status}`}</BlockText>}
            
            {props.calendarEvent.repair.customer.in_house ?
            <BlockText>In House Repair</BlockText>
            :
            props.detailsSettings.find(detail => detail.name === 'Customer').dayEnabled &&
            <BlockText>{props.calendarEvent.repair && `${props.calendarEvent.repair.customer.firstname} ${props.calendarEvent.repair.customer.surname}`}</BlockText>}

            {props.detailsSettings.find(detail => detail.name === 'Job Type').dayEnabled &&
            <BlockText>{props.calendarEvent.repair && `${props.jobTypes[props.calendarEvent.repair.assessment.job_type].name}`}</BlockText>}
            
            </>}

            {props.mode === calendarModes.WEEK && <>
            
            {props.detailsSettings.find(detail => detail.name === 'Instrument').weekEnabled &&
            <BlockText>{props.calendarEvent.repair && `${props.calendarEvent.repair.instrument.manufacturer} ${props.calendarEvent.repair.instrument.model} ${props.calendarEvent.repair.instrument.type}`}</BlockText>}

            {props.detailsSettings.find(detail => detail.name === 'Serial Number').weekEnabled &&
            <BlockText>{props.calendarEvent.repair && `Serial: ${props.calendarEvent.repair.instrument.serial_number}`}</BlockText>}
            
            {props.detailsSettings.find(detail => detail.name === 'Instrument Status').weekEnabled &&
            <BlockText>{props.calendarEvent.repair && `${props.instrumentStatuses[props.calendarEvent.repair.instrument.status].status}`}</BlockText>}
            
            {props.calendarEvent.repair.customer.in_house ?
            <BlockText>In House Repair</BlockText>
            :
            props.detailsSettings.find(detail => detail.name === 'Customer').weekEnabled &&
            <BlockText>{props.calendarEvent.repair && `${props.calendarEvent.repair.customer.firstname} ${props.calendarEvent.repair.customer.surname}`}</BlockText>}

            {props.detailsSettings.find(detail => detail.name === 'Job Type').weekEnabled &&
            <BlockText>{props.calendarEvent.repair && `${props.jobTypes[props.calendarEvent.repair.assessment.job_type].name}`}</BlockText>}
            
            </>}

            <BlockText>{props.calendarEvent.repair && `${Math.floor(props.calendarEvent.time / 60)} Hrs ${props.calendarEvent.time % 60} Mins`}</BlockText>
            
            </> : <>

            {/* Other Event */}
            <BlockTitle>{props.calendarEvent.title}</BlockTitle>
            {props.calendarEvent.description ? <BlockText>{props.calendarEvent.description} </BlockText> : null}
            <BlockText>{`${Math.floor(props.calendarEvent.time / 60)} Hrs ${props.calendarEvent.time % 60} Mins`}</BlockText>
            
            </>}
            
        </div>
    );
}

export default CalendarEvent;