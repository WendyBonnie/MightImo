// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";


contract RegisterUser is Ownable {
      
      
    address[] public userAddresses;
    mapping(address => User) public users;
   

    struct User {
        address userAddress;
        string name;
        string email;
        uint256 phoneNumber;
        string kycData;
        string profile;
        KYCStatus kycStatus;
    }


    
    enum KYCStatus {
        NotVerified,
        Pending,
        Verified
    }

  

   function registerUser(string memory _name, string memory _email, uint256 _phoneNumber, string memory _profile) public {
        require(users[msg.sender].userAddress != msg.sender, "User already registered");
        users[msg.sender] = User(msg.sender, _name, _email, _phoneNumber, "",_profile, KYCStatus.NotVerified);
      

        userAddresses.push(msg.sender);
    }

    function isUserRegistered(address userAddress) public view returns (bool) {
    return users[userAddress].userAddress == userAddress;
}


    function validateKYC(address userAddress) public onlyOwner {
    require(users[userAddress].userAddress != userAddress, "User not registered");
    users[userAddress].kycStatus = KYCStatus.Verified; // update KYC status to verified
}

    
    function getAllUsers() public view onlyOwner returns (address[] memory) {
        require(msg.sender == owner(), "Only the contract owner can call this function");
        return userAddresses;
    }


function userContractAddress() public view returns (address) {
    return users[msg.sender].userAddress;
}

function isKYCVerified(address userAddress) public view returns (bool) {
    require(users[userAddress].userAddress == userAddress, "User not registered");
    return users[userAddress].kycStatus == KYCStatus.Verified;
}






}
