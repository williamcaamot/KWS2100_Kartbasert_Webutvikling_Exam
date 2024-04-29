import React from "react";
import ReactDOM from "react-dom/client";
import { Application } from "./modules/application/Application";
import { ApolloProvider } from "@apollo/client";
import { client } from "./modules/layers/trains/TrainLayer";
const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <ApolloProvider client={client}>
    <Application />
  </ApolloProvider>,
);
