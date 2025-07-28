import DropdownSelect from '../../../components/Inputs/DropdownSelect';

import './CalendarMonthView.css';

function CalendarMonthView(props) {

    // #### CONSTANTS
    const DAYS_OF_THE_WEEK = ['Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const HEAT_CSS_CLASSES = ['empty', 'quiet', 'moderate', 'busy']


    // #### CALENDAR RENDER FUNCTIONS
    const getDayGridBoxes = () => {

        let dayGridBoxes = []

        const numberOfDaysInMonth = getNumberOfDaysInMonth(props.firstMonthDate);
        const firstWeekdayOfMonth = getFirstWeekdayOfMonth(props.firstMonthDate);
        const lastWeekdayOfMonth = getLastWeekdayOfMonth(props.firstMonthDate);

        // Calculate first and last month days, filling out the first and last week with days from other months
        const firstMonthDay = 2 - firstWeekdayOfMonth;
        const lastMonthDay = numberOfDaysInMonth + ((6 - lastWeekdayOfMonth) % 5)

        for (let i = firstMonthDay; i <= lastMonthDay; i++) {

            const monthDate = getDateOfMonthDay(props.firstMonthDate, i);

            if (monthDate.getDay() < 2) continue; // Sunday or Monday

            const daysEvents = getEventsForDate(monthDate);

            const percentageFull = getPercentageFullOfDay(monthDate, daysEvents);

            const heatValue = percentageFull === 0 ? 0 : percentageFull <= 0.25 && 1 || percentageFull <= 0.6 && 2 || 3;

            dayGridBoxes.push(
                <div
                    className={`calendar-grid-box 
                                ${(i < 1 || i > numberOfDaysInMonth) && 'faded'} 
                                ${HEAT_CSS_CLASSES[heatValue]}`}
                    onClick={() => props.navigateToWeek(getFirstWeekDateOfMonthDate(monthDate))}
                >
                    <p className='date'>{monthDate.getDate()}</p>
                </div>
            )

        }

        return dayGridBoxes;

    }

    const getEventsForDate = (date) => {
        return props.calendarEvents.filter(event => compareDates(getDateFromDateString(event.date), date))
    }

    const getPercentageFullOfDay = (monthDate, daysEvents) => {

        const weekDay = monthDate.getDay()


        let maxTime = 0;
        props.repairers.forEach(repairer => {
            console.log(props.repairerFilter)
            if (props.repairerFilter !== 0 && props.repairerFilter !== repairer.id) return;
            maxTime += repairer.hours[weekDay-2] * 60;
        })

        let scheduledTime = 0;
        daysEvents.forEach(event => {

            if (event.repairer_id === 0) return; // Miscellaneous event

            if (props.repairerFilter !== 0 && props.repairerFilter !== event.repairer_id) return;

            if (event.type === 'Repair')
                scheduledTime += parseInt(event.time);
            else {
                if (event.all_day)
                    maxTime -= props.repairers.find(repairer => repairer.id === event.repairer_id).hours[weekDay-2] * 60;
                else
                    scheduledTime += parseInt(event.time);
            }
        })

        const percentageFull = maxTime <= 0 ? 1 : scheduledTime / maxTime;

        return percentageFull;
    }

    const getFirstWeekDateOfMonthDate = (monthDate) => {
        const firstWeekDateDay = monthDate.getDate() - monthDate.getDay() + 2;
        return new Date(monthDate.getFullYear(), monthDate.getMonth(), firstWeekDateDay);
    }

    // #### UTILITY FUNCTIONS
    const compareDates = (date1, date2) => {
        return date1.getTime() === date2.getTime();
    }

    // Returns a date object from a date string in the form 'dd-mm-yyyy'
    const getDateFromDateString = (dateString) => {
        return new Date(dateString.split('-')[2], parseInt(dateString.split('-')[1])-1, dateString.split('-')[0]);
    }

    /*
        Get a date object for the day number of a month, including negative numbers
        and numbers greater than the length of the month
    */
    const getDateOfMonthDay = (firstMonthDate, monthDay) => {
        return new Date(firstMonthDate.getFullYear(), firstMonthDate.getMonth(), monthDay);
    }

    const getNumberOfDaysInMonth = (firstMonthDate) => {
        return new Date(firstMonthDate.getFullYear(), firstMonthDate.getMonth() + 1, 0).getDate();
    }

    const getFirstWeekdayOfMonth = (firstMonthDate) => {
        return firstMonthDate.getDay();
    }

    const getLastWeekdayOfMonth = (firstMonthDate) => {
        return new Date(firstMonthDate.getFullYear(), firstMonthDate.getMonth() + 1, 0).getDay();
    }


    return (
        <div className='CalendarMonthView'>

            {/* Top row of calendar grid */}
            {DAYS_OF_THE_WEEK.map(day =>
                <p className='calendar-grid-box day-of-the-week'>{day}</p>
            )}

            {/* Calendar grid */}
            {getDayGridBoxes()}

        </div>
    )

}

export default CalendarMonthView;