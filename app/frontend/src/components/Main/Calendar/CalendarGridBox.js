import { useDroppable } from '@dnd-kit/core';

function CalendarGridBox(props) {
    const {setNodeRef} = useDroppable({
        id: props.uniqueId,
    });
    
    return (
        <div className='calendar-grid-box' ref={setNodeRef}>
            {props.children}
        </div>
    );
}

export default CalendarGridBox;