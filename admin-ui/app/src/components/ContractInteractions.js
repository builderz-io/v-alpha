import React from "react";
import { newContextComponents } from "@drizzle/react-components";

const { ContractData, ContractForm } = newContextComponents;

const ContractInteractions = ({ drizzle, drizzleState }) => {
  return (
    <div className="section">
      <h2>Contract Interactions</h2>
      <p><i>Trigger useful contract actions manually</i></p>
      <strong>Verify an account: </strong>
      <ContractForm
        drizzle={drizzle}
        contract="VICoin"
        method="verifyAccount"
        sendArgs={{ gas: 600000, gasPrice: 40000000000 }}
      />
      <strong>Transfer Value: </strong>
      <ContractForm
        drizzle={drizzle}
        contract="VICoin"
        method="transfer"
        labels={["Recipient", "Amount in VALUE"]}
      />
      <strong>Trigger onchain balance update: </strong>
      <ContractForm
        drizzle={drizzle}
        drizzleState={drizzleState}
        contract="VICoin"
        method="triggerOnchainBalanceUpdate"
        methodArgs={[drizzleState.accounts[0]]}
      />
      <strong>Mine blocks: </strong>
      <ContractForm drizzle={drizzle} contract="VICoin" method="mine" />
      <p>
        <strong>Current block: </strong>
        <ContractData
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract="VICoin"
          method="getBlockNumber"
        />
      </p>
    </div>
  );
};

export default ContractInteractions;
