import BlockText from '../../../components/Text/BlockText';
import BlockTitle from '../../../components/Text/BlockTitle';

import './SchedulingRepairWidget.css';

function SchedulingRepairWidget(props) {
    return (
        <div className='SchedulingRepairWidget'>

            <BlockTitle>Scheduling Repair</BlockTitle>
            <BlockText>Repair {props.schedulingRepair.id}</BlockText>
            <BlockText>{props.schedulingRepair.instrument.manufacturer} {props.schedulingRepair.instrument.model} {props.schedulingRepair.instrument.type}</BlockText>
            <BlockText>{Math.floor(props.schedulingRepair.assessment.time / 60)} Hrs {props.schedulingRepair.assessment.time % 60} Mins Estimated</BlockText>
            <BlockText>Deadline {props.schedulingRepair.deadline}</BlockText>

            <button className='close-button' onClick={props.removeSchedulingRepair}>X</button>

        </div>
    );
}

export default SchedulingRepairWidget;