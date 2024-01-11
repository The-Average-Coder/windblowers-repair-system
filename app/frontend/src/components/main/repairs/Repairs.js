import { useState } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import PageTitle from '../../common/PageTitle';
import FilterButton from '../../common/FilterButton';
import FilterSearch from '../../common/FilterSearch';
import RepairList from './RepairList';

function Repairs() {
    const [currentView, setCurrentView] = useState(0);
    const [activeFilter, setActiveFilter] = useState(0)
    const [searchFilter, setSearchFilter] = useState('')

    const activeRepairCount = useSelector(state => state.activeRepairs.length)

    const toggleCurrentView = () => {
        setCurrentView((currentView + 1) % 2);
    }

    return (
        <div className='repairs'>

            <div className='title'>
                <PageTitle title='Repairs' />
                <p className='repair-count'>{activeRepairCount}</p>
                <FilterButton contents='All' onClick={() => setActiveFilter(0)} active={activeFilter === 0 ? 'true' : 'false'} />
                <FilterButton contents='Assessment' onClick={() => activeFilter !== 1 ? setActiveFilter(1) : setActiveFilter(0)} active={activeFilter === 1 ? 'true' : 'false'} />
                <FilterButton contents='Open' onClick={() => activeFilter !== 2 ? setActiveFilter(2) : setActiveFilter(0)} active={activeFilter === 2 ? 'true' : 'false'} />
                <FilterButton contents='Complete' onClick={() => activeFilter !== 3 ? setActiveFilter(3) : setActiveFilter(0)} active={activeFilter === 3 ? 'true' : 'false'} />
                <FilterSearch value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} />
            </div>

            {/*<div className='view-toggle'>
                <FontAwesomeIcon onClick={toggleCurrentView} icon='fa-solid fa-list' className={`fa-icon ${currentView === 0 ? 'active' : ''}`} />
                <FontAwesomeIcon onClick={toggleCurrentView} icon='fa-solid fa-calendar' className={`fa-icon ${currentView === 1 ? 'active' : ''}`} />
            </div>*/}

            { currentView === 0 ? <RepairList filter={activeFilter} search={searchFilter} /> : 
            
            <div className ='calendar-box'>


                
            </div>

            }

        </div>
    );
}

export default Repairs;