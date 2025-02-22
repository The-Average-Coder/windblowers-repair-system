import './ContentBlock.css';

function ContentBlock(props) {
    return (
        <div className={`ContentBlock ${props.className}`}>

            {props.children}

        </div>
    );
}

export default ContentBlock