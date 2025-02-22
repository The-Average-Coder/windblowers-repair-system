import './DropdownSelect.css';

function DropdownSelect(props) {
    return (
        <select className={`DropdownSelect ${props.className}`}>
            {props.options.map(option => <option value={option.value}>{option.name}</option>)}
        </select>
    );
}

export default DropdownSelect;