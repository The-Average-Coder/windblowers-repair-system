import { useDroppable } from '@dnd-kit/core';

function NavigationCalendarWeek (props) {
    const { setNodeRef } = useDroppable({
      id: props.id,
      data: { disabled: true }
    });

    return (
        <div ref={setNodeRef} className={props.className} onClick={props.onClick}>
            {props.children}
        </div>
    );
}

export default NavigationCalendarWeek;