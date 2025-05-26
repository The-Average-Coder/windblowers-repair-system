import BlockTitle from '../../../components/Text/BlockTitle';
import BlockText from '../../../components/Text/BlockText';
import BlockTopRightButton from '../../../components/Buttons/BlockTopRightButton';

import './InstrumentDetails.css';

import expandLight from '../../../images/expand-icon/expandLight.png';
import expandHoverLight from '../../../images/expand-icon/expandHoverLight.png';
import expandDark from '../../../images/expand-icon/expandDark.png';
import expandHoverDark from '../../../images/expand-icon/expandHoverDark.png';

function InstrumentDetails(props) {
    const statuses = [
        'Not Set', 'Not Yet Dropped Off', 'In Workshop'
    ]

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
                <BlockText className='detail'>{statuses[props.instrument.status]}</BlockText>
            </div>

            <BlockTopRightButton onClick={props.openModal} light={expandLight} lightHover={expandHoverLight} dark={expandDark} darkHover={expandHoverDark} />
        </div>
    );
}

export default InstrumentDetails;