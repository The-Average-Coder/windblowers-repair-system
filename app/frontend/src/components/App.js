import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import Header from './header/Header';
import Navbar from './navbar/Navbar';
import Main from './Main';

library.add(faPlus);

function App() {
  return (
  <div className='app'>
    <Header />
    <div className='body'>
      <Navbar />
      <Main />
    </div>
  </div>
  );
}

export default App;
