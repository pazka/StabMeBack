import {useLocation} from "react-router";
import MouseDisplay from "../Components/MouseDisplay";
import {On,send} from "../services/events";
import SocketIOService from "../services/socket"


function Game(props) {
    const roomId = props.roomId
    const location = useLocation()
    //send(On.snd_join,roomId)

    return <div>
        <MouseDisplay/>
        <p>Game {roomId}</p>
    </div>;
}

export default Game;
