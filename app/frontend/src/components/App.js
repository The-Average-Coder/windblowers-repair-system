import { DndContext, useSensor, useSensors, KeyboardSensor, MouseSensor, TouchSensor } from '@dnd-kit/core';

import Sidebar from './Sidebar/Sidebar';
import Header from './Header/Header';
import Main from './Main/Main';

import eventBus from '../utils/eventBus';

import './App.css';

function App() {
  
  // DRAG AND DROP INITIALISATIoN
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 5 }});
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { distance: 5 }});
  const keyboardSensor = useSensor(KeyboardSensor);
  
  const sensors = useSensors(
      mouseSensor,
      touchSensor,
      keyboardSensor,
  );

  // DRAG AND DROP EVENTS
  const emitClickEvent = () => {
    eventBus.emit('click');
  }

  const handleDragStart = (event) => {
    eventBus.emit('handleDragStart', event)
  }

  const handleDragEnd = (event) => {
    eventBus.emit('handleDragEnd', event)
  }

  const handleDragOver = (event) => {
    eventBus.emit('handleDragOver', event)
  }

  return (
    <div className='App' onClick={emitClickEvent}>

      <Header />

      <div className='content'>

        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragOver={handleDragOver}>

          <Sidebar />
          <Main />

        </DndContext>

      </div>

    </div>
  );
}

export default App;
