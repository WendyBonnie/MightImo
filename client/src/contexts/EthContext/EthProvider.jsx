import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";
import UserArticlesJSON from "../../contracts/UserArticles.json";
import BuyerRequestAndOfferJSON from "../../contracts/BuyerRequestAndOffer.json";
import RegisterUserJSON from "../../contracts/RegisterUser.json";

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(async () => {
    const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
    const accounts = await web3.eth.requestAccounts();
    const networkID = await web3.eth.net.getId();

    const loadContract = async (artifact) => {
      const { abi } = artifact;
      let address, contract;
      try {
        address = artifact.networks[networkID].address;
        contract = new web3.eth.Contract(abi, address);
      } catch (err) {
        console.error(err);
      }
      return contract;
    };

    const userArticles = await loadContract(UserArticlesJSON);
    const registerUser = await loadContract(RegisterUserJSON);
    const buyerRequestAndOffer = await loadContract(BuyerRequestAndOfferJSON);

    dispatch({
      type: actions.init,
      data: {
        web3,
        accounts,
        networkID,
        userArticles,
        registerUser,
        buyerRequestAndOffer,
      },
    });
  }, []);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {}, [state.contract]);

  useEffect(() => {
    if (
      state.userArticles &&
      state.registerUser &&
      state.buyerRequestAndOffer
    ) {
      console.log("UserArticles:", state.userArticles);
      console.log("RegisterUser:", state.registerUser);
      console.log("BuyerRequestAndOffer:", state.buyerRequestAndOffer);
    }
  }, [state.userArticles, state.registerUser, state.buyerRequestAndOffer]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      init(state.artifact);
    };

    events.forEach((e) => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach((e) => window.ethereum.removeListener(e, handleChange));
    };
  }, [init, state.artifact]);

  return (
    <EthContext.Provider
      value={{
        state,
        dispatch,
      }}>
      {children}
      {console.log("stattttttte", state)}
    </EthContext.Provider>
  );
}

export default EthProvider;
