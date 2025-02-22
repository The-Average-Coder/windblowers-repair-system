import './DropdownSelect.css';

function DropdownSelect(props) {
    return (
        <select className={`DropdownSelect ${props.className}`} style={props.icon ? {backgroundImage: `url(${props.icon})`, paddingLeft: '32px'} : null}>
            {props.options.map(option => <option value={option.value}>{option.name}</option>)}
        </select>
    );
}

export default DropdownSelect;