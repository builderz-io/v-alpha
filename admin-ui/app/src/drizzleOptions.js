import Web3 from "web3";
import VICoin from "./contracts/VICoin.json";

const options = {
  web3: {
    // block: false,
    fallback: {
      type: "ws",
      url: "ws:127.0.0.1:8545"
    }
  },
  contracts: [VICoin],
  events: {
    VICoin: [
      "IncomeReceived",
      "Decay",
      "Mint",
      "VerifyAccount",
      "Burn",
      "PaidContribution",
      "BurnedFees",
      "ApproveAccount",
      "UnapproveAccount",
      "UpdateLifetime",
      "UpdateInitialBalance",
      "UpdateGenerationAmount",
      "UpdateGenerationPeriod",
      "UpdateCommunityContributionAccount",
      "UpdateTransactionFee",
      "UpdateCommunityContribution",
      "Mined",
      "Log",
    ],
  },
};

export default options;
