import React from "react";
import { DrizzleContext } from "@drizzle/react-plugin";
import { Drizzle } from "@drizzle/store";
import drizzleOptions from "./drizzleOptions";
import VIAdminComponent from "./VIAdminComponent"
import Container from "./Container"
import "./App.css";

import { DrizzleProvider } from "@drizzle/react-plugin";

const drizzle = new Drizzle(drizzleOptions);

const App = () => {
  return (
    <DrizzleContext.Provider drizzle={drizzle}>
      <DrizzleContext.Consumer>
        {drizzleContext => {
          const { drizzle, drizzleState, initialized } = drizzleContext;

          if (!initialized) {
            return "Loading..."
          }

          return (
            <div>
              <VIAdminComponent drizzle={drizzle} drizzleState={drizzleState} />
            </div>
          )
        }}
      </DrizzleContext.Consumer>
    </DrizzleContext.Provider>

    // <DrizzleProvider options={drizzleOptions}>
    //   <Container  />
    // </DrizzleProvider>
  );
}

export default App;
