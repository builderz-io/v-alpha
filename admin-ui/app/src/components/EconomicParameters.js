import React from "react";
import { newContextComponents } from "@drizzle/react-components";

const { ContractData, ContractForm } = newContextComponents;

const EconomicParameters = ({ drizzle, drizzleState }) => {
  return (
    <div className="section">
      <h2>Economic parameters</h2>
      <div className="description">
        <p><i>Adjust the economic parameters of your currency</i></p>
      </div>
      <div className="attention">
        <p>
          <span className="exclamation-mark" role="img" aria-label="pay attention">❗️&nbsp;</span><i>Add &nbsp;
           <ContractData
            drizzle={drizzle}
            drizzleState={drizzleState}
            contract="VICoin"
            method="decimals"
          />
          &nbsp; decimal places to initial balance and generation amount, e.g. 12 is entered as 12000000 </i>
        </p>
      </div>
      <p>
        <strong>Initial Balance: </strong>
        <ContractData
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract="VICoin"
          method="initialBalance"
        /> V
      </p>
      <ContractForm
        drizzle={drizzle}
        contract="VICoin"
        method="updateInitialBalance"
      />
      <p>
        <strong>Generation Amount: </strong>
        <ContractData
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract="VICoin"
          method="generationAmount"
        /> V
      </p>
      <ContractForm
        drizzle={drizzle}
        contract="VICoin"
        method="updateGenerationAmount"
      />
      <p>
        <strong>Generation Period: </strong>
        <ContractData
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract="VICoin"
          method="generationPeriod"
        /> Blocks
      </p>
      <ContractForm
        drizzle={drizzle}
        contract="VICoin"
        method="updateGenerationPeriod"
      />
      <p>
        <strong>Lifetime: </strong>
        <ContractData
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract="VICoin"
          method="lifetime"
        /> Blocks
      </p>
      <ContractForm
        drizzle={drizzle}
        contract="VICoin"
        method="updateLifetime"
      />
    </div>
  );
};

export default EconomicParameters;
