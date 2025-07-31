import { useState } from 'react';

import BlockTitle from './BlockTitle';
import BlockText from './BlockText';

import './CollapsibleText.css';

import caretDown from '../../images/caret-icons/caretDownBlack.png';
import caretUp from '../../images/caret-icons/caretUpBlack.png';

function CollapsibleText(props) {

    const [isOpen, setIsOpen] = useState(false);

    const toggleIsOpen = () => setIsOpen(!isOpen);

    return (
        <div className='CollapsibleText' onClick={toggleIsOpen}>

            <BlockTitle>{props.title} <button><img src={isOpen ? caretUp : caretDown} /></button></BlockTitle>

            {isOpen &&
            <BlockText>{props.children}</BlockText>
            }

        </div>
    )
}

export default CollapsibleText;