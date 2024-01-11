import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import RepairListRepair from './RepairListRepair';

function RepairList() {
    const activeRepairs = useSelector(state => state.activeRepairs);
    const activeCustomers = useSelector(state => state.activeCustomers);
    const activeInstruments = useSelector(state => state.activeInstruments);

    const renderedRepairs = activeRepairs.map(repair => {
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

        </div>
    );
}

export default RepairList;