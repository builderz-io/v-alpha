import React from "react";
import { newContextComponents } from "@drizzle/react-components";

const { ContractData, ContractForm } = newContextComponents;

const ContractInteractions = ({ drizzle, drizzleState }) => {
  return (
    <div className="section">
      <h2>Contract Interactions</h2>
      <div class="description">
        <p><i>Trigger useful contract actions manually</i></p>
      </div>
      <p>
        <strong>Verify an account</strong>
      </p>
      <ContractForm
        drizzle={drizzle}
        contract="VICoin"
        method="verifyAccount"
        sendArgs={{ gas: 600000, gasPrice: 40000000000 }}
      />
      <p>
        <strong>Transfer funds</strong>
      </p>
      <ContractForm
        drizzle={drizzle}
        contract="VICoin"
        method="transfer"
        labels={["Recipient", "Amount in VALUE"]}
      />
      <p>
        <strong>Trigger onchain balance update</strong>
      </p>
      <ContractForm
        drizzle={drizzle}
        drizzleState={drizzleState}
        contract="VICoin"
        method="triggerOnchainBalanceUpdate"
        methodArgs={[drizzleState.accounts[0]]}
      />
      <p>
        <strong>Mine blocks</strong>
      </p>
      <input type="number" min="1" max="1" value="1" class="mining-input-placeholder"></input>
      <ContractForm drizzle={drizzle} contract="VICoin" method="mine" />
      <p>
        <span class="curr-contr-acc">
        Current block is: <br/>
        <ContractData
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract="VICoin"
          method="getBlockNumber"
        />
        </span>
      </p>
    </div>
  );
};

export default ContractInteractions;
