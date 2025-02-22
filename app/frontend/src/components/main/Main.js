import { useState } from 'react';

import ContentBlock from '../Common/Containers/ContentBlock';
import TextInput from '../Common/Inputs/TextInput';
import ActionButton from '../Common/Buttons/ActionButton';
import DropdownSelect from '../Common/Inputs/DropdownSelect';
import PageTitle from '../Common/Containers/PageTitle';
import DatePicker from '../Common/Inputs/DatePicker';
import ToggleSwitch from '../Common/Inputs/ToggleSwitch';
import ModalWindow from '../Common/Containers/ModalWindow';

import './Main.css';

function Main() {
    const [modalOpen, setModalOpen] = useState(false)

    return (
        <div className='Main'>

            <PageTitle>Home Page</PageTitle>
            
            <ContentBlock className='sample-content-block'>
                <p>Some Content</p>
                <TextInput placeholder='Postcode' />
                <DropdownSelect options={[{name: 'Flute', value: 'flute'}]} />
                <DatePicker />
                <div>
                    <ActionButton>Cancel</ActionButton>
                    <ActionButton colored='true' onClick={() => setModalOpen(true)}>Save</ActionButton>
                </div>
                <ToggleSwitch />
            </ContentBlock>

            {modalOpen ?
            <ModalWindow closeFunction={() => setModalOpen(false)}>
                <p>Some Modal Content</p>
            </ModalWindow>
            : null }
            
        </div>
    );
}

export default Main;