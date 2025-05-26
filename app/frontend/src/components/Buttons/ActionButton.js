import './ActionButton.css';

function ActionButton(props) {
    return (
        <button className={`ActionButton ${props.colored ? 'colored' : 'transparent'} ${props.className}`} onClick={props.onClick}>{props.children}</button>
    );
}

export default ActionButton;