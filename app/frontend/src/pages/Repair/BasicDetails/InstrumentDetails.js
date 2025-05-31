import BlockTitle from '../../../components/Text/BlockTitle';
import BlockText from '../../../components/Text/BlockText';
import BlockTopRightButton from '../../../components/Buttons/BlockTopRightButton';

import './InstrumentDetails.css';

import expandLight from '../../../images/expand-icon/expandLight.png';
import expandHoverLight from '../../../images/expand-icon/expandHoverLight.png';
import expandDark from '../../../images/expand-icon/expandDark.png';
import expandHoverDark from '../../../images/expand-icon/expandHoverDark.png';

function InstrumentDetails(props) {

    return (

        <div className='InstrumentDetails'>

            {props.instrument ? <>
            <div>
                <BlockTitle>Instrument</BlockTitle>
                <BlockText className='detail'>{props.instrument.manufacturer} {props.instrument.model} {props.instrument.type}</BlockText>
            </div>
            
            <div>
                <BlockTitle>Serial Number</BlockTitle>
                <BlockText className='detail'>{props.instrument.serial_number}</BlockText>
            </div>
            
            <div>
                <BlockTitle>Status</BlockTitle>
                <BlockText className='detail'>{props.instrument.status_id === -1 ? 'Not Set' : props.statuses.length > 0 && props.statuses.find(status => status.id === props.instrument.status_id).status}</BlockText>
            </div>

            <BlockTopRightButton onClick={props.openModal} light={expandLight} lightHover={expandHoverLight} dark={expandDark} darkHover={expandHoverDark} />
        
            </>: 'Loading' }
            
        </div>
    );
}

export default InstrumentDetails;