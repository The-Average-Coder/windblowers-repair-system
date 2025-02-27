import './BlockText.css';

function BlockText(props) {
    return (
        <p className={`BlockText ${props.className}`} style={props.icon ? {backgroundImage: `url(${props.icon})`, paddingLeft: '20px'} : null}>{props.children}</p>
    );
}

export default BlockText;