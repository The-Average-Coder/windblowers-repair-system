import './DatePicker.css';

function DatePicker(props) {

    const dayMonthYearToYearMonthDay = (date) => {
        return `${date.slice(6)}-${date.slice(3, 5)}-${date.slice(0, 2)}`;
    }

    const changeDate = (date) => {
        const dayMonthYear = `${date.slice(8)}-${date.slice(5, 7)}-${date.slice(0, 4)}`;

        if (props.restrictedDays && new Date(date).getDay() < 2) {
            return;
        }

        props.onChange(dayMonthYear);
    }

    return (
        <input type='date' value={dayMonthYearToYearMonthDay(props.value)} onChange={(e) => changeDate(e.target.value)} className={`DatePicker ${props.className}`} />
    );
}

export default DatePicker;