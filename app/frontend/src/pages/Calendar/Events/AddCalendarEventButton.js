import './AddCalendarEventButton.css';

import plusBlack from '../../../images/plus-icon/plusBlack.png';
import plusWhite from '../../../images/plus-icon/plusWhite.png';

function AddCalendarEventButton(props) {
    return (
        <button className='AddCalendarEventButton' onClick={props.onClick}>
            <img className='light' src={plusBlack} />
            <img className='dark' src={plusWhite} />
        </button>
    );
}

export default AddCalendarEventButton;