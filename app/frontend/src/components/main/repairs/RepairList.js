import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import repairStatuses from '../../../enums/repairStatuses';

import RepairListRepair from './RepairListRepair';

function RepairList(props) {
    const activeRepairs = useSelector(state => state.activeRepairs);
    const activeCustomers = useSelector(state => state.activeCustomers);
    const activeInstruments = useSelector(state => state.activeInstruments);

    const filterStatuses = [
        [repairStatuses.CREATED, repairStatuses.ASSESSED],
        [repairStatuses.OPEN],
        [repairStatuses.COMPLETED]
    ]

    const renderedRepairs = activeRepairs.map(repair => {
        if (props.filter !== 0 && !filterStatuses[props.filter-1].includes(repair.status)) return null;
        if (props.search !== '' && !repair.id.includes(props.search)) return null;
        const customer = activeCustomers.find(customer => customer.id === repair.customer_id);
        const instrument = activeInstruments.find(instrument => instrument.id === repair.instrument_id);
        return <RepairListRepair repair={repair} customer={customer} instrument={instrument} />
    })

    return (
        <div className='repair-list'>
                
            <div className='column-header'>
                <FontAwesomeIcon icon='fa-solid fa-circle-check' className='fa-icon' />
                <p className='instrument'>Instrument</p>
                <p className='repair-info'>Repair Info</p>
                <p className='customer'>Customer</p>
            </div>

            {renderedRepairs}
            {renderedRepairs.length === 0  ? 'No more jobs!' : null}

        </div>
    );
}

export default RepairList;