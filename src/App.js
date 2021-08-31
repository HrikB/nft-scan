import "./App.css";
import SearchResult from "./SearchResult";
import Search from "./Search";
import Home from "./Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Search />
        <Switch>
          <Route path="/:walletAddr">
            <SearchResult />
          </Route>
          <Home />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
