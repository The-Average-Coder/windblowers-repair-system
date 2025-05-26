import BlockTopRightButton from '../Buttons/BlockTopRightButton';
import ContentBlock from './ContentBlock';

import './ModalWindow.css';

import closeLight from '../../images/close-icon/closeLight.png';
import closeHoverLight from '../../images/close-icon/closeHoverLight.png';
import closeDark from '../../images/close-icon/closeDark.png';
import closeHoverDark from '../../images/close-icon/closeHoverDark.png';

function ModalWindow(props) {
    return (
        <div className='ModalWindow'>
            <ContentBlock className={`window ${props.className}`}>
                {props.children}
                <BlockTopRightButton onClick={props.closeFunction} light={closeLight} lightHover={closeHoverLight} dark={closeDark} darkHover={closeHoverDark} />
            </ContentBlock>
        </div>
    );
}

export default ModalWindow;