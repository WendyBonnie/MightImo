import React, { useState } from "react";
import "./style.css";

const ModalOffer = ({
  showModal,
  onClose,
  setPrice,

  handleSubmit,
}) => {
  return (
    <>
      {showModal && (
        <div className="modal-container">
          <div className="modalOffer">
            <form className="formModal" onSubmit={handleSubmit}>
              <h2 className="titleCreate">Faites une offre</h2>

              <input
                className="InputModal"
                type="number"
                onChange={(e) => setPrice(e.target.value)}
              />

              <div className="button-group">
                <button
                  style={{
                    backgroundColor: "#8C69D8",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    padding: "10px",
                    cursor: "pointer",
                  }}
                  type="submit">
                  Envoyer
                </button>
                <button
                  style={{
                    backgroundColor: "#8C69D8",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    padding: "10px",
                    cursor: "pointer",
                  }}
                  onClick={onClose}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalOffer;
