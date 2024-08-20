function ActionButton(props) {
    return (
        <div className={'action-button ' + props.className} style={props.style}>

            <button onClick={props.onClick} style={props.buttonStyle}>{props.contents}</button>

        </div>
    );
}

export default ActionButton;