function Dashboard() {
    return (
        <div className='dashboard'>

            <p className='title'>Dashboard</p>

            <div className='stats'>
                <div className = 'secondary stat-box'>Stat Box</div>
                <div className = 'primary stat-box'>Stat Box</div>
                <div className = 'secondary stat-box'>Stat Box</div>
            </div>

            <div className='activity-subtitle'>
                Activity
                <button className='filter'>Hello</button>
            </div>

            <div className='activity'>

            </div>

        </div>
    );
}

export default Dashboard;