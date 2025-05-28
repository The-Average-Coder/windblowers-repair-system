import './PageTitle.css';

function PageTitle(props) {

    return (
        <div className={`PageTitle ${props.className}`}>
            <p>{props.children}</p>
        </div>
    );
}

export default PageTitle;