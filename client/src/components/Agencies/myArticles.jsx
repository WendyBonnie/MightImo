import React from "react";
import { useEffect, useState } from "react";

import useEth from "../../contexts/EthContext/useEth";
import Card from "../layout/Card";
import Modal from "../layout/Modal";

function MyArticles() {
  const eth = useEth();
  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [price, setPrice] = useState(0);
  const [articles, setArticles] = useState([]);
  const [modal, setModal] = useState(false);
  const [showVisite, setShowVisite] = useState(false);
  const [getRequest, setGetRequest] = useState([]);
  const [index, setIndex] = useState(0);

  //ajouter une annonce

  async function handleAddArticle() {
    try {
      const result = await eth.state.userArticles.methods
        .addArticle(link, title, city, country, price)
        .send({ from: eth.state.accounts[0] });
      console.log("tx", result);
      alert("Votre article a bien été validé");
      getArticlesByAgency();
    } catch (error) {
      console.error(error);
    }
  }

  //supprimer une annonce
  //modifier une annonce

  const getArticlesByAgency = async (agencyAddress) => {
    try {
      const result = await eth.state.userArticles.methods
        .getArticlesByAgency(eth.state.accounts[0])
        .call({ from: eth.state.accounts[0] });
      setArticles(result);
    } catch (error) {
      console.error(error);
    }
  };

  async function makeOffer(articleIndex, timestamp, price) {
    try {
      await eth.state.userArticles.methods
        .makeOffer(articleIndex, timestamp, price)
        .send({ from: eth.state.accounts[0] });
    } catch (error) {
      console.error(error);
    }
  }

  async function getRequestsByAgency(key) {
    try {
      const response = await eth.state.userArticles.methods
        .getBuyerRequestsFromArticles(key)
        .call({ from: eth.state.accounts[0] });
      setGetRequest(response);
    } catch (error) {
      console.error(error);
    }
  }

  async function addBuyerRequest(articleIndex, date, comment) {
    // Convert article index to bytes32 key
    const articleKey = 0;

    // Add the request to the articleRequests mapping
    const tx = await eth.state.userArticles.methods
      .addBuyerRequest(0, "23/12", "coucou")
      .send({ from: eth.state.accounts[0] });
    console.log("Transaction hash:", tx);
  }

  useEffect(() => {
    getArticlesByAgency();
  }, [eth.state.accounts]);

  useEffect(() => {
    console.log("articlesss", articles, showVisite);
  }, [articles, showVisite]);

  const renderArticles = () => {
    return articles.map((item, key) => {
      return (
        <div>
          <Card
            title={item.title}
            body={item.price + "€"}
            image="https://placehold.it/200x200"
            action={() => {
              setIndex(key), setShowVisite(true), getRequestsByAgency(key);
            }}
            name={"Voir visites"}
            reserved={item.reserved}
            visit={showVisite}
            request={key === index ? getRequest : null}
          />
        </div>
      );
    });
  };
  return (
    <div style={{ textAlign: "center", marginTop: "5%" }}>
      <div
        style={{ marginBottom: "5%", textAlign: "right", marginRight: "20px" }}>
        <button
          onClick={() => {
            setModal(true);
          }}
          style={{
            backgroundColor: "#8C69D8",
            color: "white",
            border: "none",
            borderRadius: "5px",
            padding: "10px",
            cursor: "pointer",
            marginBottom: "5%",
          }}>
          Ajouter une annonce
        </button>
      </div>
      <h1>Mes annonces en ligne</h1>
      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          marginTop: "5%",
        }}>
        {renderArticles()}
      </div>
      <div>
        <Modal
          showModal={modal}
          handleSubmit={handleAddArticle}
          onClose={() => {
            setModal(false);
          }}
          setLink={setLink}
          setTitle={setTitle}
          setPrice={setPrice}
          setCountry={setCountry}
          setCity={setCity}
        />
      </div>
    </div>
  );
}

export default MyArticles;
