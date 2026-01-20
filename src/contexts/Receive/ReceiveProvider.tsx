import {useEffect, useState} from "react";
import ReceiveContext from "./ReceiveContext.tsx";
import Format from "../../models/Format.ts";
import {listen} from "@tauri-apps/api/event";
import {invoke} from "@tauri-apps/api/core";
import Log from "../../models/Log.ts";
import {save} from '@tauri-apps/plugin-dialog';

function ReceiveProvider({children}: { children: React.ReactNode }) {
    const [logs, setLogs] = useState<Log[]>([]);

    const [format, setFormat] = useState<Format>(() => {
        const savedFormat = localStorage.getItem('format');

        return savedFormat ? savedFormat as Format : Format.Utf8;
    });

    const [logging, setLogging] = useState(false);

    const [bytesReceived, setBytesReceived] = useState(0);

    const [searchPhrase, setSearchPhrase] = useState("");

    useEffect(() => {
        localStorage.setItem('format', format);
    }, [format]);

    useEffect(() => {
        const unlisten = listen("serial-data", (event: { payload: { data: Log, bytes: number } }) => {
            setLogs((prev) => [...prev, event.payload.data]);

            setBytesReceived(prev => prev + event.payload.bytes)
        });

        return () => {
            unlisten.then(unlisten => unlisten());
        };
    }, [format]);

    const clear = () => {
        setLogs([]);
    }

    const toggleLogging = async () => {
        if (logging) {
            invoke("stop_logging");

            setLogging(false);
        } else {
            const filePath = await save({
                filters: [{name: 'Text File', extensions: ['txt']}],
                defaultPath: '.txt'
            })

            if (filePath) {
                invoke("start_logging", {filePath});

                setLogging(true);
            } else {
                setLogging(false);
            }
        }
    }

    return (
        <ReceiveContext.Provider value={{
            logs,
            format,
            logging,
            bytesReceived,
            searchPhrase,
            clear,
            toggleLogging,
            setFormat,
            setSearchPhrase
        }}>
            {children}
        </ReceiveContext.Provider>
    )
}

export default ReceiveProvider;