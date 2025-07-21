import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

import axios from 'axios';

function CustomerModal(props) {

    const [editMode, setEditMode] = useState(false);
    const [tempCustomer, setTempCustomer] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    const [repairHistory, setRepairHistory] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {

        if (props.customer.id === undefined) return;

        axios.get(`/api/customers/getRepairHistory/${props.customer.id}`)
            .then(response => setRepairHistory(response.data))
            .catch(error => console.log(error));

    }, [])

    const toggleEditMode = () => {
        setTempCustomer(props.customer)
        setEditMode(!editMode);
    }

    const isValidCustomer = () => {
        if (tempCustomer.firstname.trim() === '') {
            setErrorMessage('Firstname required.');
            return false;
        }
        if (tempCustomer.surname.trim() === '') {
            setErrorMessage('Surname required.');
            return false;
        }
        if (tempCustomer.email.trim() === '' && tempCustomer.telephone.trim() === '') {
            setErrorMessage('Contact method required.');
            return false;
        }

        setErrorMessage('');
        return true;
    }

    const saveEdit = () => {

        if (!isValidCustomer()) return;

        props.updateCustomer(tempCustomer);

        axios.put('/api/customers/update', tempCustomer)
            .catch(error => console.log(error));

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
        setTempCustomer({...tempCustomer, telephone: value})
    }

    const updateAddress = (value) => {
        setTempCustomer({...tempCustomer, address: value})
    }

    const navigateToRepair = (id) => {
        navigate(`/repair/${id}`);
        props.closeFunction();
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
                    <TextInput icon={phoneLight} value={tempCustomer.telephone} onChange={updatePhone} placeholder='Phone Number' />
                    </div>
                    :
                    <>
                    <BlockText className='detail'>{props.customer.email}</BlockText>
                    <BlockText className='detail'>{props.customer.telephone}</BlockText>
                    </>
                    }
                </span>

                <div className='divider' />

                <span>
                    <BlockTitle>Address</BlockTitle>
                    {
                    editMode ?
                    <div className='text-inputs'>
                    <TextAreaInput icon={houseLight} value={tempCustomer.address} onChange={updateAddress} placeholder='Address' />
                    </div>
                    :
                    <BlockText className='detail'>{props.customer.address || 'No Address'}</BlockText>
                    }
                </span>

                {
                editMode && <>
                <p className='error-message'>{errorMessage}</p>
                <div className='buttons'>
                    <ActionButton onClick={toggleEditMode}>Cancel</ActionButton>
                    <ActionButton onClick={saveEdit} colored='true'>Save</ActionButton>
                </div>
                </>
                }

            </div>            

            <div className='repair-history'>
                <BlockTitle>Repair History</BlockTitle>
                {repairHistory.length > 0 ? repairHistory.map(repair => 
                <div className='repair' onClick={() => navigateToRepair(repair.id)}>
                    <div className='details-flex-container'>
                        <p className='job-number'>{repair.id}</p>
                        <p className='instrument'>{repair.instrument.manufacturer} {repair.instrument.model} {repair.instrument.type}</p>
                    </div>
                </div>) :
                <BlockText>No Repair History</BlockText>}
            </div>

            {
            editMode ? null :
            <BlockTopRightButton className='edit-button' onClick={toggleEditMode} light={editLight} lightHover={editHoverLight} dark={editDark} darkHover={editHoverDark} />
            }

        </ModalWindow>
    );
}

export default CustomerModal;