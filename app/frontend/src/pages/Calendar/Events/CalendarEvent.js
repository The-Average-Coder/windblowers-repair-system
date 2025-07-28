import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

import calendarModes from '../../../enums/calendarModes';

import BlockTitle from '../../../components/Text/BlockTitle';
import BlockText from '../../../components/Text/BlockText';

import './CalendarEvent.css';

function CalendarEvent(props) {

    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: props.calendarEvent.id,
    });
    const style = {
        transform: CSS.Translate.toString(transform),
    };

    const findInstrumentStatusById = (id) => {
        return props.instrumentStatuses.find(instrumentStatus => instrumentStatus.id === id);
    }

    const findJobTypeById = (id) => {
        return props.jobTypes.find(jobType => jobType.id === id);
    }

    const getEventTimeString = (time) => {
        return `${Math.floor(time / 60)} Hrs ${time % 60} Mins`
    }

    // Function returning JSX elements for the details to be displayed on the calendar event
    const getRenderedDetails = () => {

        // If event type is 'Other Event' return title and description
        if (props.calendarEvent.type === 'Other Event') {
            return <>
            <BlockTitle>{props.calendarEvent.title}</BlockTitle>
            {props.calendarEvent.description && <BlockText>{props.calendarEvent.description} </BlockText>}
            </>
        }

        // Check repair is defined and non-empty
        if (!props.calendarEvent.repair || !props.calendarEvent.repair.id) return;

        // Check details settings have loaded
        if (props.detailsSettings.length === 0) return;

        return <>
        
            <BlockTitle>Repair {props.calendarEvent.repair.id}</BlockTitle>

            {props.detailsSettings.map(detail => {

                // Check detail is enabled in settings
                if (props.mode === calendarModes.DAY && !detail.day_enabled
                    || props.mode === calendarModes.WEEK && !detail.week_enabled) return;

                if (detail.name === 'Instrument' && props.calendarEvent.repair.instrument)
                    return <BlockText>
                        {props.calendarEvent.repair.instrument.manufacturer} {props.calendarEvent.repair.instrument.model} {props.calendarEvent.repair.instrument.type}
                    </BlockText>
                
                if (detail.name === 'Serial Number' && props.calendarEvent.repair.instrument)
                    return <BlockText>{props.calendarEvent.repair.instrument.serial_number}</BlockText>

                if (detail.name === 'Instrument Status' && props.calendarEvent.repair.instrument
                    && props.instrumentStatuses.length > 0) {
                    const instrumentStatus = findInstrumentStatusById(props.calendarEvent.repair.instrument.status);
                    if (!instrumentStatus) return;
                    return <BlockText>
                        {instrumentStatus.status}
                    </BlockText>
                }

                if (detail.name === 'Customer') {
                    if (props.calendarEvent.repair.in_house)
                        return <BlockText>In House Repair</BlockText>

                    if (props.calendarEvent.repair.customer)
                        return <BlockText>
                            {props.calendarEvent.repair.customer.firstname} {props.calendarEvent.repair.customer.surname}
                        </BlockText>
                }

                if (detail.name === 'Job Type' && props.calendarEvent.repair.assessment
                    && props.jobTypes.length > 0) {
                    const jobType = findJobTypeById(props.calendarEvent.repair.assessment.job_type);
                    if (!jobType) return;
                    return <BlockText>
                        {jobType.name}
                    </BlockText>
                }

            })}

        </>

    };

    return (
        <div
            className={`CalendarEvent ${props.calendarEvent.color}`}
            ref={!props.overlay ? setNodeRef : null}
            style={style} {...listeners} {...attributes} onClick={props.onClick}>
            
            {getRenderedDetails()}

            <BlockText>
                {props.calendarEvent.all_day ? 'All Day' : getEventTimeString(props.calendarEvent.time)}
            </BlockText>
            
        </div>
    );
}

export default CalendarEvent;