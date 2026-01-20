import {useContext} from "react";
import SendContext from "./SendContext.tsx";

function useSend() {
    const sendContext = useContext(SendContext);

    if (!sendContext) {
        throw new Error("useSend must be used within a SendProvider");
    }

    return sendContext;
}

export {useSend};