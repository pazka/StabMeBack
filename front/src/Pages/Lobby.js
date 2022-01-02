import {useLocation} from "react-router";
import {Button, keyframes, Paper} from "@mui/material";
import {styled} from "@mui/material/styles";
import React, {useState} from "react";
import CreateGameDialog from "../Components/CreateGameDialog";

import {fadeInDown} from 'react-animations';
import {connect} from "react-redux";
import LoadingSpinner from "../Components/Commons/LoadingSpinner";
import {t} from "i18next";

const animation = keyframes`${fadeInDown}`;

const StyleWrapper = styled(Paper)(
    ({theme}) => ({
        margin: "3em 5vw 0 5vw",
        backgroundColor: theme.background.level2,
        animation: `0.5s ${animation}`,
        padding: "5em",
        display: "flex",

        ".menu": {
            width : "60%"
        },
        ".game-list": {
            width : "40%",
            height : "70vh"
        },

        '@media (max-aspect-ratio : 10/9)': {
            width: "90vw",
            margin: "auto",
            marginTop: "5em",
            display: "inherit",
            
            ".game-list": {
                width : "40%",
                height : "50vh",
                display : "block"
            },
        },
    }));


function Lobby(props) {
    const location = useLocation()
    const [createOpen, setCreateDialog] = useState(false)
    function GameList() {
        return <div>
            <LoadingSpinner id={"rooms"}/>
            {props.lobby.rooms?.map((room,i) => <p key={i}>{JSON.stringify(room)}</p>)}
        </div>
    }

    return <StyleWrapper elevation={16}>
        <div className={"menu"}>
            <Button color={"primary"} variant={"contained"}>{t("TEST1")}</Button>
            <Button color={"primary"} variant={"contained"} >{t("TESTi.ok")}</Button>
            <p>{t("mdr")}</p>
        </div>
        <GameList className={"game-list"}/>
        <CreateGameDialog open={createOpen} onClose={() => setCreateDialog(false)}/>
    </StyleWrapper>
}

export default connect(state => ({
    lobby: state.lobby
}))(Lobby)
