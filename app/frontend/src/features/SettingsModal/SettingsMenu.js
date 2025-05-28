import './SettingsMenu.css';

function SettingsMenu(props) {
    return (
        <div className='SettingsMenu'>
            {props.pages.map((page, index) => <button className={index === props.currentPage ? 'active' : null} onClick={() => props.setCurrentPage(index)}>{page}</button>)}
        </div>
    )
}

export default SettingsMenu;