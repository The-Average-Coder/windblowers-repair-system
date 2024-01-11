import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import RepairListRepair from './RepairListRepair';

const selectRepairs = state => state.activeRepairs;
const selectCustomers = state => state.activeCustomers;

function RepairList() {
    const activeRepairs = useSelector(selectRepairs);
    const activeCustomers = useSelector(selectCustomers);

    const renderedRepairs = activeRepairs.map(repair => {
        const customer = activeCustomers.find(customer => customer.id === repair.customer_id);
        const instrument = [];
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