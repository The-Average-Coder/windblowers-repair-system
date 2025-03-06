import BlockTitle from '../../../Common/Text/BlockTitle';
import BlockText from '../../../Common/Text/BlockText';
import BlockTopRightButton from '../../../Common/Buttons/BlockTopRightButton';

import './InstrumentDetails.css';

import expandLight from '../../../../images/expand-icon/expandLight.png';
import expandHoverLight from '../../../../images/expand-icon/expandHoverLight.png';
import expandDark from '../../../../images/expand-icon/expandDark.png';
import expandHoverDark from '../../../../images/expand-icon/expandHoverDark.png';

function InstrumentDetails(props) {
    return (
        <div className='InstrumentDetails'>
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
                <BlockText className='detail'>In Workshop</BlockText>
            </div>

            <BlockTopRightButton light={expandLight} lightHover={expandHoverLight} dark={expandDark} darkHover={expandHoverDark} />
        </div>
    );
}

export default InstrumentDetails;