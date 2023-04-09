import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import "./Home.css";
import Card from "../layout/Card";
import { initialState } from "../../contexts/EthContext/state";
import ModalVisit from "../layout/modalVisite";
import ModalOffer from "../layout/modalOffer";

function Home() {
  const [succeed, setSucceed] = useState(false);
  const [articles, setArticles] = useState([]);
  const [formData, setFormData] = useState({});
  const [isRegistered, setIsRegistered] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalOffer, setModalOffer] = useState(false);
  const [comment, setComment] = useState("hello");
  const [date, setDate] = useState("23/12");
  const [index, setIndex] = useState(false);
  const [price, setPrice] = useState(0);
  const eth = useEth();
  //get all the annonce

  const getAllArticles = async () => {
    const allArticles = await eth.state.userArticles.methods
      .getAllArticles()
      .call({
        from: eth.state.accounts[0],
      });

    console.log("ARTICLES", allArticles);
    setArticles(allArticles);
  };

  // propose an offer

  async function addBuyerRequest(articleIndex, date, comment) {
    // Add the request to the articleRequests mapping
    const tx = await eth.state.userArticles.methods
      .addBuyerRequest(articleIndex, date, comment)
      .send({ from: eth.state.accounts[0] });
    console.log("Transaction hash:", tx);
  }

  async function makeAnOffer() {
    const result = await eth.state.userArticles.methods
      .makeOffer(0, "23/12", 20000)
      .send({
        from: eth.state.accounts[0],
      });

    console.log("resultOffer", result);
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

  const registerUser = async () => {
    try {
      if (
        await eth.state.registerUser.methods
          .registerUser(formData.name, formData.email, 658784554, "agency")
          .call({ from: eth.state.accounts[0] })
      ) {
        let proposal = await eth.state.registerUser.methods
          .registerUser(formData.name, formData.email, 658784554, "agency")
          .send({ from: eth.state.accounts[0] });
        console.log("proposal", proposal);
        setSucceed(true);
      }
    } catch (error) {
      console.log(error);

      if (error.message.includes("User already registered")) {
        alert("You are already registered.");
      } else {
        alert(
          error.message.split(
            "VM Exception while processing transaction: revert"
          )[1]
        );
      }
    }
  };
  const handleregister = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };
  useEffect(() => {
    getAllArticles();
    checkIfUserRegistered();
  }, [eth]);

  useEffect(() => {
    getAllArticles();
  }, [isRegistered]);

  useEffect(() => {
    console.log("article", date);
  }, [articles, index, date]);

  const renderArticles = () => {
    return articles.map((item, key) => {
      return (
        <div>
          {!item.reserved && (
            <Card
              title={item.title}
              body={item.price + "€"}
              city={item.city}
              country={item.country}
              image="https://placehold.it/200x200"
              action={() => setModal(true)}
              name={"Visiter"}
              actionOffer={() => {
                setModalOffer(true);
              }}
            />
          )}
        </div>
      );
    });
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Bienvenue sur MightImo</h1>

      {!isRegistered && (
        <div className="form">
          <h3>Inscription</h3>
          <label
            style={{
              color: "purple",
              marginBottom: "0.5rem",
              display: "block",
            }}>
            Name:
          </label>
          <input
            type="text"
            name="name"
            onChange={handleregister}
            style={{
              padding: "0.5rem",
              borderRadius: "15px",
              borderWidth: 1,
              borderColor: "purple",
              marginBottom: "1rem",
            }}
          />

          <label
            style={{
              color: "purple",
              marginBottom: "0.5rem",
              display: "block",
            }}>
            Email:
          </label>
          <input
            type="email"
            name="email"
            onChange={handleregister}
            style={{
              padding: "0.5rem",
              borderRadius: "15px",
              borderWidth: 1,
              borderColor: "purple",
              marginBottom: "1rem",
            }}
          />

          <label
            style={{
              color: "purple",
              marginBottom: "0.5rem",
              display: "block",
            }}>
            Phone number:
          </label>
          <input
            type="tel"
            name="tel"
            onChange={handleregister}
            style={{
              padding: "0.5rem",
              borderRadius: "15px",
              borderWidth: 1,
              borderColor: "purple",
              marginBottom: "1rem",
            }}
          />

          <label
            style={{
              color: "purple",
              marginBottom: "0.5rem",
              display: "block",
            }}>
            Role:
          </label>
          <select
            onChange={handleregister}
            name="profile"
            style={{
              padding: "0.5rem",
              borderRadius: "15px",
              borderWidth: 1,
              borderColor: "purple",
              marginBottom: "1rem",
            }}>
            <option value="">-- Select --</option>
            <option value="agency">Agency</option>
            <option value="buyer">Buyer</option>
          </select>
          <button
            onClick={registerUser}
            style={{
              backgroundColor: "#8C69D8",
              color: "white",
              border: "none",
              borderRadius: "5px",
              padding: "10px",
              cursor: "pointer",
            }}>
            s'inscrire
          </button>
        </div>
      )}

      <h2 style={{ marginTop: "10%" }}>Nos offres</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "5%",
        }}>
        {renderArticles()}
      </div>
      <ModalVisit
        showModal={modal}
        onClose={() => setModal(false)}
        setComment={setComment}
        setDate={setDate}
        handleSubmit={() => {
          addBuyerRequest(index, "23/12", comment);
        }}
      />
      <ModalOffer
        showModal={modalOffer}
        onClose={() => setModalOffer(false)}
        handleSubmit={() => makeAnOffer()}
        setPrice={setPrice}
      />
    </div>
  );
}
export default Home;
