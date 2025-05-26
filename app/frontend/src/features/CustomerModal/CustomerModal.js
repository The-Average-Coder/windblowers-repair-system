import { useState } from 'react';

import ModalWindow from '../../components/Containers/ModalWindow';
import ModalTitle from '../../components/Text/ModalTitle';
import BlockTitle from '../../components/Text/BlockTitle';
import BlockText from '../../components/Text/BlockText';
import TextInput from '../../components/Inputs/TextInput';
import TextAreaInput from '../../components/Inputs/TextAreaInput';
import ActionButton from '../../components/Buttons/ActionButton';
import BlockTopRightButton from '../../components/Buttons/BlockTopRightButton';

import './CustomerModal.css';

import editLight from '../../images/edit-icon/editLight.png';
import editHoverLight from '../../images/edit-icon/editHoverLight.png';
import editDark from '../../images/edit-icon/editDark.png';
import editHoverDark from '../../images/edit-icon/editHoverDark.png';

import mailLight from '../../images/mail-icon/mailLight.png';
import phoneLight from '../../images/phone-icon/phoneLight.png';
import houseLight from '../../images/house-icon/houseLight.png';

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

    const updateFirstname = (value) => {
        setTempCustomer({...tempCustomer, firstname: value})
    }

    const updateSurname = (value) => {
        setTempCustomer({...tempCustomer, surname: value})
    }

    const updateEmail = (value) => {
        setTempCustomer({...tempCustomer, email: value})
    }

    const updatePhone = (value) => {
        setTempCustomer({...tempCustomer, phone: value})
    }

    const updateAddress = (value) => {
        setTempCustomer({...tempCustomer, address: value})
    }

    return (
        <ModalWindow className='CustomerModal' closeFunction={props.closeFunction}>

            {
            editMode ?
            <div className='name-edit'>
            <BlockTitle>Name</BlockTitle>
            <TextInput value={tempCustomer.firstname} onChange={updateFirstname} placeholder='Firstname' />
            <TextInput value={tempCustomer.surname} onChange={updateSurname} placeholder='Surname' />
            </div>
            :
            <ModalTitle>{props.customer.firstname} {props.customer.surname}</ModalTitle>
            }

            <div className='basic-info'>
                <span>
                    <BlockTitle>Contact Information</BlockTitle>
                    {
                    editMode ?
                    <div className='text-inputs'>
                    <TextInput icon={mailLight} value={tempCustomer.email} onChange={updateEmail} placeholder='Email' />
                    <TextInput icon={phoneLight} value={tempCustomer.phone} onChange={updatePhone} placeholder='Phone Number' />
                    </div>
                    :
                    <>
                    <BlockText className='detail'>{props.customer.email}</BlockText>
                    <BlockText className='detail'>{props.customer.phone}</BlockText>
                    </>
                    }
                </span>

                <div className='divider' />

                <span>
                    <BlockTitle>Address</BlockTitle>
                    {
                    editMode ?
                    <div className='text-inputs'>
                    <TextAreaInput icon={houseLight} value={tempCustomer.address} onChange={updateAddress} placeholder='Email' />
                    </div>
                    :
                    <BlockText className='detail'>{props.customer.address}</BlockText>
                    }
                </span>

                {
                editMode ?
                <div className='buttons'>
                    <ActionButton onClick={toggleEditMode}>Cancel</ActionButton>
                    <ActionButton onClick={saveEdit} colored='true'>Save</ActionButton>
                </div>
                :
                null
                }

            </div>            

            <div className='repair-history'>
                <BlockTitle>Repair History</BlockTitle>
                <BlockText>No Repair History</BlockText>
            </div>

            {
            editMode ? null :
            <BlockTopRightButton className='edit-button' onClick={toggleEditMode} light={editLight} lightHover={editHoverLight} dark={editDark} darkHover={editHoverDark} />
            }

        </ModalWindow>
    );
}

export default CustomerModal;