import { useDroppable } from '@dnd-kit/core';

import calendarModes from '../../../enums/calendarModes';

import CalendarEvent from '../Events/CalendarEvent';
import AddCalendarEventButton from '../Events/AddCalendarEventButton';

import './CalendarWeekView.css';

function CalendarWeekView(props) {

    const currentDate = new Date();


    // #### CONSTANTS
    const DAYS_OF_THE_WEEK = ['Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const HEAT_CSS_CLASSES = ['green', 'yellow', 'orange', 'red']


    // #### CALENDAR RENDER FUNCTIONS
    const getRepairerCalendarGridBoxes = (repairer) => {

        let calendarGridBoxes = []

        for (let i = 0; i < DAYS_OF_THE_WEEK.length; i++) {

            const weekDate = getDateNDaysAfterDate(props.firstWeekDate, i);
            const weekDay = weekDate.getDay() - 2

            const daysEvents = getEventsForDateAndRepairer(weekDate, repairer.id);

            // Repairer does 0 hours that day
            const disabled = repairer.id !== 0 && repairer.hours[weekDay] === 0

            const percentageFull = getPercentageFullOfDayForRepairer(weekDay, repairer, daysEvents);
            const heatValue = percentageFull === 0 ? 0 : percentageFull <= 0.25 && 1 || percentageFull <= 0.6 && 2 || 3;

            calendarGridBoxes.push(
                <CalendarGridBox
                    disabled={disabled}
                    uniqueId={`${repairer.id} ${getDateStringFromDate(weekDate)}`}
                    className={`
                        ${props.schedulingRepairDeadline &&
                        props.schedulingRepairDeadline.replaceAll('/', '-') === getDateStringFromDate(weekDate) &&
                        'deadline'} 
                        ${compareDates(weekDate, currentDate) && 'current-day'}`
                    }
                >
                    
                    {/* Calendar events for repairer on week date */}
                    {daysEvents.map(calendarEvent =>
                        <CalendarEvent
                            calendarEvent={calendarEvent}
                            mode={calendarModes.WEEK} 
                            detailsSettings={props.detailsSettings}
                            jobTypes={props.jobTypes}
                            instrumentStatuses={props.instrumentStatuses}
                            onClick={(e) => props.onClickCalendarEvent(e, calendarEvent)}
                        />
                    )}
                    
                    {/* If day is disabled don't allow adding an event */}
                    {!disabled &&
                    <AddCalendarEventButton
                        onClick={(e) => props.openAddCalendarEventPopover(e, getDateStringFromDate(weekDate), repairer.id)}
                    />
                    }

                    {/* 
                        Thin bar at the bottom of day to quickly show how full it is using heat colours.
                        Doesn't show on miscellaneous events, or if a day is disabled
                    */}
                    {repairer.id !== 0 && !disabled &&
                    <div className='time-heat-bar'>
                        <div
                            className={`heat ${HEAT_CSS_CLASSES[heatValue]}`}
                            style={{flex: percentageFull}}
                        />
                        <div className='heat' style={{flex: 1 - percentageFull}} />
                    </div>
                    }

                </CalendarGridBox>
            )

        }

        return calendarGridBoxes;

    }

    const getPercentageFullOfDayForRepairer = (weekDay, repairer, daysEvents) => {

        // If repairer is 'Miscellaneous' return
        if (repairer.id === 0) return 0

        let scheduledTime = 0;
        let maxTime = repairer.hours[weekDay] * 60;

        daysEvents.forEach(event => {

            // Don't count events being dragged
            if (props.draggingEvent && event.id === props.draggingEvent.id) return;

            if (event.type === 'Repair')
                scheduledTime += parseInt(event.time);
            else {
                if (event.all_day)
                    maxTime = 0;
                else
                    scheduledTime += parseInt(event.time);
            }
        })

        const percentageFull = maxTime <= 0 ? 1 : scheduledTime / maxTime;

        return percentageFull;
    }


    // #### UTILITY FUNCTIONS

    // Get a date object for the date 'n' days after the given date object
    const getDateNDaysAfterDate = (date, n) => {

        return new Date(new Date(date).setDate(date.getDate() + n));

    }

    const getEventsForDateAndRepairer = (date, repairerId) => {

        return props.calendarEvents.filter(event =>
            event.repairer_id === repairerId &&
            compareDates(new Date(getDateFromDateString(event.date)), date) &&
            event.id !== props.draggingEventId
        )

    }

    // Returns a date string in the form 'dd-mm-yyyy' from a date object
    const getDateStringFromDate = (date) => {
        return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    }

    // Returns a date object from a date string in the form 'dd-mm-yyyy'
    const getDateFromDateString = (dateString) => {
        return new Date(dateString.split('-')[2], parseInt(dateString.split('-')[1])-1, dateString.split('-')[0]);
    }

    const compareDates = (date1, date2) => {
        return date1.getFullYear() === date2.getFullYear()
            && date1.getMonth() === date2.getMonth()
            && date1.getDate() === date2.getDate();
    }


    return (
        <div className='CalendarWeekView'>

            {/* Top row of calendar grid */}
            <p className='calendar-grid-box day-of-the-week'></p>
            {DAYS_OF_THE_WEEK.map((day, index) => {
                const date = getDateNDaysAfterDate(props.firstWeekDate, index);

                return <p className='calendar-grid-box day-of-the-week'>
                    {day}
                    <span className={compareDates(date, currentDate) ? 'current-day' : ''}>
                        {date.getDate()}
                    </span>
                </p>
            })}


            {/* Calendar grid: repairers */}
            {props.repairers.map(repairer => <>

                <p className='calendar-grid-box repairer-name'>
                    {repairer.name}
                </p>

                {getRepairerCalendarGridBoxes(repairer)}

            </>)}
        
            {/* Calendar grid: miscellaneous */}
            <p className='calendar-grid-box repairer-name'>Miscellaneous</p>

            {getRepairerCalendarGridBoxes({id: 0})}

        </div>
    )

}


/*
    Droppable component for calendar grid box, where events can be dropped
*/
function CalendarGridBox(props) {
    const {setNodeRef} = useDroppable({
        id: props.uniqueId,
        data: { disabled: props.disabled }
    });
    
    return (
        <div
            className={`calendar-grid-box ${props.disabled && 'disabled'} ${props.className}`}
            ref={setNodeRef}
        >
            {props.children}
        </div>
    );
}

export default CalendarWeekView;