import "./App.css";
import SearchResult from "./SearchResult";
import Search from "./Search";
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
        </Switch>
      </Router>
    </div>
  );
}

export default App;
