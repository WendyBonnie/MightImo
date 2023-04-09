import React from "react";
import { Link } from "react-router-dom";
import utils from "../utils/utils";

import "./style.css";

const NavBar = (props) => {
  const { owner, accounts, isRegistered } = props;

  return (
    <nav className="navbar">
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>
        {accounts?.includes(owner) && (
          <li className="nav-item">
            <Link to="/admin" className="nav-link">
              Admin
            </Link>
          </li>
        )}
        <li className="nav-item">
          <Link to="/contact" className="nav-link">
            Annonces
          </Link>
        </li>{" "}
        <li className="nav-item">
          {isRegistered && (
            <Link to="/my-articles" className="nav-link">
              Mes annonces
            </Link>
          )}
        </li>
        <li className="nav-item">
          {isRegistered && (
            <Link to="/my-offers" className="nav-link">
              Mes visites
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
