function GradientButton(props) {
    return (
        <div className='gradient-button'>

            <button onClick={props.onClick}>{props.contents}</button>

        </div>
    );
}

export default GradientButton;