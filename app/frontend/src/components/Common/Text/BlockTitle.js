import './BlockTitle.css';

function BlockTitle(props) {
    return (
        <p className='BlockTitle'>{props.children}</p>
    );
}

export default BlockTitle;