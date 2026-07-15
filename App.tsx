import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { DailyTasks } from './pages/DailyTasks';
import { MonthlyPlanner } from './pages/MonthlyPlanner';
import { PlaceholderView } from './pages/PlaceholderView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="daily" element={<DailyTasks />} />
          <Route path="monthly" element={<MonthlyPlanner />} />
          <Route path="settings" element={<PlaceholderView title="Settings" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
