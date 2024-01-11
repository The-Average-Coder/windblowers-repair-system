import brand from '../../images/brand-red.png'

import SearchBar from './SearchBar';

function Header() {
    return (
        <div className='header'>

            <img className='brand' src={brand} alt='brand' />

            <SearchBar />

        </div>
    );
}

export default Header;