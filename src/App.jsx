import { Routes, Route, Navigate } from 'react-router-dom';
import SiteLoader from './components/ui/SiteLoader';
import { useSiteLoader } from './hooks/useSiteLoader';
import AgencyHomePage from './pages/AgencyHomePage';
import TidalCopperCvPage from './pages/TidalCopperCvPage';
import IsakCvPage from './pages/IsakCvPage';
import IsakLightCvPage from './pages/IsakLightCvPage';
import ShoooteCvPage from './pages/ShoooteCvPage';
import GerozCvPage from './pages/GerozCvPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import {
  GEROZ_CV_PATH,
  ISAK_CV_PATH,
  SHOOOTE_CV_PATH,
  TIDAL_COPPER_CV_PATH,
} from './data/cvTemplatePaths.js';

export default function App() {
  useSiteLoader();

  return (
    <>
      <SiteLoader />
      <Routes>
        <Route path="/" element={<AgencyHomePage />} />
        <Route path={TIDAL_COPPER_CV_PATH} element={<TidalCopperCvPage />} />
        <Route path="/cv/sanjay" element={<Navigate to={TIDAL_COPPER_CV_PATH} replace />} />
        <Route path={ISAK_CV_PATH} element={<IsakCvPage />} />
        <Route path="/cv/isak-light" element={<IsakLightCvPage />} />
        <Route path={`${ISAK_CV_PATH}/*`} element={<Navigate to={ISAK_CV_PATH} replace />} />
        <Route path={SHOOOTE_CV_PATH} element={<ShoooteCvPage />} />
        <Route path={`${SHOOOTE_CV_PATH}/*`} element={<Navigate to={SHOOOTE_CV_PATH} replace />} />
        <Route path={GEROZ_CV_PATH} element={<GerozCvPage />} />
        <Route path={`${GEROZ_CV_PATH}/*`} element={<Navigate to={GEROZ_CV_PATH} replace />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
