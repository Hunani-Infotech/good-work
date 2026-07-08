import { ImageSwitch } from './ImageSwitch.jsx';
import { GOODWORK_APP_URL } from '../../utils/brandLogos.js';

export function HeaderClock() {
  return (
    <div className="tf-header-wrap">
      <a href={GOODWORK_APP_URL} className="logo-site d-lg-none">
        <ImageSwitch
          light="/images/goodwork/symbol-on-light.svg"
          dark="/images/goodwork/symbol-on-dark.svg"
          width={40}
          height={40}
        />
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
