import ContentBlock from './ContentBlock';

import './ModalWindow.css';

function ModalWindow(props) {
    return (
        <div className='ModalWindow'>
            <ContentBlock className={`window ${props.className}`}>
                {props.children}
                <button className='close-button' onClick={props.closeFunction}>Close</button>
            </ContentBlock>
        </div>
    );
}

export default ModalWindow;