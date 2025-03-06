import './BlockTopRightButton.css';

function BlockTopRightButton(props) {
    return (
        <button className={`BlockTopRightButton ${props.className}`} onClick={props.onClick}>
            <img className='light' src={props.light} />
            <img className='light-hover' src={props.lightHover} />
            <img className='dark' src={props.dark} />
            <img className='dark-hover' src={props.darkHover} />
        </button>
    );
}

export default BlockTopRightButton;