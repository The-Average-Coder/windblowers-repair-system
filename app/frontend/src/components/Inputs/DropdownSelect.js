import './DropdownSelect.css';

function DropdownSelect(props) {
    return (
        <select className={`DropdownSelect ${props.className}`} value={props.value} onChange={(e) => props.onChange(e.target.value)} style={props.icon ? {backgroundImage: `url(${props.icon})`, paddingLeft: '32px'} : null} disabled={props.disabled}>
            <option value='' selected disabled hidden>{props.placeholder}</option>
            {props.options.map(option => {
                if (option.name === undefined) {
                    return <optgroup label={option.group}>
                        {option.options.map(groupOption => <option value={groupOption.value}>{groupOption.name}</option>)}
                    </optgroup>
                }
                return <option value={option.value}>{option.name}</option>
            })}
        </select>
    );
}

export default DropdownSelect;