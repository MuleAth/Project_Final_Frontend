import { useState } from 'react';
import Sidebar from './admin-components/Sidebar';
import Dashboard from './dashboard';
import Users from './Users';
import UserDetail from './UserDetail';
import Events from './Events';
import EventDetail from './EventDetail';
import Equipment from './Equipment';
import Feedback from './Feedback';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedPage, setSelectedPage] = useState('Dashboard');

  const renderPage = () => {
    switch (selectedPage) {
      case 'Users':
        return <Users />;
      case 'UserDetail':
        return <UserDetail />;
      case 'Events':
        return <Events />;
      case 'EventDetail':
        return <EventDetail />;
      case 'Equipment':
        return <Equipment />;
      case 'Feedback':
        return <Feedback />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="flex">
        <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} setSelectedPage={setSelectedPage} />
        <div className="flex-1 p-4">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

export default App;
