import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus, faHouse, faTasks, faUsers, faGear, faList, faCalendar, faCircleCheck } from '@fortawesome/free-solid-svg-icons';

import Header from './header/Header';
import Navbar from './navbar/Navbar';
import Main from './main/Main';

library.add(faPlus, faHouse, faTasks, faUsers, faGear, faList, faCalendar, faCircleCheck);

function App() {
  return (
  <div className='app dark-theme'>
    <Header />
    <div className='body'>
      <Navbar />
      <Main />
    </div>
  </div>
  );
}

export default App;
