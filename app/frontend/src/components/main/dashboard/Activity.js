import { useSelector } from 'react-redux';
import { useState } from 'react';

import FilterButton from '../../common/FilterButton';
import ActivityElement from './ActivityElement';

function Activity() {
    const activity = useSelector(state => state.activity);

    const [activeFilter, setActiveFilter] = useState(0)

    const renderedActivity = activity.map(activity => {
        return <ActivityElement activity={activity} />
    })

    return (
        <div className='activity'>
            
            <div className='activity-subtitle'>
                <p>Activity</p>
                <FilterButton contents='All' onClick={() => setActiveFilter(0)} active={activeFilter === 0 ? 'true' : 'false'} />
                <FilterButton contents='Filter' onClick={() => activeFilter !== 1 ? setActiveFilter(1) : setActiveFilter(0)} active={activeFilter === 1 ? 'true' : 'false'} />
            </div>

            <div className='activity-box'>

                <div className='column-header'>
                    <p className='name'>Repair</p>
                    <p className='info'>Activity</p>
                </div>

                {renderedActivity}

            </div>

        </div>
    );
}

export default Activity;