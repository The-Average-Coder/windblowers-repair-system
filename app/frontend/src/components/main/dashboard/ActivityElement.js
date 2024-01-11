import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ActivityElement(props) {
    const navigate = useNavigate();

    const repair = useSelector(state => {
        if (!state.activeRepairs.find(repair => repair.id === props.activity.repair_id))
            return null
        return state.activeRepairs.find(repair => repair.id === props.activity.repair_id)
    })
    const instrument = useSelector(state => {
        if (!repair || !state.activeInstruments.find(instrument => instrument.id === repair.instrument_id))
            return null
        return state.activeInstruments.find(instrument => instrument.id === repair.instrument_id)
    });

    const navigateToRepair = () => {
        navigate(`/repairs/repair/${repair.id}`)
    }

    return (
        <div className='activity-element' onClick={navigateToRepair}>

            {repair === null ?
            <p className='no-repair-message'>No Repair Found</p>
            :
            <>
            <p className='job-number'>{repair.id !== null ? repair.id : 'No ID'}</p>
            <p className='instrument'>{instrument.type !== null ? instrument.type : 'No Type' }</p>
            </>
            }
            <p className='info'>{props.activity.type}</p>

        </div>
    );
}

export default ActivityElement;