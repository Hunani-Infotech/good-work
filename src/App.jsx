import { Routes, Route } from 'react-router-dom';
import SiteLoader from './components/ui/SiteLoader';
import AgencyHomePage from './pages/AgencyHomePage';
import HomePage from './pages/HomePage';
// import WorkPage from './pages/WorkPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <>
      <SiteLoader />
      <Routes>
      <Route path="/" element={<AgencyHomePage />} />
      <Route path="/cv/sanjay" element={<HomePage />} />
      {/* <Route path="/work" element={<WorkPage />} /> */}
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
