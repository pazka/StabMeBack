import {SnackbarProvider, useSnackbar} from "notistack";
import {On, sub} from "../../../services/events";

function Notifier (props) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    
    sub(On.ui_notify,"notifier",(notif)=>{
        let messageToDisplay = 
            (notif.options.startText ? notif.options.startText : '') 
            + (notif.message) 
            + (notif.options.endText ? notif.options.endText : '');
        
        if(notif.options.autoTimeout ){
            notif.options.autoHideDuration = Math.max(messageToDisplay.split(" ").length * 300, 1500);
        }

        //in place of a better solution
        delete notif.options.autoTimeout
        delete notif.options.startText
        delete notif.options.endText

        enqueueSnackbar(messageToDisplay,notif.options );
    })
    
    return null
}

function WrappedNotifier(){
    return <SnackbarProvider maxSnack={5} preventDuplicate>
        <Notifier />
    </SnackbarProvider>
}

export default WrappedNotifier;
