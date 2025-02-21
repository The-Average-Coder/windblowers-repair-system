import SearchBar from './SearchBar';

import './Header.css'

import brand from '../../images/brand.png'

function Header() {
    return (
        <div className='Header'>

            <img className='brand' src={brand} alt='brand' />

            <SearchBar />

        </div>
    );
}

export default Header;