import DropdownSelect from './DropdownSelect';

function MinutesDropdownSelect(props) {

    const timeMinutesOptions = [
        { name: '0 Minutes', value: 0 },
        { name: '15 Minutes', value: 15 },
        { name: '30 Minutes', value: 30 },
        { name: '45 Minutes', value: 45 }
    ]

    return <DropdownSelect className={props.className} options={timeMinutesOptions} value={props.value} onChange={props.onChange} placeholder='Minutes' disabled={props.disabled} />
}

export default MinutesDropdownSelect;