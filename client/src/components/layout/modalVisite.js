import React, { useState } from "react";
import "./style.css";

const ModalVisit = ({
  showModal,
  onClose,
  setDate,
  setComment,

  handleSubmit,
}) => {
  return (
    <>
      {showModal && (
        <div className="modal-container">
          <div className="modalOffer">
            <form className="formModal" onSubmit={handleSubmit}>
              <h2 className="titleCreate">Proposez une visite</h2>

              <input
                placeholder="commentaire"
                className="InputModal"
                type="text"
                onChange={(e) => setComment(e.target.value)}
              />

              <input
                placeholder="date"
                className="InputModal"
                type="date"
                onChange={(e) => setDate(e.target.value)}
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

export default ModalVisit;
