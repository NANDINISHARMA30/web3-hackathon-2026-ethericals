// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title SharpToken — ERC20 loyalty token for SharpKit integrations
contract SharpToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10 ** 18;

    event TokensMinted(address indexed to, uint256 amount, string reason);
    event TokensBurned(address indexed from, uint256 amount);

    constructor(address treasury) ERC20("Sharp Token", "SHRP") Ownable(msg.sender) {
        // Mint 10M to treasury on deploy
        _mint(treasury, 10_000_000 * 10 ** 18);
    }

    /// @notice Owner (backend treasury wallet) mints tokens as rewards
    function mint(address to, uint256 amount, string calldata reason) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
        emit TokensMinted(to, amount, reason);
    }

    /// @notice Burn tokens from caller (spend path)
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }

    function decimals() public pure override returns (uint8) {
        return 18;
    }
}
