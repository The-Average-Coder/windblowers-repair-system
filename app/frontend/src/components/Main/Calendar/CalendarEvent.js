import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

import BlockTitle from '../../Common/Text/BlockTitle';
import BlockText from '../../Common/Text/BlockText';

import './CalendarEvent.css';

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
            <BlockTitle>{props.calendarEvent.repair ? `Repair ${props.calendarEvent.repair.id}` : ''}</BlockTitle>
            <BlockText>{props.calendarEvent.repair ? `${props.calendarEvent.repair.instrument.manufacturer} ${props.calendarEvent.repair.instrument.model} ${props.calendarEvent.repair.instrument.type}` : ''}</BlockText>
            <BlockText>{props.calendarEvent.repair ? `${Math.floor(props.calendarEvent.time / 60)} Hrs ${props.calendarEvent.time % 60} Mins` : ''}</BlockText>
            </> : <>
            <BlockTitle>{props.calendarEvent.title} </BlockTitle>
            {props.calendarEvent.description ? <BlockText>{props.calendarEvent.description} </BlockText> : null}
            <BlockText>{`${Math.floor(props.calendarEvent.time / 60)} Hrs ${props.calendarEvent.time % 60} Mins`}</BlockText>
            </>}

            
        </div>
    );
}

export default CalendarEvent;