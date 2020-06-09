import React from "react";
import { newContextComponents } from "@drizzle/react-components";
import styled from "styled-components";

const { AccountData, ContractData, ContractForm } = newContextComponents;

const ContributionAndFees = ({ drizzle, drizzleState }) => {
  return (
    <div className="section">
      <h2>Contribution and fees</h2>
      <p>Adjust fees and contribution rate of your currency.</p>
      <p>
        <strong>Contribution rate: </strong>
        <ContractData
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract="VICoin"
          method="communityContribution"
        />
      </p>
      <ContractForm
        drizzle={drizzle}
        contract="VICoin"
        method="updateCommunityContribution"
      />
      <p>
        <strong>Contribution account: </strong>
        <ContractData
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract="VICoin"
          method="communityContributionAccount"
        />
      </p>
      <ContractForm
        drizzle={drizzle}
        contract="VICoin"
        method="updateCommunityContributionAccount"
      />
      <p>
        <strong>Transaction fees: </strong>
        <ContractData
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract="VICoin"
          method="transactionFee"
          precision={2}
        />
      </p>
      <ContractForm
        drizzle={drizzle}
        contract="VICoin"
        method="updateTransactionFee"
      />
      <p>
        <strong>Decimal places in contribution fee: </strong>
        <ContractData
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract="VICoin"
          method="contributionFeeDecimals"
        />
      </p>
    </div>
  );
};

export default ContributionAndFees;
