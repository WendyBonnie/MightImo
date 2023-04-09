import Footer from "../Footer";

import NavBar from "../Layout/Navbar";

import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Switch,
} from "react-router-dom";
import Home from "../Home/Home";
import Admin from "../Admin/Admin";
import MyArticles from "../Agencies/myArticles";
import MyOffer from "../Agencies/myOffer";
import useEth from "../../contexts/EthContext/useEth";
import utils from "../utils/utils";

function Navigation() {
  const [owner, setOwner] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false);
  const eth = useEth();

  function getOwner() {
    utils
      .getOwner(eth.state.registerUser, eth.state.accounts)
      .then((result, err) => {
        if (err) {
          console.log(err);
        } else {
          setOwner(result);
        }
      });
  }

  const checkIfUserRegistered = async () => {
    // Make a call to the smart contract's isUserRegistered function
    const isUserRegistered = await eth.state.registerUser.methods
      .isUserRegistered(eth.state.accounts[0])
      .call();

    // Update the state with the result
    setIsRegistered(isUserRegistered);
    console.log("isregistered", isUserRegistered);
  };

  useEffect(() => {
    getOwner();
    checkIfUserRegistered();
  }, [eth]);

  useEffect(() => {
    console.log("owner", owner, isRegistered);
  }, [owner, eth]);

  return (
    <Router>
      <NavBar
        owner={owner}
        accounts={eth.state.accounts}
        isRegistered={isRegistered}
      />
      <div>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/admin" exact element={<Admin />} />
          <Route path="/my-articles" exact element={<MyArticles />} />
          <Route path="/my-offers" exact element={<MyOffer />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default Navigation;
