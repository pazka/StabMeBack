import {AppBar, IconButton, Toolbar} from "@mui/material";
import ContrastIcon from '@mui/icons-material/Contrast';
import {On, send} from "../services/events";

export default function MenuBar() {
    const switchTheme = () => {
        send(On.ui_changeTheme)
    }
    return <AppBar position="static">
        <Toolbar>
            <IconButton onClick={switchTheme}
                        variant={"contained"}>
                <ContrastIcon color={"text"}/>
            </IconButton>
        </Toolbar>
    </AppBar>
}
