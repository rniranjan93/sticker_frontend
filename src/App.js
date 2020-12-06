import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Main from "./components/home/Main";
import Footer from "./components/footer/Footer";
import Single from "./components/newSticker/Single";
import Keyboard from "./components/keyboard/Keyboard";

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
      </Switch>
    </Router>
  );
};

export default App;
