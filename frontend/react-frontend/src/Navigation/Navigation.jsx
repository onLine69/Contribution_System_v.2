import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Navigation.css';


function Navigation() {
    const [activeLink, setActiveLink] = useState(window.location.pathname);

    const handleLinkClick = (link) => {
        setActiveLink(link);
    };

    return (
        <div id="nav-container">
            <Link to='/' id="app-title" onClick={() => handleLinkClick('/')}>
                <div id='app-icon'>
                <svg width="65" height="62" viewBox="0 0 65 62" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="Vector">
                        <path d="M0 25.5L20.6304 0.302185V6.18259L5.8804 25.5L20.6303 44.8174L20.6303 50.6978L0 25.5Z" fill="white"/>
                        <path d="M64.9133 36.5L44.283 11.3022V17.1826L59.0329 36.5L44.283 55.8174V61.6978L64.9133 36.5Z" fill="white"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M41.4794 18.5642L43.5742 19.1216C37.5602 20.098 26.6241 24.0817 20.7513 32.82L19.4091 31.1101C19.9342 30.3738 20.477 29.6834 21.0318 29.0368L17.9123 25.203L23.3527 24.3607C25.9354 22.2434 30.4931 20.5462 32.4491 19.9623L34.0547 20.7871C36.5072 19.3953 39.3935 19.2066 40.53 19.2862L41.4794 18.5642Z" fill="white"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M43.4727 19.5886L42.6968 23.158C37.3715 24.9318 28.1419 30.1249 25.3154 38.6347L21.3747 33.6143C26.5138 24.642 37.3739 20.5756 43.4727 19.5886Z" fill="white"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M42.5728 23.7283L42.2462 25.2308C38.4764 27.2859 31.9345 33.3148 31.7439 42.5699C31.7124 44.0995 31.8544 45.7172 32.211 47.4197L26.0434 39.5621C28.3514 30.7848 37.3831 25.4947 42.5728 23.7283Z" fill="white"/>
                    </g>
                </svg>
                </div>
                <div id="app-title-text">
                    <p id="app-title-name">PAYWOLF</p>
                    <p id="app-title-desc">CCS-EC Contribution Collection System</p>
                </div>
            </Link>
            <nav id="vertical-nav">
                <ul>
                    <Link to="/" onClick={() => handleLinkClick('/')} className={"nav-link"}>
                        <div className={`nav-item ${activeLink === '/' ? 'disabled' : ''}`}>
                            <img src="./src/assets/Dashboard.png" alt="Dashboard Icon" />
                            <p>Dashboard</p>
                        </div>
                    </Link>
                    <Link to="/payment-records" onClick={() => handleLinkClick('/payment-records')} className={"nav-link"}>
                        <div className={`nav-item ${activeLink === '/payment-records' ? 'disabled' : ''}`}>
                            <img src="./src/assets/Payment-Records.png" alt="Payment Records Icon" />
                            <p>Payment Records</p>
                        </div>
                    </Link>
                    <Link to="/verify-payments" onClick={() => handleLinkClick('/verify-payments')} className={"nav-link"}>
                        <div className={`nav-item ${activeLink === '/verify-payments' ? 'disabled' : ''}`}>
                            <img src="./src/assets/Verify-Payments.png" alt="Verify Payments Icon" />
                            <p>Verify Payments</p>
                        </div>
                    </Link>
                    <Link to="/transaction-history" onClick={() => handleLinkClick('/transaction-history')} className={"nav-link"}>
                        <div className={`nav-item ${activeLink === '/transaction-history' ? 'disabled' : ''}`}>
                            <img src="./src/assets/Transaction-History.png" alt="Transaction History Icon" />
                            <p>Transaction History</p>
                        </div>
                    </Link>
                    <Link to="/student-records" onClick={() => handleLinkClick('/student-records')} className={"nav-link"}>
                        <div className={`nav-item ${activeLink === '/student-records' ? 'disabled' : ''}`}>
                            <img src="./src/assets/Student-Records.png" alt="Student Records Icon" />
                            <p>Student Records</p>
                        </div>
                    </Link>
                </ul>
            </nav>
            <div id="app-credits">
                <p>&copy; 2024 CCS-EC</p>
                <a href="/logout" title='Logout Session'>Logout</a>
            </div>
        </div>
    );
}

export default Navigation;