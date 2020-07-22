import React from "react";
import { newContextComponents } from "@drizzle/react-components";

const { ContractData, ContractForm } = newContextComponents;

const EconomicParameters = ({ drizzle, drizzleState }) => {
  return (
    <div className="section">
      <h2>Economic parameters</h2>
      <p><i>Adjust the economic parameters of your currency</i></p>
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
        <strong>Generation amount: </strong>
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
      <p>
        <strong>Initial balance: </strong>
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
    </div>
  );
};

export default EconomicParameters;
