import { useState } from 'react';

import FilterButton from '../common/FilterButton';
import ActivityElement from './ActivityElement';

function Activity() {
    const [activeFilter, setActiveFilter] = useState(0)

    return (
        <div className='activity'>
            
            <div className='activity-subtitle'>
                <p>Activity</p>
                <FilterButton contents='All' onClick={() => setActiveFilter(0)} active={activeFilter === 0 ? 'true' : 'false'} />
                <FilterButton contents='Filter' onClick={() => setActiveFilter(1)} active={activeFilter === 1 ? 'true' : 'false'} />
            </div>

            <div className='activity-box'>

                <div className='column-header'>
                    <p className='name'>Name</p>
                    <p className='info'>Info</p>
                </div>

                <ActivityElement />
                <ActivityElement />

            </div>

        </div>
    );
}

export default Activity;