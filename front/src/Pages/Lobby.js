import {useLocation} from "react-router";
import {keyframes, Paper} from "@mui/material";
import {styled} from "@mui/material/styles";
import React, {useState} from "react";
import CreateGameDialog from "../Components/CreateGameDialog";

import {fadeInDown} from 'react-animations';

const animation = keyframes`${fadeInDown}`;

const StyleWrapper = styled(Paper)(
    ({theme}) => ({
    margin : "5em 5vw 0 5vw",
    height : "80vh",
    backgroundColor : theme.background.level2,
    animation: `0.5s ${animation}`,
    
    '@media (max-aspect-ratio : 10/9)': { 
       width : "100vw "
    }
}));


function Lobby() {
    const location = useLocation()
    const [createOpen,setCreateDialog] = useState(false)

    return <StyleWrapper elevation={16} >
            <p>test</p>
            
        <CreateGameDialog open={createOpen} onClose={() => setCreateDialog(false)}/>
    </StyleWrapper>
}

export default Lobby;
