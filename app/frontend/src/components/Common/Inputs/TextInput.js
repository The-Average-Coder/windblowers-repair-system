import './TextInput.css';

function TextInput(props) {
    return (
        <input type='text' className={`TextInput ${props.className}`} placeholder={props.placeholder} />
    );
}

export default TextInput;