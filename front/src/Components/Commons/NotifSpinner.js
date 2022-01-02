import React, {PureComponent} from "react";
import PropTypes from "prop-types"
import {getTranslate} from "../../locales/localeUtils";

import {withStyles} from "@material-ui/core/styles";
import {CircularProgress} from "@material-ui/core";
import {isLoading} from "./Notifier";
import {connect} from "react-redux";


const styles = theme => ({
    basicLoading : {
        position : 'absolute',
        
        '& > *' : {
            width : '4em',
            height : '4em',
            position : 'relative',
        }
    },
    fullscreen : {
        position : 'absolute',
        width : '100%',
        height : '100%',
        top : '0',
        left : '0',
        backgroundColor : 'rgba(0,0,0,0.3)',
        
        '& > *' : { 
            margin: '20%'
        }
    },
    corner : {
        width : 'auto',
        height : 'auto',
        right : '0px',
        top : '0px',
        position : 'absolute',
        
        '& > *' : {
            width: '10vw',
            height: '10vw',
            filter: 'drop-shadow(30px 10px 4px #4444dd)'
        }
    }
})

class NovalixSpinnerComponent extends PureComponent {
    translate
    classes

    constructor(props) {
        super(props);

        this.state = {}

        this.translate = getTranslate(this.props.locale);
        this.classes = this.props.classes;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    render() {
        if(this.props.loadingId && !isLoading(this.props.loadingId)) return null;
        
        let className = this.classes.basicLoading
        if(this.props.isFullscreen)
            className = this.classes.fullscreen
        else if(this.props.isCorner)
            className = this.classes.corner
        
        let size = 40
        if(this.props.isFullscreen)
            size = 400
        else if(this.props.isCorner)
            size = 100
        
        return <div className={className}>
            <CircularProgress size={size}/>
        </div>
    }
}

NovalixSpinnerComponent.propTypes = {
    isFullscreen : PropTypes.bool,
    isCorner : PropTypes.bool,
    loadingId : PropTypes.string
};

NovalixSpinnerComponent.defaultProps = {};


const NovalixSpinner = withStyles(styles)(React.memo(NovalixSpinnerComponent))

export default connect(store => {
    return {
        loadings : store.loadings,
    };
})(NovalixSpinner);
