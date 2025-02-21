import Sidebar from './Sidebar/Sidebar';
import Header from './Header/Header';
import Main from './Main/Main';

import './App.css';

function App() {
  return (
    <div className='App'>
      
      <Header />

      <div className='content'>
      
        <Sidebar />
        <Main />

      </div>

    </div>
  );
}

export default App;
