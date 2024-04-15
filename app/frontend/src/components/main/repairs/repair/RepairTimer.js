import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function RepairTimer(props) {
    return (
        <div className='repair-timer'>

            <div className='timer'><p>0</p><p>0</p>:<p>0</p><p>0</p>:<p>0</p><p>0</p></div>
            <div className='timer-labels'>
                <p>hr</p>
                <p>min</p>
                <p>sec</p>
            </div>

            <div className='control-buttons'>
                <div className='play-pause-button'><FontAwesomeIcon icon={`fa-solid ${'fa-circle-play'}`} /></div>
                <div className='reset-button'><FontAwesomeIcon icon='fa-solid fa-rotate-left' /></div>
            </div>
            
        </div>
    );
}

export default RepairTimer;