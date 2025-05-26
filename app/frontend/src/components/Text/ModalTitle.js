import './ModalTitle.css';

function ModalTitle(props) {
    return (
        <p className='ModalTitle'>{props.children}</p>
    );
}

export default ModalTitle;