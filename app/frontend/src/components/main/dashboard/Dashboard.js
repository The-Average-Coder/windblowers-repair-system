import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CountUp from 'react-countup';
import axios from 'axios';

import repairStatuses from '../../../enums/repairStatuses';

import PageTitle from '../../common/PageTitle';
import Activity from './Activity';

function Dashboard() {
    const { repairsLoading, assessmentsLoading, activeRepairs } = useSelector(state => state.activeRepairs)
    const assessmentCount = activeRepairs.filter(repair => repair.status === repairStatuses.CREATED || repair.status === repairStatuses.ASSESSED).length;
    const openCount = activeRepairs.filter(repair => repair.status === repairStatuses.OPEN).length;
    const completeCount = activeRepairs.filter(repair => repair.status === repairStatuses.COMPLETED).length;
    
    const [repairsRecievedMonth, setRepairsRecievedMonth] = useState(0);
    const [repairsCompleteMonth, setRepairsCompleteMonth] = useState(0);

    useEffect(() => {
        axios.get('/api/repairs/getRepairsRecievedThisMonth').then((response) => setRepairsRecievedMonth(response.data[0].repairCount));
        axios.get('/api/repairs/getRepairsCompleteThisMonth').then((response) => setRepairsCompleteMonth(response.data[0].repairCount));
    })

    return (
        <div className='dashboard'>
            
            <div className='title'>
                <PageTitle title='Dashboard' />
            </div>

            <div className='stats'>
                <div className = 'secondary left stat-box'>
                    <p className='month-recieved'><CountUp end={repairsRecievedMonth} duration={2} /></p>
                    <p className='subtext'>Repairs Recieved This Month</p>
                </div>
                <div className = 'primary stat-box'>
                    <p className='active-repairs'><CountUp end={activeRepairs.length} duration={2} /></p>
                    <p className='subtext'>Active Repairs</p>
                    <div className='distribution-bar'>
                        <div className='assessment' style={{flex: assessmentCount}} />
                        <div className='open' style={{flex: openCount}} />
                        <div className='complete' style={{flex: completeCount}} />
                    </div>
                    <div className='distribution-bar-subtext'>
                        {assessmentCount > 0 ? <p className='assessment' style={{flex: assessmentCount}}>{assessmentCount}</p> : null}
                        {openCount > 0 ? <p className='open' style={{flex: openCount}}>{openCount}</p> : null}
                        {completeCount > 0 ? <p className='complete' style={{flex: completeCount}}>{completeCount}</p> : null}
                    </div>
                </div>
                <div className = 'secondary right stat-box'>
                    <p className='month-complete'><CountUp end={repairsCompleteMonth} duration={2} /></p>
                    <p className='subtext'>Repairs Complete This Month</p>
                </div>
            </div>

            <Activity />

        </div>
    );
}

export default Dashboard;