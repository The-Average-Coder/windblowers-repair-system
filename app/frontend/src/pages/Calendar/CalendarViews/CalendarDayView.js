import calendarModes from '../../../enums/calendarModes';

import CalendarEvent from '../Events/CalendarEvent';

import './CalendarDayView.css';

function CalendarDayView(props) {

    const currentDate = new Date();

    // #### CONSTANTS
    const DAYS = ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    
    // #### UTILITY FUNCTIONS
    const getEventsForDateAndRepairer = (date, repairerId) => {

        return props.calendarEvents.filter(event =>
            event.repairer_id === repairerId &&
            compareDates(getDateFromDateString(event.date), date) &&
            event.id !== props.draggingEventId
        )

    }

    const compareDates = (date1, date2) => {
        return date1.getTime() === date2.getTime();
    }

    // Returns a date object from a date string in the form 'dd-mm-yyyy'
    const getDateFromDateString = (dateString) => {
        return new Date(dateString.split('-')[2], parseInt(dateString.split('-')[1])-1, dateString.split('-')[0]);
    }


    return (
        <div className='CalendarDayView'>

            <p className='currently-viewing-day-title'>
                {DAYS[props.date.getDay() - 2]}
                <span className={compareDates(props.date, currentDate)
                    ? 'current-day' : ''}>
                        {props.date.getDate()}
                </span>
            </p>

            <div className='calendar-flex-container'>

                {/* Calendar flex: repairers */}
                {props.repairers.map(repairer => <div className='repairer-column'>

                    <div className='title-row'>
                        {repairer.name}
                    </div>

                    {/* Calendar events for repairer on shown day */}
                    <div className={`events-row ${repairer.hours[props.date.getDay() - 2] === 0 && 'disabled'}`}>
                        {getEventsForDateAndRepairer(props.date, repairer.id)
                            .map(calendarEvent =>
                            <CalendarEvent
                                calendarEvent={calendarEvent}
                                mode={calendarModes.DAY} 
                                detailsSettings={props.detailsSettings}
                                jobTypes={props.jobTypes}
                                instrumentStatuses={props.instrumentStatuses}
                                onClick={(e) => props.onClickCalendarEvent(e, calendarEvent)}
                            />
                            )
                        }
                    </div>

                </div>)}

                {/* Miscellaneous column */}
                <div className='repairer-column'>

                    <div className='title-row'>
                        Miscellaneous
                    </div>

                    <div className='events-row'>
                        {getEventsForDateAndRepairer(props.date, 0)
                            .map(calendarEvent =>
                            <CalendarEvent
                                calendarEvent={calendarEvent}
                                mode={calendarModes.DAY}
                                detailsSettings={props.detailsSettings}
                                jobTypes={props.jobTypes}
                                instrumentStatuses={props.instrumentStatuses}
                                onClick={(e) => props.onClickCalendarEvent(e, calendarEvent)}
                            />
                            )
                        }
                    </div>

                </div>

            </div>

        </div>
    )

}

export default CalendarDayView;