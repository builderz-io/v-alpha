import React from "react";
import { newContextComponents } from "@drizzle/react-components";

const { ContractData, ContractForm } = newContextComponents;

const EconomicParameters = ({ drizzle, drizzleState }) => {
  return (
    <div className="section">
      <h2>Economic parameters</h2>
      <div class="description">
        <p><i>Adjust the economic parameters of your currency</i></p>
      </div>
      <div class="attention">
        <p>
          <span role="img" aria-label="pay attention">❗️&nbsp;</span><i>Add &nbsp;
           <ContractData
            drizzle={drizzle}
            drizzleState={drizzleState}
            contract="VICoin"
            method="decimals"
          />
          &nbsp; decimal places to initial balance and generation amount, e.g. 10 becomes 10000000 </i>
        </p>
      </div>
      <p>
        <strong>Initial Balance: </strong>
        <ContractData
          drizzle={drizzle}
          drizzleState={drizzleState}
          contract="VICoin"
          method="initialBalance"
        />
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
        />
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
        />
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
        />
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
