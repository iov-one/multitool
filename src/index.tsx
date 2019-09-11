import "bootstrap/dist/css/bootstrap.css";
import "./index.css";

import React from "react";
import ReactDOM from "react-dom";
import { Route, Switch } from "react-router";
import { HashRouter } from "react-router-dom";

import Start from "./Start";

ReactDOM.render(
  <HashRouter>
    <Switch>
      <Route component={() => <Start />} />
    </Switch>
  </HashRouter>,
  document.getElementById("root"),
);
