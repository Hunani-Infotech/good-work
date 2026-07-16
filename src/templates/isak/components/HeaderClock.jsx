import GoodWorkWordmark from '../../../components/ui/GoodWorkWordmark.jsx';
import { GOODWORK_APP_URL } from '../../../utils/brandLogos.js';

export function HeaderClock() {
  return (
    <div className="tf-header-wrap">
      <a href={GOODWORK_APP_URL} className="logo-site d-lg-none isak-md-logo-badge">
        <GoodWorkWordmark animated surface="light" className="isak-header__logo" />
      </a>
      <div className="left">
        <div className="time-local text-body-3">
          <p className="date" />
          <p className="clock" />
        </div>
      </div>
    </div>
  );
}
