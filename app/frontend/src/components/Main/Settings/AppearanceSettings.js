import BlockTitle from '../../Common/Text/BlockTitle';
import BlockText from '../../Common/Text/BlockText';
import ToggleSwitch from '../../Common/Inputs/ToggleSwitch';

import './AppearanceSettings.css';

function AppearanceSettings() {

    const setDarkMode = (darkMode) => {
        if (darkMode) {
            document.body.className = 'dark-theme'
        }
        else {
            document.body.className = 'light-theme'
        }
    }

    return (
        <div className='AppearanceSettings'>
            <BlockTitle>Appearance</BlockTitle>
            <BlockText>Customise site appearance.</BlockText>

            <div className='dark-mode'>
                <BlockText>Dark mode</BlockText>
                <div>
                    <ToggleSwitch onChange={setDarkMode} />
                </div>
            </div>
        </div>
    );
}

export default AppearanceSettings