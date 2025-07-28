import { DragOverlay } from '@dnd-kit/core';

import calendarModes from '../../../enums/calendarModes';

import CalendarEvent from './CalendarEvent';

// A drag overlay container for a calendar event for currently dragging events
function DragOverlayCalendarEvent(props) {

    return <DragOverlay>
        <CalendarEvent
            calendarEvent={props.draggingEvent}
            mode={calendarModes.WEEK}
            detailsSettings={props.detailsSettings}
            jobTypes={props.jobTypes}
            instrumentStatuses={props.instrumentStatuses}
            overlay='true'
        />
    </DragOverlay>

}

export default DragOverlayCalendarEvent;