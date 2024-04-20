import { useSelector } from 'react-redux';
import { useState } from 'react';

import FilterButton from '../../common/FilterButton';
import ActivityElement from './ActivityElement';
import activityTypes from '../../../enums/activityTypes';

function Activity() {
    const { activityLoading, activity } = useSelector(state => state.activity);

    const [activeFilter, setActiveFilter] = useState(0)

    const renderedActivity = activity.map(activity => {
        if (activeFilter == 1 && activity.type === activityTypes.COMPLETED || activeFilter == 2 && activity.type === activityTypes.ASSESSED) return
        return <ActivityElement activity={activity} />
    })

    return (
        <div className='activity'>
            
            <div className='activity-subtitle'>
                <p>Activity</p>
                <FilterButton contents='All' onClick={() => setActiveFilter(0)} active={activeFilter === 0 ? 'true' : 'false'} />
                <FilterButton contents='Assessed' onClick={() => activeFilter !== 1 ? setActiveFilter(1) : setActiveFilter(0)} active={activeFilter === 1 ? 'true' : 'false'} />
                <FilterButton contents='Complete' onClick={() => activeFilter !== 2 ? setActiveFilter(2) : setActiveFilter(0)} active={activeFilter === 2 ? 'true' : 'false'} />
            </div>

            <div className='activity-box'>

                <div className='column-header'>
                    <p className='name'>Repair</p>
                    <p className='info'>Activity</p>
                </div>

                {activityLoading ? <p className='no-activity-message'>Loading...</p> :
                
                renderedActivity.length > 0 ? renderedActivity : <p className='no-activity-message'>All Done!</p>}

            </div>

        </div>
    );
}

export default Activity;