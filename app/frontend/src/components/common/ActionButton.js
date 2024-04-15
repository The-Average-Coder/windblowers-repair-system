function ActionButton(props) {
    return (
        <div className={'action-button ' + props.className}>

            <button onClick={props.onClick}>{props.contents}</button>

        </div>
    );
}

export default ActionButton;