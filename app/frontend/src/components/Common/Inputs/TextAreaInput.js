import { useEffect, useRef } from 'react';

import './TextAreaInput.css';

function TextAreaInput(props) {

    useEffect(() => {
        if (!props.disableAutoResize) {
            textarea.current.style.height = "initial";
            textarea.current.style.height = `${textarea.current.scrollHeight + 10}px`;
        }
    }, [props.value]);

    const textarea = useRef(null)

    return (
        <textarea ref={textarea} className={`TextAreaInput ${props.className}`} placeholder={props.placeholder} value={props.value} onChange={(e) => props.onChange(e.target.value)} style={props.icon ? {backgroundImage: `url(${props.icon})`, paddingLeft: '32px'} : null} />
    );
}

export default TextAreaInput;