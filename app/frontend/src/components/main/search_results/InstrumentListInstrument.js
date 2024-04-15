import { useNavigate } from 'react-router-dom';

function InstrumentListInstrument(props) {
    const navigate = useNavigate();

    const navigateToInstrument = () => {
        navigate(`/instrument/${props.instrument.id}`)
    }

    return (
        <div className='instrument-list-instrument' onClick={navigateToInstrument}>

            <p className='type'>{props.instrument.type}</p>
            <p className='model'>{props.instrument.manufacturer} {props.instrument.model}</p>
            <p className='serial'>{props.instrument.serial_number}</p>

        </div>
    );
}

export default InstrumentListInstrument;