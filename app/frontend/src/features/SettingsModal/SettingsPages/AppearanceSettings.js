import { useEffect, useState } from 'react';

import BlockTitle from '../../../components/Text/BlockTitle';
import BlockText from '../../../components/Text/BlockText';
import ToggleSwitch from '../../../components/Inputs/ToggleSwitch';

import './AppearanceSettings.css';

function AppearanceSettings() {

    const [darkTheme, setDarkTheme] = useState(false);

    const setDarkMode = (darkMode) => {
        if (darkMode) {
            document.body.className = 'dark-theme'
            document.cookie = "theme=dark-theme; path=/; max-age=" + 60 * 60 * 24 * 365;
            setDarkTheme(true);
        }
        else {
            document.body.className = 'light-theme'
            document.cookie = "theme=light-theme; path=/; max-age=" + 60 * 60 * 24 * 365;
            setDarkTheme(false);
        }
    }

    useEffect(() => {
        const match = document.cookie.match(/(^| )theme=([^;]+)/);
        const theme = match ? match[2] : "light-theme";
        setDarkTheme(theme === "dark-theme");
    }, [])

    return (
        <div className='AppearanceSettings'>
            <BlockTitle>Appearance</BlockTitle>
            <BlockText>Customise site appearance.</BlockText>

            <div className='dark-mode'>
                <BlockText>Dark mode</BlockText>
                <div>
                    <ToggleSwitch value={darkTheme} onChange={setDarkMode} />
                </div>
            </div>
        </div>
    );
}

export default AppearanceSettings