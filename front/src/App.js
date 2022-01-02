import './App.css';
import {useLocation} from "react-router";
import {Route} from "react-router-dom";
import Lobby from "./Pages/Lobby";
import Game from "./Pages/Game";
import React from "react";
import MenuBar from "./Components/MenuBar";
import {styled} from '@mui/material/styles';

const StyleWrapper = styled("div")(
    ({theme}) => `
  background-color: ${theme.background.level1};
  height : 100vh;
  overflow : hidden;
  width : 100%;
  color : ${theme.palette.text.main};
  
  svg : {
    fill : ${theme.palette.text.main};
  }
`,
);


function App(props) {
    const location = useLocation()

    return <StyleWrapper>
        <MenuBar/>
        <div>
            <Route path="/" render={() => <Lobby/>}/>
            <Route path="/:roomId" render={(props) => <Game roomId={props.match.params.roomId}/>}/>
        </div>
    </StyleWrapper>
}

export default App;
