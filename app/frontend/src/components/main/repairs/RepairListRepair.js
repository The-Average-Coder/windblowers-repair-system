import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function RepairListRepair(props) {
    const navigate = useNavigate();

    const navigateToRepair = () => {
        navigate(`/repairs/repair/${props.repair.id}`)
    }

    const statusColours = ['red', 'orange', 'limegreen', 'darkgrey'];

    return (
        <div className='repair-list-repair' onClick={navigateToRepair}>

            <div className='status' style={{backgroundColor: statusColours[props.repair.status]}} />
            {props.instrument ? props.instrument.in_workshop ? null : <FontAwesomeIcon className='not-in-workshop' icon="fa-solid fa-exclamation" /> : null}
            <p className='instrument-type'>{props.instrument ? props.instrument.type : 'No Instrument'}</p>
            <p className='instrument-model'>{props.instrument ? props.instrument.manufacturer : null} {props.instrument ? props.instrument.model : null}</p>
            <p className='instrument-serial'>{props.instrument ? props.instrument.serial_number : null}</p>
            <p className='job-number'>{props.repair.id}</p>
            <p className='date-created'>Created: {props.repair.date_created}</p>
            <p className='deadline'>Deadline: {props.repair.deadline !== null ? props.repair.deadline : 'Not Set'}</p>
            <p className='customer-name'>{props.customer ? props.customer.firstname : 'No Customer'} {props.customer ? props.customer.surname : null}</p>

        </div>
    );
}

export default RepairListRepair;