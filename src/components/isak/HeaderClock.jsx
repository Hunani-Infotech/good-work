import { Link } from 'react-router-dom';
import { ImageSwitch } from './ImageSwitch.jsx';

export function HeaderClock() {
  return (
    <div className="tf-header-wrap">
      <Link to="/" className="logo-site d-lg-none">
        <ImageSwitch
          light="/images/goodwork/symbol-on-light.svg"
          dark="/images/goodwork/symbol-on-dark.svg"
          width={40}
          height={40}
        />
      </Link>
      <div className="left">
        <div className="time-local text-body-3">
          <p className="date" />
          <p className="clock" />
        </div>
      </div>
    </div>
  );
}
