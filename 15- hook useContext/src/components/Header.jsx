import {useState} from "react";
import {useToggle} from "../hooks/useToggle.js";
import {activeClassIf} from "../utils/classnames.js";

export function Header({page}) {

    const [expanded, toggleExpanded] = useToggle(false);

    return <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">Mon site</a>
        <button onClick={toggleExpanded} className="navbar-toggler" type="button"
                aria-controls="navbarSupportedContent" aria-expanded={expanded} aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${expanded ? 'show' : ''}`} id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                    <a className={activeClassIf(page === 'home', 'nav-link')} href="#">Home</a>
                </li>
                <li className="nav-item">
                    <a className={activeClassIf(page === 'contact', 'nav-link')} href="#contact">Contact</a>
                </li>
            </ul>
        </div>
    </nav>
}