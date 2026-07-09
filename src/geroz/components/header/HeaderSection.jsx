import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from "react";
import GoodWorkWordmark from '../../../components/ui/GoodWorkWordmark.jsx';

const HeaderSection = ({
  style,
  whiteLogo,
  hideNavigations,
  homeStyle,
}) => {
  const headerRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        if (window.scrollY > 20) {
          headerRef.current.classList.add("sticky");
          setIsSticky(true);
        } else {
          headerRef.current.classList.remove("sticky");
          setIsSticky(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header>
      <div
        id="header-sticky"
        className={`header-1 ${style ? style : ""} ${isSticky ? "sticky" : ""}`}
        ref={headerRef}
      >
        <div className="container-fluid">
          <div className="mega-menu-wrapper">
            <div className="header-main ">
              <div className="header-left">
                <div className="logo">
                  <Link href="/" className="header-logo">
                    <GoodWorkWordmark
                      animated
                      surface={whiteLogo ? 'dark' : 'light'}
                      className="geroz-header__logo"
                    />
                  </Link>
                </div>
              </div>
              <div className="header-right">
                <div
                  className={`mean__menu-wrapper ${
                    hideNavigations ? "d-none" : "d-none d-xl-block"
                  }`}
                >
                  <div className="main-menu">
                    <nav id="mobile-menu">
                      <ul>
                        <li className="has-dropdown active menu-thumb">
                          <a href="#">Home</a>
                          <ul className="submenu">
                            <li>
                              <Link href="/">Freelancer</Link>
                            </li>
                            <li>
                              <Link href="/home-2">Photographer</Link>
                            </li>
                            <li>
                              <Link href="/home-3">Portfolio</Link>
                            </li>
                            <li>
                              <Link href="/home-4">Lawyer</Link>
                            </li>
                            <li>
                              <Link href="/home-5">Content Writer</Link>
                            </li>
                            <li>
                              <Link href="/home-6">Designer</Link>
                            </li>
                          </ul>
                        </li>
                        <li>
                          <a href="#">About</a>
                          <ul className="submenu">
                            <li>
                              <Link href="/about">About Default</Link>
                            </li>
                            <li>
                              <Link href="/about-2">About Photographer</Link>
                            </li>
                          </ul>
                        </li>
                        <li>
                          <a href="#">Pages</a>
                          <ul className="submenu">
                            <li>
                              <Link href="/service">Service Grid</Link>
                            </li>
                            <li>
                              <Link href="/service/ui-design-development">
                                Service Details
                              </Link>
                            </li>
                            <li>
                              <Link href="/pricing">Pricing</Link>
                            </li>
                          </ul>
                        </li>
                        <li className="has-dropdown">
                          <a href="#">Project</a>
                          <ul className="submenu">
                            <li>
                              <Link href="/project">Project Grid</Link>
                            </li>
                            <li>
                              <Link href="/project/bright-path-project">
                                Project Details
                              </Link>
                            </li>
                          </ul>
                        </li>
                        <li>
                          <a href="#">Blog</a>
                          <ul className="submenu">
                            <li>
                              <Link href="/blog">Blog Grid</Link>
                            </li>
                            <li>
                              <Link href="/blog-2">Blog & News</Link>
                            </li>
                            <li>
                              <Link href="/blog/andrew-wolfenstein-partner">
                                Blog Details
                              </Link>
                            </li>
                          </ul>
                        </li>
                        <li>
                          <Link href="/contact">Contact</Link>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
                {style === "style-2" && (
                  <Link
                    href="/project"
                    className="photo-theme-btn  d-md-block d-none"
                  >
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>My Portfolio
                  </Link>
                )}
                {style === "style-3" && (
                  <Link
                    href="/contact"
                    className="theme-btn white-btn d-none d-xl-inline-block me-4"
                  >
                    Free Consultation
                  </Link>
                )}
                {style === "style-4" && (
                  <Link
                    href="/contact"
                    className={`theme-btn ${
                      homeStyle === "lawyer" ? "lawyer-btn" : ""
                    } me-4 d-md-block d-none`}
                  >
                    {homeStyle === "lawyer"
                      ? "Free Consultation"
                      : "Hire Me For Your Projects"}
                  </Link>
                )}
              </div>
              {style === "style-5" && (
                <div className="d-none d-xl-block">
                  <div className="infu d-flex align-items-center">
                    <div className="social-icon">
                      <a href="#">
                        <i className="fab fa-facebook-f"></i>
                      </a>
                      <a href="#">
                        <i className="fab fa-twitter"></i>
                      </a>
                      <a href="#">
                        <i className="fal fa-basketball-ball"></i>
                      </a>
                      <a href="#">
                        <i className="fab fa-instagram"></i>
                      </a>
                    </div>
                    <Link
                      href="/contact"
                      className="d-flex align-items-center contact-btn"
                    >
                      Contact Me{" "}
                      <div className="icon">
                        <i className="far fa-long-arrow-right"></i>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderSection;
