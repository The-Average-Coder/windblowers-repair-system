import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ActionButton from '../../common/ActionButton';
import { deleteActivity } from '../../../reducers/activity/activitySlice';

function ActivityElement(props) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const repair = useSelector(state => {
        const repair = state.activeRepairs.activeRepairs.find(repair => repair.id === props.activity.repair_id);
        return repair ? repair : null;
    })
    const instrument = useSelector(state => {
        if (!repair) return null;
        const instrument = state.activeInstruments.activeInstruments.find(instrument => instrument.id === repair.instrument_id);
        return instrument ? instrument : null;
    });

    const navigateToRepair = () => {
        if (repair) navigate(`/repairs/repair/${repair.id}`)
    }

    const dismissNotification = (e) => {
        e.stopPropagation();
        dispatch(deleteActivity(props.activity.id))
    }

    return (
        <div className='activity-element' onClick={navigateToRepair}>

            {repair === null ?
            <p className='no-repair-message'>No Repair Found</p>
            :
            <>
            <p className='job-number'>{repair.id !== null ? repair.id : 'No ID'}</p>
            <p className='instrument'>{instrument !== null ? instrument.type : 'No Instrument' }</p>
            </>
            }
            <p className='info'>{props.activity.type}</p>
            <ActionButton onClick={dismissNotification} className='remove' contents='Dismiss' />

        </div>
    );
}

export default ActivityElement;