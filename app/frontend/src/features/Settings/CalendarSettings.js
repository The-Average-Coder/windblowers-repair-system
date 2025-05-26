import { useState } from 'react';

import BlockTitle from '../../components/Text/BlockTitle';
import BlockText from '../../components/Text/BlockText';
import ToggleSwitch from '../../components/Inputs/ToggleSwitch';

import './CalendarSettings.css';

function CalendarSettings(props) {

    const [details, setDetails] = useState([
        { id: 0, name: 'Instrument', enabled: true },
        { id: 1, name: 'Serial Number', enabled: false },
        { id: 2, name: 'Instrument Status', enabled: false },
        { id: 3, name: 'Customer', enabled: false },
        { id: 4, name: 'Common Job Type', enabled: false }
    ]);

    const toggleDetail = (id, value) => {
        const newDetails = [...details];
        const updatedDetail = newDetails.find(detail => detail.id === id);
        updatedDetail.enabled = value;
        setDetails(newDetails)
    }

    const renderedDetails = <div className='details'>
        {details.map(detail => <div className='detail'>
            <BlockText>{detail.name}</BlockText>
            <div>
                <ToggleSwitch value={detail.enabled} onChange={(value) => toggleDetail(detail.id, value)} />
            </div>
        </div>)}
    </div>

    return (
        <div className='CalendarSettings'>
            <BlockTitle>Calendar</BlockTitle>
            <BlockText>Customise details shown on calendar.</BlockText>

            {renderedDetails}
        </div>
    );
}

export default CalendarSettings;