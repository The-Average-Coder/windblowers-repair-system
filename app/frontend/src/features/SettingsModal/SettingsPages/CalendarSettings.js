import BlockTitle from '../../../components/Text/BlockTitle';
import BlockText from '../../../components/Text/BlockText';
import ToggleSwitch from '../../../components/Inputs/ToggleSwitch';

import './CalendarSettings.css';

import axios from 'axios';

function CalendarSettings(props) {

    const toggleDayDetail = (id, value) => {
        const newSettings = [...props.calendarDetailsSettings];
        const updatedSetting = newSettings.find(setting => setting.id === id);
        updatedSetting.day_enabled = value;
        props.updateCalendarDetailsSettings(newSettings);

        axios.put('/api/settings/updateCalendarDetailSetting', updatedSetting)
            .then(response => console.log(response))
            .catch(error => console.log(error));
    }

    const toggleWeekDetail = (id, value) => {
        const newSettings = [...props.calendarDetailsSettings];
        const updatedSetting = newSettings.find(detail => detail.id === id);
        updatedSetting.week_enabled = value;
        props.updateCalendarDetailsSettings(newSettings);
        
        axios.put('/api/settings/updateCalendarDetailSetting', updatedSetting)
            .then(response => console.log(response))
            .catch(error => console.log(error));
    }

    const renderedDetails = <div className='details'>
        <div className='week-view-column'>
            <BlockTitle>Week View</BlockTitle>
            {props.calendarDetailsSettings.map(setting => <div className='detail'>
                <BlockText>{setting.name}</BlockText>
                <div>
                    <ToggleSwitch value={setting.week_enabled} onChange={(value) => toggleWeekDetail(setting.id, value)} />
                </div>
            </div>)}
        </div>

        <div className='divider' />
        
        <div className='day-view-column'>
            <BlockTitle>Day View</BlockTitle>
            {props.calendarDetailsSettings.map(setting => <div className='detail'>
                <BlockText>{setting.name}</BlockText>
                <div>
                    <ToggleSwitch value={setting.day_enabled} onChange={(value) => toggleDayDetail(setting.id, value)} />
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