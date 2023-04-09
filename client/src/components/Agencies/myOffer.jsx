import React from "react";
import { useEffect, useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import Card from "../layout/Card";

function MyOffer() {
  const [articles, setArticles] = useState([]);
  const [modal, setModal] = useState(false);
  const eth = useEth();

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

  //get offers
  async function getRequestsByAgency() {
    try {
      const response = await eth.state.userArticles.methods
        .getBuyerRequestsFromArticles(0)
        .call({ from: eth.state.accounts[0] });
      return console.log("responseOffer", response);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getRequestsByAgency();
    getArticlesByAgency();
  }, [eth]);

  useEffect(() => {
    console.log("articlesss", articles);
  }, [articles]);

  const renderArticles = () => {
    return articles.map((item) => {
      return (
        <div>
          <Card
            title={item.title}
            body={item.price + "€"}
            image="https://placehold.it/200x200"
            action={() => {
              setModal(true);
            }}
            name={"Voir visites"}
          />
        </div>
      );
    });
  };

  return (
    <div style={{ marginTop: "10%", textAlign: "center" }}>
      <h1>Mes offres en acceptées ou refusées par le smart</h1>
    </div>
  );
}

export default MyOffer;
