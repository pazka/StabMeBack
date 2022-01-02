import {AppBar, IconButton, Toolbar} from "@mui/material";
import ContrastIcon from '@mui/icons-material/Contrast';
import {On, send} from "../services/events";
import {connect} from "react-redux";
import {switchTheme} from "../services/effects/userPrefEffects";
import ChooseLang from "./ChooseLang";

function MenuBar(props) {
    return <AppBar position="static">
        <Toolbar>
            <IconButton onClick={()=>props.dispatch(switchTheme())}
                        variant={"contained"}>
                <ContrastIcon color={"text"}/>
            </IconButton>
            <ChooseLang/>
        </Toolbar>
    </AppBar>
}

export default connect(null,null)(MenuBar)