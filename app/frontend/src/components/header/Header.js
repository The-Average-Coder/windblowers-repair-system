import { useState } from 'react';

import SearchBar from './SearchBar/SearchBar';
import BlockTopRightButton from '../Common/Buttons/BlockTopRightButton';
import HamburgerMenu from './HamburgerMenu';

import './Header.css'

import brandRed from '../../images/brandRed.png'
import brandWhite from '../../images/brandWhite.png'
import hamburgerLight from '../../images/hamburger-icons/hamburgerLight.png';
import hamburgerDark from '../../images/hamburger-icons/hamburgerDark.png';
import closeLight from '../../images/close-icon/closeHoverLight.png';
import closeDark from '../../images/close-icon/closeHoverDark.png';

function Header() {

    const [hamburgerMenuOpen, setHamburgerMenuOpen] = useState(false);

    return (
        <div className='Header'>

            <img className='brand red' src={brandRed} alt='brand' />
            <img className='brand white' src={brandWhite} alt='brand' />

            <SearchBar />

            <BlockTopRightButton onClick={() => setHamburgerMenuOpen(!hamburgerMenuOpen)} 
            light={hamburgerMenuOpen ? closeLight : hamburgerLight} 
            lightHover={hamburgerMenuOpen ? closeLight : hamburgerLight}
            dark={hamburgerMenuOpen ? closeDark : hamburgerDark}
            darkHover={hamburgerMenuOpen ? closeDark : hamburgerDark}
            />
            
            {hamburgerMenuOpen && <HamburgerMenu closeFunction={() => setHamburgerMenuOpen(!hamburgerMenuOpen)} />}

        </div>
    );
}

export default Header;