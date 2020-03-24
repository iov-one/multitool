import "bootstrap/dist/css/bootstrap.css";
import "./index.css";

import React from "react";
import ReactDOM from "react-dom";
import { Route, Switch } from "react-router";
import { HashRouter } from "react-router-dom";

import Send from "./Send";
import Sign from "./Sign";
import Start from "./Start";
import Status from "./Status";

ReactDOM.render(
  <HashRouter>
    <Switch>
      <Route exact path="/send" component={Send} />
      <Route path="/status" component={Status} />
      <Route path="/sign" component={Sign} />
      <Route path="/" component={Start} />
    </Switch>
  </HashRouter>,
  document.getElementById("root"),
);
