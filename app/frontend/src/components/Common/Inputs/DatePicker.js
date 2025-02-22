import './DatePicker.css';

function DatePicker(props) {
    return (
        <input type='date' className={`DatePicker ${props.className}`} />
    );
}

export default DatePicker;