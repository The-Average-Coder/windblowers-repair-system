import { useNavigate } from 'react-router-dom';

function RepairListRepair(props) {
    const navigate = useNavigate();

    const navigateToRepair = () => {
        navigate(`/repairs/repair/${props.repair.id}`)
    }

    const statusColours = ['red', 'red', 'orange', 'limegreen', 'darkgrey'];

    return (
        <div className='repair-list-repair' onClick={navigateToRepair}>

            <div className='status' style={{backgroundColor: statusColours[props.repair.status]}} />
            <p className='instrument-type'>Flute</p>
            <p className='date-created'>Created: {props.repair.date_created}</p>
            <p className='deadline'>Deadline: {props.repair.deadline !== null ? props.repairs.deadline : 'Not Set'}</p>
            <p className='customer-name'>{props.customer.firstname} {props.customer.surname}</p>

        </div>
    );
}

export default RepairListRepair;