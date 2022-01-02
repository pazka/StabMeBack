import {ThemeProvider} from "@mui/material";
import {useState} from "react";
import {On, sub} from "./events";

const {createTheme} = require("@mui/material");

//from https://coolors.co/233d4d-fe7f2d-fcca46-a1c181-619b8a

const themeWhite = createTheme({
    background:{
        level1 : "#F1F6F9",
        level2 : "#C6DBE7",
        level3 : "#A9C8DB",
        level4 : "#8CB5CF"
    },
    palette: {
        text : {
            main : "#13212A"
        },
        primary: {
            main: "#578EB2",
        },
        secondary: {
            main: "#fcca46",
        },
        error: {
            main: "#fe7f2d"
        },
        warning: {
            main: "#fcca46"
        },
        info: {
            main: "#a1c181"
        },
        success: {
            main: "#619b8a"
        }
    }
});

const themeBlack = createTheme({
    background:{
        level1 : "#060B0E",
        level2 : "#12212B",
        level3 : "#1E3748",
        level4 : "#2A4D65"
    },
    palette: {
        text : {
            main : "#E3ECF2"
        },
        primary: {
            main: "#81AAC5",
        },
        secondary: {
            main: "#8D4E01",
        },
        error: {
            main: "#8E3901"
        },
        warning: {
            main: "#8D4E01"
        },
        info: {
            main: "#6D6722"
        },
        success: {
            main: "#3F6459"
        }
    }
});


export default function StabMeBackPalette(props) {
    const themes = [themeWhite,themeBlack]
    let [themeId,setTheme] = useState(0)
    
    sub(On.ui_changeTheme,"themeComponent",()=>setTheme(themeId ? 0 : 1))
    
    return (
        <ThemeProvider theme={themes[themeId]}>
            {props.children}
        </ThemeProvider>
    );
}