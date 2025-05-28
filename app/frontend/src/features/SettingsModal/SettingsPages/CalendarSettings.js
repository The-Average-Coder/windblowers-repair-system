import { useState } from 'react';

import BlockTitle from '../../../components/Text/BlockTitle';
import BlockText from '../../../components/Text/BlockText';
import ToggleSwitch from '../../../components/Inputs/ToggleSwitch';

import './CalendarSettings.css';

function CalendarSettings(props) {

    const [details, setDetails] = useState([
        { id: 0, name: 'Instrument', dayEnabled: true, weekEnabled: true },
        { id: 1, name: 'Serial Number', dayEnabled: false, weekEnabled: false },
        { id: 2, name: 'Instrument Status', dayEnabled: false, weekEnabled: false },
        { id: 3, name: 'Customer', dayEnabled: false, weekEnabled: false },
        { id: 4, name: 'Job Type', dayEnabled: false, weekEnabled: false }
    ]);

    const toggleDayDetail = (id, value) => {
        const newDetails = [...details];
        const updatedDetail = newDetails.find(detail => detail.id === id);
        updatedDetail.dayEnabled = value;
        setDetails(newDetails);
    }

    const toggleWeekDetail = (id, value) => {
        const newDetails = [...details];
        const updatedDetail = newDetails.find(detail => detail.id === id);
        updatedDetail.weekEnabled = value;
        setDetails(newDetails);
    }

    const renderedDetails = <div className='details'>
        <div className='week-view-column'>
            <BlockTitle>Week View</BlockTitle>
            {details.map(detail => <div className='detail'>
                <BlockText>{detail.name}</BlockText>
                <div>
                    <ToggleSwitch value={detail.weekEnabled} onChange={(value) => toggleWeekDetail(detail.id, value)} />
                </div>
            </div>)}
        </div>

        <div className='divider' />
        
        <div className='day-view-column'>
            <BlockTitle>Day View</BlockTitle>
            {details.map(detail => <div className='detail'>
                <BlockText>{detail.name}</BlockText>
                <div>
                    <ToggleSwitch value={detail.dayEnabled} onChange={(value) => toggleDayDetail(detail.id, value)} />
                </div>
            </div>)}
        </div>
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