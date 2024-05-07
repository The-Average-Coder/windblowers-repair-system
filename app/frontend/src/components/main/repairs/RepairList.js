import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import repairStatuses from '../../../enums/repairStatuses';

import RepairListRepair from './RepairListRepair';

function RepairList(props) {
    const { repairsLoading, assessmentsLoading, activeRepairs } = useSelector(state => state.activeRepairs);
    const { customersLoading, activeCustomers } = useSelector(state => state.activeCustomers);
    const { instrumentsLoading, activeInstruments } = useSelector(state => state.activeInstruments);
    const { calendarEventsLoading, recentCalendarEvents } = useSelector(state => state.recentCalendarEvents);

    const filterStatuses = [
        [repairStatuses.CREATED],
        [repairStatuses.OPEN],
        [repairStatuses.COMPLETED],
    ]

    const renderedRepairs = activeRepairs.map(repair => {
        if (repair.status >= repairStatuses.COLLECTED) return null;
        if (props.filter !== 0) {
            if (props.filter <= 3 && !filterStatuses[props.filter-1].includes(repair.status)) return null;
            if (props.filter === 4) {
                const timeAllocated = recentCalendarEvents.filter(event => event.repair_id === parseInt(repair.id)).reduce((a, b) => a + b.time, 0);
                const timeRequired = repair.assessments[repair.assessments.length - 1].time;
                if (timeAllocated >= timeRequired) return null;
            }
        }
        const customer = activeCustomers.find(customer => customer.id === repair.customer_id);
        const instrument = activeInstruments.find(instrument => instrument.id === repair.instrument_id);
        if (props.search !== '') {
            for (const searchTerm of props.search.split(' ')) {
                if (!repair.id.concat(customer.surname, customer.firstname, customer.telephone, customer.address, customer.email,
                    instrument.type, instrument.manufacturer, instrument.model, instrument.serial_number).toLowerCase().includes(searchTerm.toLowerCase())) return null;
            }
        }
        return <RepairListRepair repair={repair} customer={customer} instrument={instrument} />
    }).filter(repair => repair !== null);

    return (
        <div className='repair-list'>
            <div className='column-header'>
                <FontAwesomeIcon icon='fa-solid fa-circle-check' className='fa-icon' />
                <p className='instrument'>Instrument</p>
                <p className='repair-info'>Repair Info</p>
                <p className='customer'>Customer</p>
            </div>

            {renderedRepairs}
            {renderedRepairs.length === 0  ? <p className='no-jobs-message'>No more jobs!</p> : null}

        </div>
    );
}

export default RepairList;