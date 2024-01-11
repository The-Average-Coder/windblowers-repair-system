import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ActivityElement(props) {
    const navigate = useNavigate();

    const repair = useSelector(state => state.activeRepairs.find(repair => repair.id === props.activity.repair_id))
    const instrument = useSelector(state => state.activeInstruments.find(instrument => instrument.id === repair.instrument_id))

    const navigateToRepair = () => {
        navigate(`/repairs/repair/${repair.id}`)
    }

    return (
        <div className='activity-element' onClick={navigateToRepair}>

            <p className='job-number'>{repair.id}</p>
            <p className='instrument'>{instrument.type}</p>
            <p className='info'>{props.activity.type}</p>

        </div>
    );
}

export default ActivityElement;