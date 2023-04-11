// Import the smart contract artifacts
const RegisterUser = artifacts.require("RegisterUser");
const BuyerRequestAndOffer = artifacts.require("BuyerRequestAndOffer");
const GetUserRequest = artifacts.require("GetUserRequest");
const UserArticles = artifacts.require("UserArticles");
const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");

contract("RegisterUser", (accounts) => {
  // Declare variables to store contract instance and article ID
  let registerUser;
  let userArticles;
  let articleId;

  // Before each test, deploy a new instance of the contract
  beforeEach(async () => {
    registerUser = await RegisterUser.new();
  });

  // Test case for registering a user
  it("should register a new user", async () => {
    // Call the registerUser function with test parameters
    await registerUser.registerUser(
      "Alice",
      "alice@example.com",
      123456789,
      "Individual"
    );

    // Check that the user was added to the userAddresses array
    const userAddresses = await registerUser.getAllUsers();
    assert.equal(userAddresses.length, 1);
    assert.equal(userAddresses[0], accounts[0]);

    // Check that the user's KYC status is NotVerified
    const kycStatus = await registerUser.isKYCVerified(accounts[0]);
    assert.equal(kycStatus, false);
  });

  it("should return true if user is registered", async () => {
    const userAddress = accounts[0];
    await registerUser.registerUser(
      "Alice",
      "alice@example.com",
      123456789,
      "Individual"
    );
    const isRegistered = await registerUser.isUserRegistered(userAddress);
    assert.isTrue(isRegistered);
  });

  it("should return false if user is not registered", async () => {
    const userAddress = accounts[1];
    const isRegistered = await registerUser.isUserRegistered(userAddress);
    assert.isFalse(isRegistered);
  });

  // Test case for changing KYC data
  it("should change a user's KYC data", async () => {
    // Call the registerUser and changeKYCData functions with test parameters
    await registerUser.registerUser(
      "Alice",
      "alice@example.com",
      123456789,
      "Individual"
    );
    await registerUser.changeKYCData("KYC data");

    // Check that the KYC data was updated
    const user = await registerUser.users(accounts[0]);
    assert.equal(user.kycData, "KYC data");

    // Check that the user's KYC status is Pending
    const kycStatus = await registerUser.isKYCVerified(accounts[0]);
    assert.equal(kycStatus, false);
  });

  // Test case for validating KYC
  it("should validate a user's KYC", async () => {
    // Call the registerUser, changeKYCData, and validateKYC functions with test parameters
    await registerUser.registerUser(
      "Alice",
      "alice@example.com",
      123456789,
      "Individual"
    );

    await registerUser.validateKYC(accounts[0]);

    // Check that the user's KYC status is Verified
    const kycStatus = await registerUser.isKYCVerified(accounts[0]);
    assert.equal(kycStatus, true);
  });

  it("should add a new article", async () => {
    userArticles = await UserArticles.new();
    const userAddress = accounts[0];

    // register the user
    await registerUser.registerUser(
      "Alice",
      "alice@example.com",
      123456789,
      "agency",
      { from: userAddress }
    );

    // call the addArticle function from the registered user's address
    const link = "https://example.com";
    const title = "Example Article";
    const city = "Example City";
    const country = "Example Country";
    const price = 100;
    await userArticles.addArticle(link, title, city, country, price, {
      from: userAddress,
    });

    // assert that the article was added correctly
    const articles = await userArticles.getArticlesByAgency(userAddress);
    assert.equal(articles.length, 1);
    assert.equal(articles[0].link, link);
    assert.equal(articles[0].title, title);
    assert.equal(articles[0].city, city);
    assert.equal(articles[0].country, country);
    assert.equal(articles[0].price, price);
  });

  it("should return all articles from all agencies", async () => {
    userArticles = await UserArticles.new();
    const userAddress1 = accounts[0];
    const userAddress2 = accounts[1];

    // register two agencies
    // register the user
    await registerUser.registerUser(
      "Alice",
      "alice@example.com",
      123456789,
      "agency",
      { from: userAddress1 }
    );
    // register the user
    await registerUser.registerUser(
      "Wendy",
      "wendy@example.com",
      123456789,
      "agency",
      { from: userAddress2 }
    );

    // add articles from both agencies
    const link1 = "https://example1.com";
    const title1 = "Example Article 1";
    const city1 = "Example City 1";
    const country1 = "Example Country 1";
    const price1 = 100;
    await userArticles.addArticle(link1, title1, city1, country1, price1, {
      from: userAddress1,
    });

    const link2 = "https://example2.com";
    const title2 = "Example Article 2";
    const city2 = "Example City 2";
    const country2 = "Example Country 2";
    const price2 = 200;
    await registerUser.addArticle(link2, title2, city2, country2, price2, {
      from: userAddress2,
    });

    // get all articles and assert that both were returned
    const allArticles = await userArticles.getArticles();
    assert.equal(allArticles.length, 2);
    assert.equal(allArticles[0].link, link1);
    assert.equal(allArticles[0].title, title1);
    assert.equal(allArticles[0].city, city1);
    assert.equal(allArticles[0].country, country1);
    assert.equal(allArticles[0].price, price1);
    assert.equal(allArticles[1].link, link2);
    assert.equal(allArticles[1].title, title2);
    assert.equal(allArticles[1].city, city2);
    assert.equal(allArticles[1].country, country2);
    assert.equal(allArticles[1].price, price2);
  });

  it("should get articles by agency", async () => {
    const userAddress = accounts[0];
    userArticles = await UserArticles.new();

    // register the user
    await registerUser.registerUser(
      "Alice",
      "alice@example.com",
      123456789,
      "agency",
      { from: userAddress }
    );

    // register the user
    await registerUser.registerUser(
      "Wendy",
      "wendy@example.com",
      123456789,
      "buyer",
      { from: accounts[1] }
    );
    // add an article from the registered user's address
    const link = "https://example.com";
    const title = "Example Article";
    const city = "Example City";
    const country = "Example Country";
    const price = 100;
    await userArticles.addArticle(link, title, city, country, price, {
      from: userAddress,
    });

    // get articles by agency from the registered user's address
    const articles = await userArticles.getArticlesByAgency(userAddress);
    assert.equal(articles.length, 1);
    assert.equal(articles[0].link, link);
    assert.equal(articles[0].title, title);
    assert.equal(articles[0].city, city);
    assert.equal(articles[0].country, country);
    assert.equal(articles[0].price, price);
  });

  it("should add a buyer request to the articleRequests mapping", async () => {
    const articleIndex = 0;
    const date = "2023-04-05";
    const comment = "I'm interested in buying this article";

    // register the sender as a buyer
    // register the user
    await registerUser.registerUser(
      "Wendy",
      "wendy@example.com",
      123456789,
      "buyer",
      { from: accounts[0] }
    );

    // add a buyer request
    await userArticles.addBuyerRequest(articleIndex, date, comment, {
      from: accounts[0],
    });
  });
});
