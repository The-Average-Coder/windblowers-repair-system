import { useState } from 'react';

import SearchBar from './SearchBar/SearchBar';
import BlockTopRightButton from '../../components/Buttons/BlockTopRightButton';
import HeaderButton from './HeaderButton';

import './Header.css'

import brandRed from '../../images/brandRed.png'
import brandWhite from '../../images/brandWhite.png'

import settingsLight from '../../images/settings-icon/settingsLight.png';

import closeLight from '../../images/close-icon/closeHoverLight.png';
import closeDark from '../../images/close-icon/closeHoverDark.png';
function Header() {

    const [hamburgerMenuOpen, setHamburgerMenuOpen] = useState(false);

    return (
        <div className='Header'>

            <img className='brand red' src={brandRed} alt='brand' />
            <img className='brand white' src={brandWhite} alt='brand' />

            <SearchBar />

            <HeaderButton light={settingsLight}></HeaderButton>

        </div>
    );
}

export default Header;