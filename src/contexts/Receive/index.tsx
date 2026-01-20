import {useContext} from "react";
import ReceiveContext from "./ReceiveContext.tsx";

function useReceive() {
    const receiveContext = useContext(ReceiveContext);

    if (!receiveContext) {
        throw new Error("useReceive must be used within a ReceiveProvider");
    }

    return receiveContext;
}

export {useReceive};