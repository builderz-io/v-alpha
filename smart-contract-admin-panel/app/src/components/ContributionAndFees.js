import React from "react";
import { newContextComponents } from "@drizzle/react-components";

const { ContractData, ContractForm } = newContextComponents;

const ContributionAndFees = ({ drizzle, drizzleState }) => {
  return (
    <div className="section">
      <h2>Contribution & Fees</h2>
      <div className="description">
        <p><i>Adjust fees and contribution rate of your currency</i></p>
      </div>
      <div className="attention">
        <p>
          <span className="exclamation-mark" role="img" aria-label="pay attention">❗️&nbsp;</span><i>Add &nbsp;
          <ContractData
            drizzle={drizzle}
            drizzleState={drizzleState}
            contract="VICoin"
            method="contributionFeeDecimals"
          />
          &nbsp; decimal places to transaction fee and contribution, e.g. 12 is entered as 1200</i></p>
      </div>
      <p>
        <strong>Transaction Fee: </strong>
        <ContractData
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract="VICoin"
          method="transactionFee"
          precision={2}
        /> % of Transaction
      </p>
      <ContractForm
        drizzle={drizzle}
        contract="VICoin"
        method="updateTransactionFee"
      />
      <p>
        <strong>Contribution: </strong>
        <ContractData
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract="VICoin"
          method="communityContribution"
        /> % of Fee
      </p>
      <ContractForm
        drizzle={drizzle}
        contract="VICoin"
        method="updateCommunityContribution"
      />
      <p>
        <strong>Contribution Account</strong>
      </p>
      <ContractForm
        drizzle={drizzle}
        contract="VICoin"
        method="updateCommunityContributionAccount"
      />
      <p>
        <span className="curr-contr-acc">
        Current contribution account is: <br/>
        <ContractData
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract="VICoin"
          method="communityContributionAccount"
        />
        </span>
      </p>
    </div>
  );
};

export default ContributionAndFees;
