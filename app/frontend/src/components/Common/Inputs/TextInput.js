import './TextInput.css';

function TextInput(props) {
    return (
        <input type='text' value={props.value} onChange={(e) => props.onChange(e.target.value)} className={`TextInput ${props.className}`} placeholder={props.placeholder} style={props.icon ? {backgroundImage: `url(${props.icon})`, paddingLeft: '32px'} : null} />
    );
}

export default TextInput;