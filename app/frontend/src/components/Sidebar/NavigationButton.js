import './NavigationButton.css';

function NavigationButton(props) {
    return (<>
        <button className={`NavigationButton light ${props.className}`} onClick={props.onClick} style={props.lightIcon ? {backgroundImage: `url(${props.lightIcon})`, paddingLeft: '32px'} : null}>{props.children}</button>
        <button className={`NavigationButton dark ${props.className}`} onClick={props.onClick} style={props.darkIcon ? {backgroundImage: `url(${props.darkIcon})`, paddingLeft: '32px'} : null}>{props.children}</button>
    </>);
}

export default NavigationButton;