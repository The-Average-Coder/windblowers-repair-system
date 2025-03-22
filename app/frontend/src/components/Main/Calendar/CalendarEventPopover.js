import BlockTitle from '../../Common/Text/BlockTitle';
import DropdownSelect from '../../Common/Inputs/DropdownSelect';

import './CalendarEventPopover.css';

function CalendarEventPopover(props) {
    const eventOptions = [
        { name: 'Repair', value: 'Repair' },
        { name: 'Other Event', value: 'Other Event' },
    ]

    const updateCalendarEventType = (updatedType) => {
        props.updateCalendarEvent({...props.calendarEvent, type: updatedType});
        props.calendarEvent.type = updatedType;
    }

    return (
        <div className='CalendarEventPopover' style={{left: `${props.position[0]}px`, top: `${props.position[1]}px`}} onClick={(e) => e.stopPropagation()}>
            <BlockTitle>Edit Event</BlockTitle>
            <DropdownSelect options={eventOptions} placeholder={'Select Event Type'} value={props.calendarEvent.type} onChange={updateCalendarEventType} />
        </div>
    );
}

export default CalendarEventPopover;