import Link from 'next/link';
import './NavBar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__container">
        <Link href="/" className="navbar__logo">
          <img
            src="https://i.imgur.com/PRtuR4X.png"
            alt="Green Ray Logo"
            width={120}
            height={60}
            priority
          />
        </Link>
        
        <ul className="navbar__menu">
          <li className="navbar__item">
            <Link href="/" className="navbar__link navbar__link--active">
              Home
            </Link>
          </li>
          <li className="navbar__item">
            <Link href="/contact" className="navbar__link">
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}