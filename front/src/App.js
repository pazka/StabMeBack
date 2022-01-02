import './App.css';
import {useLocation} from "react-router";
import {Route} from "react-router-dom";
import Lobby from "./Pages/Lobby";
import Game from "./Pages/Game";
import React from "react";
import MenuBar from "./Components/MenuBar";
import {styled} from '@mui/material/styles';
import Notifier from "./Components/Commons/Notifier";
import {connect} from "react-redux";

const StyleWrapper = styled("div")(
    ({theme}) => ({
        backgroundColor: theme.background.level1,
        height: "auto",
        minHeight: "100vh",
        width: "100%",
    }));

function App(props) {
    const location = useLocation()

    return <StyleWrapper>
        <MenuBar/>
        <div>
            <Route path="/" render={() => <Lobby/>}/>
            <Route path="/:roomId" render={(props) => <Game roomId={props.match.params.roomId}/>}/>
        </div>
        <Notifier/>
    </StyleWrapper>
}

export default connect(state=>({
    userPref : state.userPref
}))(App);
