import React from "react";

import {withStyles} from "@material-ui/core/styles";
import {CircularProgress} from "@material-ui/core";
import {isLoading} from "./Notifier";
import {connect} from "react-redux";
import {styled} from "@mui/material/styles";


const StyleWrapper = styled('div')(
    ({theme}) => ({
        basicLoading: {
            position: 'absolute',

            '& > *': {
                width: '4em',
                height: '4em',
                position: 'relative',
            }
        },
        fullscreen: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: '0',
            left: '0',
            backgroundColor: 'rgba(0,0,0,0.3)',

            '& > *': {
                margin: '20%'
            }
        },
        corner: {
            width: 'auto',
            height: 'auto',
            right: '0px',
            top: '0px',
            position: 'absolute',

            '& > *': {
                width: '10vw',
                height: '10vw',
                filter: 'drop-shadow(30px 10px 4px #4444dd)'
            }
        }
    }))

function LoadingSpinner(props) {
    const classes = props.classes || "";

    if (props.id && !props.loadings[props.id]) 
        return null;

    let className = classes.basicLoading
    if (props.isFullscreen)
        className = classes.fullscreen
    else if (props.isCorner)
        className = classes.corner

    let size = 40
    if (props.isFullscreen)
        size = 400
    else if (props.isCorner)
        size = 100

    return <StyleWrapper className={className}>
        <CircularProgress size={size}/>
    </StyleWrapper>
}

export default connect(store => {
    return {
        loadings: store.loadings,
    };
})(LoadingSpinner);
