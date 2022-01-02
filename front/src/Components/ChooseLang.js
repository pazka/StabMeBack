import {Button, Menu, MenuItem} from "@mui/material";
import {AvailableTranslations} from "../services/traduction";
import {useState} from "react";
import {setLang} from "../services/redux/reducers/userPrefSlice";
import {changeLang} from "../services/effects/userPrefEffects";

const {connect} = require("react-redux");

function ChooseLang(props){
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    function selectLang(ln){
        props.dispatch(changeLang(ln))
        handleClose()
    }
    
    return <div>
        <Button
            id="basic-button"
            color={"primary"}
            variant ={"outline"}
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
        >
            {props.userPref.lang}
        </Button>
        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
        >{
            AvailableTranslations.map((lng,i)=> (<MenuItem key={i} onClick={()=>selectLang(lng)}>{lng}</MenuItem>))
        }
        </Menu>
    </div>
}

export default connect(state =>({
    userPref : state.userPref
}),null)(ChooseLang)
