function FilterSearch(props) {


    return (
        <div className='filter-search'>

            <input type='text' placeholder='Search' value={props.value} onChange={props.onChange} />

        </div>
    );
}

export default FilterSearch;