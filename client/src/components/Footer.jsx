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
      <h2>MightImo - 2023</h2>
    </footer>
  );
}

export default Footer;
