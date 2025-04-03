import DropdownSelect from './DropdownSelect';

function HoursDropdownSelect(props) {

    const timeHoursOptions = [
        { name: '0 Hours', value: 0 },
        { name: '1 Hour', value: 1 },
        { name: '2 Hours', value: 2 },
        { name: '3 Hours', value: 3 },
        { name: '4 Hours', value: 4 },
        { name: '5 Hours', value: 5 },
        { name: '6 Hours', value: 6 },
        { name: '7 Hours', value: 7 },
        { name: '8 Hours', value: 8 }
    ]

    return <DropdownSelect className={props.className} options={timeHoursOptions} value={props.value} onChange={props.onChange} placeholder='Hours' />
}

export default HoursDropdownSelect;