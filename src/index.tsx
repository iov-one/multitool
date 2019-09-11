import "bootstrap/dist/css/bootstrap.css";
import "./index.css";

import { ChainId } from "@iov/bcp";
import React from "react";
import ReactDOM from "react-dom";
import { Route, Switch } from "react-router";
import { HashRouter } from "react-router-dom";

import Create from "./Create";

const boarnet = {
  chainId: "iov-boarnet" as ChainId,
};

ReactDOM.render(
  <HashRouter>
    <Switch>
      <Route component={() => <Create chainId={boarnet.chainId} />} />
    </Switch>
  </HashRouter>,
  document.getElementById("root"),
);
