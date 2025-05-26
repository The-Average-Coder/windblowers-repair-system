import './HeaderButton.css';

function HeaderButton(props) {
    return (
        <button className={`HeaderButton ${props.className}`} onClick={props.onClick}>
            <img className='light' src={props.light} />
            <img className='dark' src={props.dark} />
        </button>
    );
}

export default HeaderButton;