import BlockTitle from '../../../Common/Text/BlockTitle';
import BlockText from '../../../Common/Text/BlockText';
import BlockTopRightButton from '../../../Common/Buttons/BlockTopRightButton';

import './CustomerDetails.css';

import expandLight from '../../../../images/expand-icon/expandLight.png';
import expandHoverLight from '../../../../images/expand-icon/expandHoverLight.png';
import expandDark from '../../../../images/expand-icon/expandDark.png';
import expandHoverDark from '../../../../images/expand-icon/expandHoverDark.png';

function CustomerDetails(props) {
    return (
        <div className='CustomerDetails'>
            <div>
                <BlockTitle>Customer</BlockTitle>
                <BlockText className='detail'>{props.customer.firstname} {props.customer.surname}</BlockText>
            </div>
            
            <div>
                <BlockTitle>Contact Information</BlockTitle>
                <BlockText className='detail'>{props.customer.email}</BlockText>
                <BlockText className='detail'>{props.customer.phone}</BlockText>
            </div>

            <div>
                <BlockTitle>Address</BlockTitle>
                <BlockText className='detail'>{props.customer.postcode}</BlockText>
            </div>

            <BlockTopRightButton onClick={props.openModal} light={expandLight} lightHover={expandHoverLight} dark={expandDark} darkHover={expandHoverDark} />
        </div>
    );
}

export default CustomerDetails;