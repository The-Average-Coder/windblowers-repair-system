import './ToggleSwitch.css';

function ToggleSwitch(props) {
    return (
        <label className={`ToggleSwitch ${props.className}`}>
            <input type='checkbox' checked={props.value} onChange={(e) => {props.onChange(e.target.checked)}} />
            <span className='slider'></span>
        </label>
    );
}

export default ToggleSwitch;