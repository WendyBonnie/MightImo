import React from "react";

const Card = ({
  title,
  body,
  image,
  action,
  city,
  country,
  name,
  reserved,
  visit,
  request,
  actionOffer,
}) => {
  const renderRequest = () => {
    if (request == null) {
      return null;
    } else {
      return request.map((item, key) => {
        return (
          <div key={key}>
            <p>
              {item.buyer}-{item.date}
            </p>
          </div>
        );
      });
    }
  };

  return (
    <div
      className="card"
      style={{
        backgroundColor: "purple",
        color: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
        maxWidth: "400px",
        margin: "auto",
      }}>
      <img
        src={image}
        alt={title}
        style={{ width: "100%", borderRadius: "10px" }}
      />
      <h2 style={{ margin: "10px 0" }}>{title}</h2>
      <h4>
        {city}-{country}
      </h4>
      <p style={{ fontSize: "1.1em" }}>{body}</p>
      {visit ? renderRequest() : null}
      <p>{reserved ? "offre acceptée" : "offre en cours"}</p>
      <button
        onClick={action}
        style={{
          backgroundColor: "#8C69D8",
          color: "white",
          border: "none",
          borderRadius: "5px",
          padding: "10px",
          cursor: "pointer",
        }}>
        {name}
      </button>
      <button
        onClick={actionOffer}
        style={{
          backgroundColor: "#8C69D8",
          color: "white",
          border: "none",
          borderRadius: "5px",
          padding: "10px",
          cursor: "pointer",
        }}>
        Faire une offre
      </button>
    </div>
  );
};

export default Card;
