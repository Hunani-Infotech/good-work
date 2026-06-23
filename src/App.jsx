import { Routes, Route } from 'react-router-dom';
import SiteLoader from './components/ui/SiteLoader';
import { useSiteLoader } from './hooks/useSiteLoader';
import AgencyHomePage from './pages/AgencyHomePage';
import CvPage from './pages/CvPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  useSiteLoader();

  return (
    <>
      <SiteLoader />
      <Routes>
        <Route path="/" element={<AgencyHomePage />} />
        <Route path="/cv/sanjay" element={<CvPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
