const utils = {
  getOwner: async (contract, accounts) => {
    try {
      if (await contract.methods.owner().call({ from: accounts[0] })) {
        // let start = await contract.methods.startProposalsRegistering().send({ from: accounts[0] });
        let status = await contract.methods.owner().call({ from: accounts[0] });
        return status;
      }
    } catch (error) {
      console.log(error);
    }
  },
};

export default utils;
