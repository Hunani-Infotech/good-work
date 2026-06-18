import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import WorkPage from './pages/WorkPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/work" element={<WorkPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/*" element={<NotFoundPage />} />
    </Routes>
  );
}
