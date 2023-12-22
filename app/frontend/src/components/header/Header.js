import brand from '../../images/brand-red.png'

function Header() {
    return (
        <div className='header'>

            <img className='brand' src={brand} />

            <form className='search'>
                <div className='search-bar'>
                    <input type='text' placeholder='Search' />
                </div>
            </form>


        </div>
    );
}

export default Header;