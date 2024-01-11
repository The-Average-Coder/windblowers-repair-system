import PageTitle from '../common/PageTitle';

import Activity from './Activity';

function Dashboard() {
    return (
        <div className='dashboard'>

            <PageTitle title='Dashboard' />

            <div className='stats'>
                <div className = 'secondary stat-box'>Stat Box</div>
                <div className = 'primary stat-box'>Stat Box</div>
                <div className = 'secondary stat-box'>Stat Box</div>
            </div>

            <Activity />

        </div>
    );
}

export default Dashboard;