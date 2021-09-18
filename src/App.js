import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Home from './pages/Home';
import Creator from './pages/Creator';
import Navigator from './components/Navigator';
import styled from 'styled-components';

function App() {

  const App = styled.div`
    position: relative;
    width: 100%;
    height: 100vh;
    & > div:last-child {
      padding-top: 5rem;
      position:absolute;
      top:0;
      right:0;
      bottom:0;
      left:0;
    }
  `

  return (
    <App>
      <Navigator />
      <Router>
        <Switch>
          <Route path="/creator">
            <Creator />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </App>
  );
}

export default App;
