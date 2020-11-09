import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Main from "./components/Main";
import Footer from "./components/Footer";
import Single from "./components/Single";
import Keyboard from "./components/Keyboard";
import Pack from "./components/Pack";

const App = () => {
  console.log("started");
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          {console.log("going")}
          <Main />
          <Footer />
        </Route>
        <Route path="/single" exact>
          <Single />
          <Footer />
        </Route>
        <Route path="/keyboard" exact>
          <Keyboard />
          <Footer />
        </Route>
        <Route path="/showPack" exact>
          <Pack />
          <Footer />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
