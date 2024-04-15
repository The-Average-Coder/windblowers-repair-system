import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchBar() {
    const [searchQuery, setSearchQuery] = useState('');

    const navigate = useNavigate();

    const submitSearch = (e) => {
        e.preventDefault();
        navigate(`/search/${searchQuery}`);
        setSearchQuery('');
    }

    return (
        <form className='search' onSubmit={submitSearch}>
            <div className='search-bar'>
                <input type='text' placeholder='Search' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
        </form>
    );
}

export default SearchBar;