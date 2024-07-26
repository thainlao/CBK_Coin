import friendIcon from './assets/icons8-friends-50.png';
import taskIcon from './assets/icons8-tasks-24.png';
import homeIcon from './assets/icons8-home-24.png';
import { useState } from "react";
import Base from "./components/Base";
import Tasks from "./components/Tasks";
import Mates from "./components/Mates";
import './styles/mainbody.css';
import useTelegramAuth from './hoocs/useTelegramAuth';
import ErrorComponents from './pages/ErrorComponents';
import LoadingPage from './pages/LoadingPage';

function App() {
  const [activeComponent, setActiveComponent] = useState('Base');
  const { userData, loading, error, canCollect, nextAvailableTime, checkCollectionStatus } = useTelegramAuth();

  const handleButtonClick = (component: any) => {
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    setActiveComponent(component);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'Base':
        return <Base userData={userData} canCollect={canCollect} nextAvailableTime={nextAvailableTime} checkCollectionStatus={checkCollectionStatus} activeComponent={activeComponent} />;
      case 'Tasks':
        return <Tasks userData={userData} activeComponent={activeComponent} />;
      case 'Mates':
        return <Mates userData={userData} activeComponent={activeComponent} />;
      default:
        return <Base userData={userData} canCollect={canCollect} nextAvailableTime={nextAvailableTime} checkCollectionStatus={checkCollectionStatus} activeComponent={activeComponent} />;
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return <ErrorComponents error={error} />;
  }

  return (
    <div className='mainpage'>
      <div className='content-container'>
        {renderComponent()}
      </div>
      <section className='buttons'>
        <button
          className={activeComponent === 'Base' ? 'active' : ''}
          onClick={() => handleButtonClick('Base')}>
          Base
          <img
            className={activeComponent === 'Base' ? 'active' : ''}
            src={homeIcon}
            alt="Home Icon" />
        </button>

        <button
          className={activeComponent === 'Tasks' ? 'active' : ''}
          onClick={() => handleButtonClick('Tasks')}
        >
          Tasks
          <img
            className={activeComponent === 'Tasks' ? 'active' : ''}
            src={taskIcon}
            alt="Tasks Icon" />
        </button>

        <button
          className={activeComponent === 'Mates' ? 'active' : ''}
          onClick={() => handleButtonClick('Mates')}
        >
          Mates
          <img
            className={activeComponent === 'Mates' ? 'active' : ''}
            src={friendIcon}
            alt="Friends Icon" />
        </button>
      </section>
      <h6
        style={{ color: 'white', fontSize: '1rem', fontWeight: '100' }}
      >DEV VERISON 11.07.2024 (TASKS) (11)</h6>
    </div>
  );
}

export default App;
