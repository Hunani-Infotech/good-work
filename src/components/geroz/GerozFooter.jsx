import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GEROZ_TEMPLATE_IMAGES } from '../../data/geroz/constants.js';

const DEFAULT_LINKS = [
  { label: 'About Me', to: '/about' },
  { label: 'My Works', to: '/project' },
  { label: 'My Services', to: '/service' },
  { label: 'Contact Me', to: '#cta' },
  { label: 'Pricing Plan', to: '/pricing' },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function GerozFooter({
  logoSrc = GEROZ_TEMPLATE_IMAGES.logoWhite,
  newsletterTitle = 'Stay in Touch',
  newsletterHint = 'Get updated information and daily news & tips',
  linksTitle = 'Useful Links',
  links = DEFAULT_LINKS,
  ctaTitle = 'See how we can help you, get in touch today.',
  phone = '+48 000 929 065',
  email = 'hellogeroz@gmail.com',
  copyrightName = 'GoodWork',
}) {
  const [emailValue, setEmailValue] = useState('');
  const [emailError, setEmailError] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e) => {
    e.preventDefault();
    const trimmed = emailValue.trim();

    if (!trimmed) {
      setEmailError('Email is required.');
      return;
    }

    if (!EMAIL_PATTERN.test(trimmed)) {
      setEmailError('Enter a valid email address.');
      return;
    }

    setEmailError('');
    setSubscribed(true);
    setEmailValue('');
  };

  return (
    <footer className="bg-stone-950 pt-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 border-b border-stone-800 pb-16 lg:grid-cols-3">
          <div>
            <h3 className="text-xl font-semibold text-stone-100">{newsletterTitle}</h3>
            <form onSubmit={handleNewsletter} className="mt-6" noValidate>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={emailValue}
                  onChange={(e) => {
                    setEmailValue(e.target.value);
                    if (emailError) setEmailError('');
                    if (subscribed) setSubscribed(false);
                  }}
                  placeholder="Your email"
                  className={`min-w-0 flex-1 rounded-lg border bg-stone-900 px-4 py-3 text-stone-100 placeholder:text-stone-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500${
                    emailError ? ' border-red-500' : ' border-stone-700'
                  }`}
                  aria-invalid={Boolean(emailError)}
                  aria-describedby={emailError ? 'geroz-newsletter-error' : undefined}
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold uppercase tracking-wider text-stone-950 transition-colors hover:bg-amber-400"
                >
                  Join
                </button>
              </div>
              {emailError && (
                <p id="geroz-newsletter-error" className="mt-2 text-sm text-red-400" role="alert">
                  {emailError}
                </p>
              )}
              {subscribed && (
                <p className="mt-2 text-sm text-amber-500" role="status">
                  Thanks for subscribing!
                </p>
              )}
            </form>
            <p className="mt-4 flex items-center gap-2 text-sm text-stone-400">
              <svg className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {newsletterHint}
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-stone-100">{linksTitle}</h4>
            <ul className="mt-6 space-y-3">
              {links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-stone-400 transition-colors hover:text-amber-500"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <img src={logoSrc} alt="GoodWork" width={151} height={60} className="h-12 w-auto" />
            <h3 className="mt-6 text-lg font-semibold leading-snug text-stone-100">{ctaTitle}</h3>
            <div className="mt-6 flex flex-wrap gap-8">
              <div>
                <p className="text-sm text-stone-400">Phone Number</p>
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="mt-1 block font-medium text-stone-100 hover:text-amber-500">
                  {phone}
                </a>
              </div>
              <div>
                <p className="text-sm text-stone-400">Email</p>
                <a href={`mailto:${email}`} className="mt-1 block font-medium text-stone-100 hover:text-amber-500">
                  {email}
                </a>
              </div>
            </div>
          </div>
        </div>

        <p className="py-8 text-center text-sm text-stone-500">
          &copy; {new Date().getFullYear()} {copyrightName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
