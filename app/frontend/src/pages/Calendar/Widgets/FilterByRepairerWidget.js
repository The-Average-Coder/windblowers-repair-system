import DropdownSelect from '../../../components/Inputs/DropdownSelect';

import './FilterByRepairerWidget.css';

function FilterByRepairerWidget(props) {

    const REPAIRER_OPTIONS = [
        {name: 'All Repairers', value: 0},
        ...props.repairers.map(repairer => {
            return {name: repairer.name, value: repairer.id}})
    ]

    return (
        <DropdownSelect className='FilterByRepairerWidget' options={REPAIRER_OPTIONS} value={props.repairerFilter} onChange={(value) => props.updateRepairerFilter(parseInt(value))} />
    )

}

export default FilterByRepairerWidget;