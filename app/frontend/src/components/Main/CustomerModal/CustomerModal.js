import { useState } from 'react';

import ModalWindow from '../../Common/Containers/ModalWindow';
import ModalTitle from '../../Common/Text/ModalTitle';
import BlockTitle from '../../Common/Text/BlockTitle';
import BlockText from '../../Common/Text/BlockText';
import TextInput from '../../Common/Inputs/TextInput';
import BlockTopRightButton from '../../Common/Buttons/BlockTopRightButton';

import './CustomerModal.css';

import editLight from '../../../images/edit-icon/editLight.png';
import editHoverLight from '../../../images/edit-icon/editHoverLight.png';
import editDark from '../../../images/edit-icon/editDark.png';
import editHoverDark from '../../../images/edit-icon/editHoverDark.png';

import mailLight from '../../../images/mail-icon/mailLight.png';

function CustomerModal(props) {

    const [editMode, setEditMode] = useState(false);
    const [tempCustomer, setTempCustomer] = useState({});

    const toggleEditMode = () => {
        setTempCustomer(props.customer)
        setEditMode(!editMode);
    }

    const saveEdit = () => {
        props.updateCustomer(tempCustomer);
        toggleEditMode();
    }

    return (
        <ModalWindow className='CustomerModal' closeFunction={props.closeFunction}>

            <ModalTitle>{props.customer.firstname} {props.customer.surname}</ModalTitle>

            <div className='basic-info'>
                <div>
                    <BlockTitle>Contact Information</BlockTitle>
                    {
                    editMode ?
                    <div className='text-inputs'>
                    <TextInput icon={mailLight} value={props.customer.email} onChange={() => {console.log("Hello")}} placeholder='Email' />
                    <TextInput value={props.customer.phone} onChange={() => {console.log("Hello")}} placeholder='Phone Number' />
                    </div>
                    :
                    <>
                    <BlockText className='detail'>{props.customer.email}</BlockText>
                    <BlockText className='detail'>{props.customer.phone}</BlockText>
                    </>
                    }
                </div>

                <div className='divider' />

                <div>
                    <BlockTitle>Address</BlockTitle>
                    {
                    editMode ?
                    <div className='text-inputs'>
                    <TextInput icon={mailLight} value={props.customer.address} onChange={() => {console.log("Hello")}} placeholder='Email' />
                    </div>
                    :
                    <BlockText className='detail'>{props.customer.postcode}</BlockText>
                    }
                </div>
            </div>

            <div className='repair-history'>
                <BlockTitle>Repair History</BlockTitle>
                <BlockText>No Repair History</BlockText>
            </div>

            <BlockTopRightButton className='edit-button' onClick={toggleEditMode} light={editLight} lightHover={editHoverLight} dark={editDark} darkHover={editHoverDark} />

        </ModalWindow>
    );
}

export default CustomerModal;