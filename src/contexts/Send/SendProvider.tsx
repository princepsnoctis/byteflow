import {useEffect, useState} from "react";
import SendContext from "./SendContext.tsx";
import Newline from "../../models/Newline.ts";
import {invoke} from "@tauri-apps/api/core";

function SendProvider({children}: { children: React.ReactNode }) {
    const [newline, setNewline] = useState<Newline>(() => {
        const newline = localStorage.getItem('newline');

        return newline ? newline as Newline : Newline.CR_NL;
    });

    const [bytesSent, setBytesSent] = useState(0);

    useEffect(() => {
        localStorage.setItem('newline', newline);
    }, [newline]);

    const send = (message: string) => {
        const newlineSymbol =
            newline === Newline.CR ? "\r" :
                newline === Newline.NL ? "\n" :
                    newline === Newline.CR_NL ? "\r\n" :
                        "\n\r";

        invoke("send", {message: `${message}${newlineSymbol}`}).then((bytesSent) => {
            setBytesSent(prev => prev + (bytesSent as number));
        });
    }

    return (
        <SendContext.Provider value={{newline, bytesSent, setNewline, send}}>
            {children}
        </SendContext.Provider>
    )
}

export default SendProvider;