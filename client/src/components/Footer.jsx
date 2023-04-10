function Link({ uri, text }) {
  return (
    <a href={uri} target="_blank" rel="noreferrer">
      {text}
    </a>
  );
}

function Footer() {
  return (
    <footer
      style={{
        position: "fixed",
        bottom: "0px",

        backgroundColor: "#4b0082",
        width: "100%",
        color: "white",
      }}>
      <h2>More resources</h2>
      <Link uri={"https://trufflesuite.com"} text={"Truffle"} />
      <Link uri={"https://reactjs.org"} text={"React"} />
      <Link uri={"https://soliditylang.org"} text={"Solidity"} />
      <Link uri={"https://ethereum.org"} text={"Ethereum"} />
    </footer>
  );
}

export default Footer;
