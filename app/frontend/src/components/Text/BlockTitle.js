import './BlockTitle.css';

function BlockTitle(props) {
    return (
        <p className={`BlockTitle ${props.className}`}>{props.children}</p>
    );
}

export default BlockTitle;