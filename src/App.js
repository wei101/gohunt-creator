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

const AppBox = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  display: flex; 
  flex-direction: column;
`

function App() {
  
  return (
    <AppBox>
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
    </AppBox>
  );
}

export default App;
