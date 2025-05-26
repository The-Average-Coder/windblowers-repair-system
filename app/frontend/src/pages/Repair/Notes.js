import { useState } from 'react';

import BlockTitle from '../../components/Text/BlockTitle';
import BlockText from '../../components/Text/BlockText';
import TextAreaInput from '../../components/Inputs/TextAreaInput';
import BlockTopRightButton from '../../components/Buttons/BlockTopRightButton';
import ActionButton from '../../components/Buttons/ActionButton';

import './Notes.css';

import editLight from '../../images/edit-icon/editLight.png';
import editHoverLight from '../../images/edit-icon/editHoverLight.png';
import editDark from '../../images/edit-icon/editDark.png';
import editHoverDark from '../../images/edit-icon/editHoverDark.png';

function Notes(props) {

    const [editMode, setEditMode] = useState(false);
    const [tempNotes, setTempNotes] = useState('');

    const toggleEditMode = () => {
        setTempNotes(props.notes)
        setEditMode(!editMode);
    }

    const saveEdit = () => {
        props.updateNotes(tempNotes);
        toggleEditMode();
    }

    return (
        <div className='Notes'>

            <BlockTitle>{props.title}</BlockTitle>

            {
            editMode ? 
            <>
            <TextAreaInput value={tempNotes} onChange={setTempNotes} />

            <div className='buttons'>
                <ActionButton onClick={toggleEditMode}>Cancel</ActionButton>
                <ActionButton onClick={saveEdit} colored='true'>Save</ActionButton>
            </div>
            </>
            :
            <>
            <BlockText className='notes'>{props.notes}</BlockText>

            <BlockTopRightButton onClick={toggleEditMode} light={editLight} lightHover={editHoverLight} dark={editDark} darkHover={editHoverDark} />
            </>
            }

        </div>
    );
}

export default Notes;