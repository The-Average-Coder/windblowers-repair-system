import BlockTitle from '../../../Common/Text/BlockTitle';
import BlockText from '../../../Common/Text/BlockText';
import AcionButton from '../../../Common/Buttons/ActionButton';
import BlockTopRightButton from '../../../Common/Buttons/BlockTopRightButton';

import './Assessment.css';

import editLight from '../../../../images/edit-icon/editLight.png';
import editHoverLight from '../../../../images/edit-icon/editHoverLight.png';
import editDark from '../../../../images/edit-icon/editDark.png';
import editHoverDark from '../../../../images/edit-icon/editHoverDark.png';
import Notes from '../Notes';

function Assessment(props) {

    const updateNotes = (value) => {
        props.updateAssessment({...props.assessment, notes: value})
    }

    return (
        <div className='Assessment'>
            <div className='cost-estimate'>
                <BlockTitle>Cost Estimate</BlockTitle>
                <BlockText>As of 05/03/2025</BlockText>
                <div className='costs'>
                    <div className='cost-item'>
                        <BlockText className='title'>Repairer Time</BlockText>
                        <BlockText className='value'>5 Hours 30 Minutes</BlockText>
                        <BlockText className='cost'>£250</BlockText>
                    </div>
                    <div className='cost-item'>
                        <BlockText className='title'>Materials</BlockText>
                        <BlockText className='value'>Pads x5</BlockText>
                        <BlockText className='cost'>£15</BlockText>
                    </div>
                    <div className='cost-item'>
                        <BlockText className='title'></BlockText>
                        <BlockText className='value'>Different Pads x3</BlockText>
                        <BlockText className='cost'>£9</BlockText>
                    </div>
                    <div className='cost-item'>
                        <BlockText className='title total'>Total</BlockText>
                        <BlockText className='value'></BlockText>
                        <BlockText className='cost total'>£274</BlockText>
                    </div>
                </div>

                <div className='estimate-invoice-message'>
                    <p>Generate an invoice of the estimate</p>
                    <AcionButton colored='true'>Download</AcionButton>
                </div>

                <BlockTopRightButton light={editLight} lightHover={editHoverLight} dark={editDark} darkHover={editHoverDark} />
            </div>

            <div className='divider' />

            <Notes title='Assessment Notes' notes={props.assessment.notes} updateNotes={updateNotes} />

        </div>
    );
}

export default Assessment;