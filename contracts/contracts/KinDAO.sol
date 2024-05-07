// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract KinDAO is Ownable {
    ERC20 public utilityToken;

    // Utility token amount
    uint256 immutable providerFeeRate = 3;
    uint256 immutable firstFactCreatorFeeRate = 50;
    uint256 immutable secondFactCreatorFeeRate = 30;
    uint256 immutable thirdFactCreatorFeeRate = 20;
    uint256 immutable minimumBounty = 500000000000000000000;

    struct Totals {
        uint256 tokenAmount;
        uint256 proposal;
        uint256 profile;
        uint256 fact;
        uint256 vote;
    }

    Totals public totals;

    address[] private profileIds;
    string[] private proposalIds;
    mapping(string => bool) private usernames;
    mapping(string => string[]) private factIds;
    mapping(string => address[]) private voters;

    mapping(address => bool) private admins;
    mapping(address => Profile) private profiles;
    mapping(string => Proposal) private proposals;
    mapping(string => mapping(string => Fact)) private facts;
    mapping(string => mapping(address => Vote)) private votes;
    
    struct Profile {
        string username;
        string avatarUrl;
        uint256 earned;
    }

    struct Proposal {
        string id;
        string title;
        string description;
        address creator;
        uint256 bounty;
        uint128 createdAt;
        bool isFinalized;
    }

    struct Fact {
        string id;
        string proposalId;
        string title;
        string description;
        string sourceMediaUrl;
        uint256 voteUp;
        uint256 voteDown;
        uint128 createdAt;
        address creator;
        bool approved;
    }

    struct Vote {
        bool isUp;
        string factId;
        address voter;
    }

    event ProfileCreated(
        address indexed _address,
        string _username,
        string _avatarUrl
    );

    event ProposalCreated(
        string _proposalId,
        string _title,
        string _description,
        address _creator,
        uint256 _bounty,
        uint128 _createdAt
    );

    event FactCreated(
        string _proposalId,
        string _factId,
        string _title,
        string _description,
        string _sourceMediaUrl,
        address _creator,
        uint128 _createdAt
    );

    event FactVoted(
        string _proposalId,
        string _factId,
        bool _isUp,
        uint256 _voteUp,
        uint256 _voteDown
    );

    event ProposalFinalized(
        string _proposalId,
        string _title,
        string _description,
        address _creator,
        uint128 _createdAt
    );

    constructor(address initialOwner, address _utilityToken) Ownable(initialOwner) {
        admins[initialOwner] = true;
        utilityToken = ERC20(_utilityToken);
        totals.tokenAmount = 0;
        totals.proposal = 0;
        totals.fact = 0;
        totals.vote = 0;
    }

    function _onlyAdmin() internal view virtual {
        require(admins[msg.sender], "Only admin can call this function");
    }

    modifier onlyAdmin() {
        _onlyAdmin();
        _;
    }

    function _onlyCreator(string memory _proposalId) internal view virtual {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.creator == msg.sender, "Only creator can call this function");
    }

    modifier onlyCreator(string memory _proposalId) {
        _onlyCreator(_proposalId);
        _;
    }

    modifier onlyAdminOrCreator(string memory _proposalId) {
        if (!admins[msg.sender]) {
            _onlyCreator(_proposalId);
        }
        _;
    }

    function isAdmin(address _address) public view returns (bool) {
        return admins[_address];
    }

    function addAdmin(address _address) public onlyOwner {
        admins[_address] = true;
    }

    function removeAdmin(address _address) public onlyOwner {
        admins[_address] = false;
    }

    function _compareString(string memory a, string memory b) internal pure returns (bool) {
        return keccak256(abi.encodePacked(a)) != keccak256(abi.encodePacked(b));
    }

    function _createId(string memory seed) internal view returns (string memory) {
        uint256 length = 32;
        bytes memory characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        bytes memory randomString = new bytes(length);
        for (uint256 i = 0; i < length; i++) {
            uint256 index = uint256(keccak256(
                abi.encodePacked(seed, i, msg.sender, block.timestamp)
            )) % characters.length;
            randomString[i] = characters[index];
        }
        return string(randomString);
    }

    function createProfile(string memory _username, string memory _avatarUrl) public {
        require(_compareString(_username, ""), "Username is required");
        require(usernames[_username] == false, "Username is already taken");
        require(!_compareString(profiles[msg.sender].username, ""), "Profile is already created");
        profiles[msg.sender] = Profile(_username, _avatarUrl, 0);
        profileIds.push(msg.sender);
        totals.profile += 1;
        usernames[_username] = true;
        emit ProfileCreated(msg.sender, _username, _avatarUrl);
    }

    function updateProfile(string memory _username, string memory _avatarUrl) public {
        Profile storage profile = profiles[msg.sender];
        if (_compareString(profile.username, _username)) {
            require(usernames[_username] == false, "Username is already taken");
            delete usernames[profile.username];
            usernames[_username] = true;
            profile.username = _username;
        }
        profile.avatarUrl = _avatarUrl;
    }

    function createProposal(string memory _title, string memory _description, uint256 _bounty) public {
        uint256 allowance = utilityToken.allowance(msg.sender, address(this));

        require(allowance >= _bounty, "Insufficient allowance");
        require(_bounty >= minimumBounty, "Minimum bounty is 500");

        utilityToken.transferFrom(msg.sender, address(this), _bounty);
    
        totals.proposal += 1;
        totals.tokenAmount += _bounty;
        string memory id = _createId("proposal");
        proposals[id] = Proposal(id, _title, _description, msg.sender, _bounty, uint128(block.timestamp), false);
        proposalIds.push(id);

        emit ProposalCreated(id, _title, _description, msg.sender, _bounty, uint128(block.timestamp));
    }

    function _checkProposal(string memory _proposalId) internal view {
        require(bytes(proposals[_proposalId].title).length > 0, "Proposal not found");
    }

    function _payFactCreatorFees(string memory _proposalId, uint256 _totalPayValueToFactCreators) internal {
        require(utilityToken.balanceOf(address(this)) >= _totalPayValueToFactCreators, "Insufficient balance");

        Fact[] memory _facts;
        uint256 count;

        (_facts, count) = getDeservedFacts(_proposalId);

        for (uint256 i = 0; i < count; i++) {
            Fact memory fact = _facts[i];
            Profile storage profile = profiles[fact.creator];

            if (_compareString(profile.username, "")) {
                profile.earned += _totalPayValueToFactCreators;
            }

            uint256 factCreatorFee = 0;

            if (i == 0) {
                factCreatorFee = _totalPayValueToFactCreators * firstFactCreatorFeeRate / 100;
            } else if (i == 1) {
                factCreatorFee = _totalPayValueToFactCreators * secondFactCreatorFeeRate / 100;
            } else if (i == 2) {
                factCreatorFee = _totalPayValueToFactCreators * thirdFactCreatorFeeRate / 100;
            }
            

            utilityToken.transfer(fact.creator, factCreatorFee);
        }
    }

    function finalizeProposal(string memory _proposalId, string memory _approvedFactId) public onlyAdminOrCreator(_proposalId) {
        _checkProposal(_proposalId);
        Proposal storage proposal = proposals[_proposalId];
        require(!proposal.isFinalized, "Proposal is already finalized");

        Fact storage approvedFact = facts[_proposalId][_approvedFactId];
        approvedFact.approved = true;

        uint256 providerFee = proposal.bounty * providerFeeRate / 100;
        uint256 totalPayValueToFactCreators = proposal.bounty - providerFee;
        _payFactCreatorFees(_proposalId, totalPayValueToFactCreators);

        proposal.isFinalized = true;


        emit ProposalFinalized(_proposalId, proposal.title, proposal.description, proposal.creator, proposal.createdAt);
    }

    function _addressIsCreatedFact(Fact[] memory _facts, address _address) internal pure returns (bool) {
        for (uint256 i = 0; i < _facts.length; i++) {
            if (_facts[i].creator == _address) {
                return true;
            }
        }
        return false;
    }

    function createFact(string memory _proposalId, string memory _title, string memory _description, string memory _sourceMediaUrl) public {
        _checkProposal(_proposalId);

        Fact[] memory _facts = getFacts(_proposalId, 0, factIds[_proposalId].length);

        require(!_addressIsCreatedFact(_facts, msg.sender), "You have already created a fact");

        totals.fact += 1;
        string memory id = _createId("fact");
        facts[_proposalId][id] = Fact(id, _proposalId, _title, _description, _sourceMediaUrl, 0, 0, uint128(block.timestamp), msg.sender, false);
        factIds[_proposalId].push(id);

        emit FactCreated(_proposalId, id, _title, _description, _sourceMediaUrl, msg.sender, uint128(block.timestamp));
    }
    
    function _checkFact(string memory _proposalId, string memory _factId) internal view {
        require(bytes(facts[_proposalId][_factId].title).length > 0, "Fact not found");
    }

    function voteFact(string memory _proposalId, string memory _factId, bool _isUp) public {
        _checkProposal(_proposalId);
        _checkFact(_proposalId, _factId);

        Fact storage fact = facts[_proposalId][_factId];
        Vote storage vote = votes[_factId][msg.sender];
        
        if (vote.voter == address(0)) {
            totals.vote += 1;
            voters[_factId].push(msg.sender);
            _isUp ? fact.voteUp += 1 : fact.voteDown += 1;
            votes[_factId][msg.sender] = Vote(_isUp, _factId, msg.sender);
        } else {
            if (vote.isUp == _isUp) {
                return;
            }

            vote.isUp = _isUp;

            if (vote.isUp) {
                fact.voteUp += 1;
                fact.voteDown -= 1;
            } else {
                fact.voteUp -= 1;
                fact.voteDown += 1;
            }
        }

        emit FactVoted(_proposalId, _factId, _isUp, fact.voteUp, fact.voteDown);
    }

    function getProfiles(uint256 _startIndex, uint256 _endIndex) public view returns (Profile[] memory) {
        uint256 endIndex = _endIndex > profileIds.length ? profileIds.length : _endIndex;
        uint256 startIndex = _startIndex > endIndex ? endIndex : _startIndex;
        uint256 length = endIndex - startIndex;

        Profile[] memory _profiles = new Profile[](length);

        for (uint256 i = 0; i < length; i++) {
            Profile memory profile = profiles[profileIds[i]];
            _profiles[i] = profile;
        }

        return _profiles;
    }

    function getProposals(uint256 _startIndex, uint256 _endIndex) public view returns (Proposal[] memory) {
        uint256 endIndex = _endIndex > proposalIds.length ? proposalIds.length : _endIndex;
        uint256 startIndex = _startIndex > endIndex ? endIndex : _startIndex;
        uint256 length = endIndex - startIndex;
    
        Proposal[] memory _proposals = new Proposal[](length);

        for (uint256 i = 0; i < length; i++) {
            _proposals[i] = proposals[proposalIds[i]];
        }

        return _proposals;
    }

    function getFacts(string memory _proposalId, uint256 _startIndex, uint256 _endIndex) public view returns (Fact[] memory) {
        uint256 endIndex = _endIndex > factIds[_proposalId].length ? factIds[_proposalId].length : _endIndex;
        uint256 startIndex = _startIndex > endIndex ? endIndex : _startIndex;
        uint256 length = endIndex - startIndex;

        Fact[] memory _facts = new Fact[](length);

        for (uint256 i = 0; i < length; i++) {
            _facts[i] = facts[_proposalId][factIds[_proposalId][i]];
        }

        return _facts;
    }

    function getFactsLength(string memory _proposalId) public view returns (uint256) {
        return factIds[_proposalId].length;
    }

    function getDeservedFacts(string memory _proposalId) public view returns (Fact[] memory, uint256) {
        Fact[] memory _facts = getFacts(_proposalId, 0, factIds[_proposalId].length);

        for (uint256 i = 0; i < _facts.length - 1; i++) {
            for (uint256 f = 0; f < _facts.length - i - 1; f++) {
                if (_facts[f].voteUp < _facts[f + 1].voteUp) {
                    Fact memory temp = _facts[f];
                    _facts[f] = _facts[f + 1];
                    _facts[f + 1] = temp;
                }
            }
        }

        uint256 count = _facts.length < 3 ? _facts.length : 3;
        Fact[] memory _deservedFacts = new Fact[](count);

        for (uint256 i = 0; i < count; i++) {
            _deservedFacts[i] = _facts[i];
        }

        return (_deservedFacts, count);
    }

    function getVotes(string memory _factId) public view returns (Vote[] memory) {
        Vote[] memory _votes = new Vote[](voters[_factId].length);
        for (uint256 i = 0; i < voters[_factId].length; i++) {
            _votes[i] = votes[_factId][voters[_factId][i]];
        }
        return _votes;
    }

    function getProfile(address _address) public view returns (bool, Profile memory) {
        return (_compareString(profiles[_address].username, ""), profiles[_address]);
    }

    function getProposal(string memory _proposalId) public view returns (bool, Proposal memory) {
        return (_compareString(proposals[_proposalId].title, ""), proposals[_proposalId]);
    }

    function getFact(string memory _proposalId, string memory _factId) public view returns (bool, Fact memory) {
        return (_compareString(facts[_proposalId][_factId].title, ""), facts[_proposalId][_factId]);
    }

    function getVote(string memory _factId, address _address) public view returns (bool, Vote memory) {
        return (votes[_factId][_address].voter != address(0), votes[_factId][_address]);
    }
    
    function withdraw() public onlyOwner {
        utilityToken.transfer(msg.sender, utilityToken.balanceOf(address(this)));
    }

    receive() external payable {}
}
