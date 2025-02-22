import SearchBar from './SearchBar';

import './Header.css'

import brandRed from '../../images/brandRed.png'
import brandWhite from '../../images/brandWhite.png'

function Header() {
    return (
        <div className='Header'>

            <img className='brand red' src={brandRed} alt='brand' />
            <img className='brand white' src={brandWhite} alt='brand' />

            <SearchBar />

        </div>
    );
}

export default Header;