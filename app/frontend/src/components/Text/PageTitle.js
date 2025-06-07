import './PageTitle.css';

function PageTitle(props) {

    return (
        <div className={`PageTitle ${props.static && 'static'} ${props.className}`}>
            {props.children}
        </div>
    );
}

export default PageTitle;