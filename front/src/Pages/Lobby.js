import {useLocation} from "react-router";
import {keyframes, Paper} from "@mui/material";
import {styled} from "@mui/material/styles";
import React, {useState} from "react";
import CreateGameDialog from "../Components/CreateGameDialog";

import {fadeInDown} from 'react-animations';
import {connect} from "react-redux";

const animation = keyframes`${fadeInDown}`;

const StyleWrapper = styled(Paper)(
    ({theme}) => ({
        margin: "3em 5vw 0 5vw",
        backgroundColor: theme.background.level2,
        animation: `0.5s ${animation}`,
        padding : "5em",

        '@media (max-aspect-ratio : 10/9)': {
            width: "90vw",
            margin: "auto",
            marginTop: "5em",
        }
    }));


function Lobby(props) {
    const location = useLocation()
    const [createOpen, setCreateDialog] = useState(false)

    return <StyleWrapper elevation={16}>
        {props.lobby.rooms?.map(room => <p>{JSON.stringify(room)}</p>)}

        <CreateGameDialog open={createOpen} onClose={() => setCreateDialog(false)}/>
    </StyleWrapper>
}

export default connect(state => ({
    lobby: state.lobby
}))(Lobby)
