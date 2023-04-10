// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "./RegisterUser.sol";


contract UserArticles is   RegisterUser{

    
         RegisterUser public registerUser;
      
    


 constructor(address registerUserAddress) {
        registerUser = RegisterUser(registerUserAddress);
        
    }
  

    uint256 private nextArticleId;

   struct BuyerRequest {
        address buyer;
        address owner;
        string date;
        string comment;
    }



struct Article {
         
    string link;
    string title;
    string city;
    string country;
    
    address agency;
    bool reserved;
    uint256 price;
       uint256 id; // new ID field
    address owner;
    

}


    struct Offer {
    address buyer;
    address seller;
    string time;
    uint256 price;
}
    

    
 mapping(bytes32 => BuyerRequest[]) private articleRequests;
    mapping(bytes32 => Article) private articles;
    mapping(address => Article[]) private articlesByAgency; // maps each agency to the articles they have created
   mapping(address => mapping(bytes32 => bool)) public buyerRequestedArticle;
 mapping(bytes32 => Offer[]) articleOffers;



event ArticleAdded(address indexed agency, bytes32 indexed articleId, string link, string title, string city, string country, bool sold, uint256 price, uint256 id);

   event BuyerRequestAdded(address indexed buyer, bytes32 indexed articleId, string date, string comment);
event OfferMade(address indexed buyer, bytes32 indexed articleKey, string time, uint256 price);



function addArticle(string memory _link, string memory _title, string memory _city, string memory _country, uint256 _price) public {
  // require(users[msg.sender].userAddress == msg.sender , "you are not registered");
  // require(users[msg.sender].kycStatus == KYCStatus.Verified, "You are validated as an agency");
 //  require(keccak256(bytes(users[msg.sender].profile)) == keccak256(bytes("agency")), "You are not registered as an agency");
  // require(bytes(_link).length > 0 && bytes(_title).length > 0 && bytes(_city).length > 0 && bytes(_country).length > 0, "All fields are required");

    Article memory article = Article(_link, _title, _city, _country, msg.sender, false, _price, nextArticleId,msg.sender);
    nextArticleId++;

    articlesByAgency[msg.sender].push(article);
    bytes32 articleId = keccak256(abi.encodePacked(article.id)); // use the article ID as the key in the mapping

    // add the new article to the mapping
    articles[articleId] = article;

    // emit an event to notify clients of the new article
   emit ArticleAdded(msg.sender, articleId, _link, _title, _city, _country,false, _price, article.id);
}



 function getArticleById(
       uint _id
    ) public view returns (Article memory) {
     bytes32 id = bytes32(_id);
        return articles[id];
    }
//i'm an agency i want to consult my articles
function getArticlesByAgency(address agency) public view returns (Article[] memory) {
   

    require(keccak256(bytes(users[msg.sender].profile)) != keccak256(bytes("agency")), "Address is not registered as an agency");

    return articlesByAgency[agency];
}





function getAllArticles() public view returns (Article[] memory) {
    Article[] memory allArticles = new Article[](nextArticleId);
    uint256 i;
    for (i = 0; i < nextArticleId; i++) {
        bytes32 articleId = keccak256(abi.encodePacked(i));
        allArticles[i] = articles[articleId];
    }
    return allArticles;
}

    function combineArrays(Article[] memory a, Article[] memory b) private pure returns (Article[] memory) {
        Article[] memory result = new Article[](a.length + b.length);
        uint index = 0;
        for (uint i = 0; i < a.length; i++) {
            result[index] = a[i];
            index++;
        }
        for (uint i = 0; i < b.length; i++) {
            result[index] = b[i];
            index++;
        }
        return result;
    }




function getNextArticleId() public view returns (uint256) {
    return nextArticleId;
}



 function addBuyerRequest(uint256 articleIndex, string memory date, string memory comment) public {
    //require(bytes(date).length > 0 && bytes(comment).length > 0, "Date and comment cannot be empty");

    Article memory article = getArticleById(articleIndex);

    address owner = article.owner;

    bytes32 articleKey = keccak256(abi.encodePacked(article.id)); // use the article ID as the key in the mapping
    articleRequests[articleKey].push(BuyerRequest(msg.sender, owner, date, comment));
    emit BuyerRequestAdded(msg.sender, articleKey, date, comment);
}
    

    
    function getBuyerRequestsFromArticles(uint256 articleIndex) public view returns (BuyerRequest[] memory) {
    Article memory article = getArticleById(articleIndex);
    bytes32 articleKey = keccak256(abi.encodePacked(article.id));
    return articleRequests[articleKey];
}


 function getUserArticleKeys(address owner) public view returns (bytes32[] memory) {
        uint256 articleCount = getNextArticleId();
        bytes32[] memory articleKeys = new bytes32[](articleCount);
        uint256 matchingArticleCount = 0;

        for (uint256 i = 0; i < articleCount; i++) {
            bytes32 articleKey = bytes32(i);
           UserArticles.Article memory article = getArticleById(uint256(articleKey));
            if (article.owner == owner) {
                articleKeys[matchingArticleCount] = articleKey;
                matchingArticleCount++;
            }
        }

        bytes32[] memory result = new bytes32[](matchingArticleCount);
        for (uint256 i = 0; i < matchingArticleCount; i++) {
            result[i] = articleKeys[i];
        }

        return result;
    }


function makeOffer(uint256 articleIndex, string memory time, uint256 price) public {
    require(bytes(time).length > 0, "Time cannot be empty");
    require(price > 0, "Price must be greater than 0");

    Article memory article = getArticleById(articleIndex);
    bytes32 articleKey = keccak256(abi.encodePacked(article.id)); // compute articleKey from article ID

    

    Offer memory offer = Offer(msg.sender, article.owner, time, price);
    articleOffers[articleKey].push(offer);
    // Check if the offer price is within 10% of the article price
    require(price >= article.price , "Offer price must be within 10% of the article price");




        article.reserved = true;
   

    emit OfferMade(msg.sender, articleKey, time, price);
}}