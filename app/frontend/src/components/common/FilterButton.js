function FilterButton(props) {
    return (
        <div className='filter'>

            <button onClick={props.onClick} className={props.active === 'true' ? 'active' : ''}>{props.contents}</button>

        </div>
    );
}

export default FilterButton;