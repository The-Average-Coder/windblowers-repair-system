import './ContentBlock.css';

function ContentBlock(props) {
    return (
        <div className={`ContentBlock ${props.className}`} ref={props.ref}>

            {props.children}

        </div>
    );
}

export default ContentBlock