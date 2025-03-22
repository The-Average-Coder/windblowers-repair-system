import PageTitle from '../../Common/Text/PageTitle';
import ContentBlock from '../../Common/Containers/ContentBlock';

import './Settings.css';

function Settings() {
    return (
        <div className='Settings'>

            <PageTitle>Settings</PageTitle>

            <ContentBlock>
                Some settings here
                <br />
                Some settings there
                <br />
                Some settings everywhere
            </ContentBlock>

        </div>
    );
}

export default Settings;