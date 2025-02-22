import './ToggleSwitch.css';

function ToggleSwitch(props) {
    return (
        <label className={`ToggleSwitch ${props.className}`}>
            <input type='checkbox' />
            <span className='slider'></span>
        </label>
    );
}

export default ToggleSwitch;