import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import PageTitle from '../common/PageTitle';
import RepairList from './RepairList';

function Repairs() {
    const [currentView, setCurrentView] = useState(0);

    const toggleCurrentView = () => {
        setCurrentView((currentView + 1) % 2);
    }

    return (
        <div className='repairs'>

            <PageTitle title='Repairs' />

            <div className='view-toggle'>
                <FontAwesomeIcon onClick={toggleCurrentView} icon='fa-solid fa-list' className={`fa-icon ${currentView === 0 ? 'active' : ''}`} />
                <FontAwesomeIcon onClick={toggleCurrentView} icon='fa-solid fa-calendar' className={`fa-icon ${currentView === 1 ? 'active' : ''}`} />
            </div>

            { currentView === 0 ? <RepairList /> : 
            
            <div className ='calendar-box'>


                
            </div>

            }

        </div>
    );
}

export default Repairs;