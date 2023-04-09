import React, { useState } from "react";
import "./style.css";

const Modal = ({
  showModal,
  onClose,
  setLink,
  setTitle,
  setCity,
  setCountry,
  setPrice,
  handleSubmit,
}) => {
  return (
    <>
      {showModal && (
        <div className="modal-container">
          <div className="modal">
            <form className="formModal" onSubmit={handleSubmit}>
              <h2 className="titleCreate">Creez votre annonce</h2>
              <label>
                Link:
                <input
                  className="InputModal"
                  type="text"
                  onChange={(e) => setLink(e.target.value)}
                />
              </label>
              <label>
                Title:
                <input
                  className="InputModal"
                  type="text"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>
              <label>
                City:
                <input
                  className="InputModal"
                  type="text"
                  onChange={(e) => setCity(e.target.value)}
                />
              </label>
              <label>
                Country:
                <input
                  className="InputModal"
                  type="text"
                  onChange={(e) => setCountry(e.target.value)}
                />
              </label>
              <label>
                Price:
                <input
                  className="InputModal"
                  type="number"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </label>
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
                  Publier
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

export default Modal;
