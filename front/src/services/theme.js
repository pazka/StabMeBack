import {ThemeProvider} from "@mui/material";
import {useState} from "react";
import {On, sub} from "./events";
import {connect} from "react-redux";

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
            primary : "#13202A",
            secondary : "#140F00",
            disabled : "#37374a"
        },
        primary: {
            main: "#46769B",
        },
        secondary: {
            main: "#fcca46",
        },
        disabled : {
            main : "#C6DBE7"
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
            primary : "#ABC5D9",
            secondary : "#FEC29A",
            disabled : "#37374a"
        },
        primary: {
            main: "#6494B9",
        },
        secondary: {
            main: "#8D4E01",
        },
        disabled : {
            main : "#1A2C38"
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


function StabMeBackPalette(props) {
    const themes = [themeWhite,themeBlack]
    
    return (
        <ThemeProvider theme={themes[props.userPref.theme]}>
            {props.children}
        </ThemeProvider>
    );
}

export default connect(state => ({
    userPref: state.userPref,
}))(StabMeBackPalette)