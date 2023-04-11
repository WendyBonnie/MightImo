const RegisterUser = artifacts.require("RegisterUser");
const Articles = artifacts.require("UserArticles");

module.exports = async function (deployer) {
  await deployer.deploy(RegisterUser);
  const registerInstance = await RegisterUser.deployed();

  await deployer.deploy(Articles, registerInstance.address);
  const ArticlesInstance = await Articles.deployed();

  console.log("test", registerInstance.address);
};
