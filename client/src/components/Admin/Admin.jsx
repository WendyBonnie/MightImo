import React from "react";
import { useEffect, useState } from "react";
import useEth from "../../contexts/EthContext/useEth";

function Admin() {
  const [users, setUsers] = useState([]);
  const [verified, setVerified] = useState(false);
  const [index, setIndex] = useState(0);

  const eth = useEth();

  // valider KYC

  //get allusers

  async function getUsers() {
    const userAddresses = await eth.state.registerUser.methods
      .getAllUsers()
      .call({ from: eth.state.accounts[0] });
    console.log("user", userAddresses);
    setUsers(userAddresses);
  }

  async function validateKYC(user) {
    const result = await eth.state.registerUser.methods
      .validateKYC(user)
      .send({ from: eth.state.accounts[0] });
    console.log("user", result);
    isVerified();
  }

  async function isVerified(address) {
    try {
      const verified = await eth.state.registerUser.methods
        .isKYCVerified(address)
        .call();
      console.log("verif", verified);
      setVerified(verified);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getUsers();
    isVerified();
  }, [eth.state.accounts[0]]);

  useEffect(() => {
    console.log("USER", eth.state.accounts[0]);
  }, [users, verified]);

  return (
    <div style={{ textAlign: "center", marginTop: "5%" }}>
      {users.length < 0 && <p>Vous n'avez pas d'utilisateurs</p>}

      <div>
        {users.length >= 0 &&
          users.map(
            (user) => (
              console.log("testUser", user),
              (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px",

                    backgroundColor: "purple",
                    color: "white",
                    marginBottom: "5px",
                  }}>
                  <p key={user}>{user}</p>
                  <button
                    style={{
                      backgroundColor: "white",
                      color: "purple",
                      border: "2px solid white",
                      borderRadius: "4px",
                      padding: "5px 10px",
                      fontSize: "14px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      validateKYC(user);
                    }}>
                    Valider KYC
                  </button>
                  <button
                    style={{
                      backgroundColor: "white",
                      color: "purple",
                      border: "2px solid white",
                      borderRadius: "4px",
                      padding: "5px 10px",
                      fontSize: "14px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      marginLeft: "10px",
                    }}
                    onClick={() => {
                      isVerified(user);
                    }}>
                    verified or no
                  </button>
                  <p
                    style={{
                      margin: "0",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}>
                    {verified}
                  </p>
                </div>
              )
            )
          )}
      </div>
    </div>
  );
}

export default Admin;
