import {ReactNode, useEffect, useState} from "react";
import SettingsContext from "./SettingsContext.tsx";
import Config from "../../models/Config.ts";
import DataBits from "../../models/DataBits.ts";
import StopBits from "../../models/StopBits.ts";
import Parity from "../../models/Parity.ts";
import BaudRate from "../../models/BaudRate.ts";
import {invoke} from "@tauri-apps/api/core";

function SettingsProvider({children}: { children: ReactNode }) {
    const [ports, setPorts] = useState<string[]>([]);
    const [port, setPort] = useState<number | null>(null);

    const [config, setConfig] = useState<Config>(() => {
        const savedBaudRate = localStorage.getItem('baudRate');
        const savedDataBits = localStorage.getItem('dataBits');
        const savedStopBits = localStorage.getItem('stopBits');
        const savedParity = localStorage.getItem('parity');

        return {
            baudRate: savedBaudRate ? savedBaudRate as BaudRate : BaudRate._9600,
            dataBits: savedDataBits ? savedDataBits as DataBits : DataBits.Eight,
            stopBits: savedStopBits ? savedStopBits as StopBits : StopBits.One,
            parity: savedParity ? savedParity as Parity : Parity.None,
        };
    });

    const [customBaudRate, setCustomBaudRate] = useState<string>("");

    useEffect(() => {
        rescan()
    }, []);

    const rescan = () => {
        invoke("get_available_ports").then((ports) => {
            setPorts(ports as string[]);

            setPort(null);
        });
    }

    const connect = (port: number) => {
        invoke("connect", {path: ports[port]}).then(() => {
            setPort(port);

            invoke("read");
        });
    }

    const disconnect = () => {
        invoke("disconnect").then(() => {
            setPort(null);
        });
    }

    const setBaudRate = (baudRate: BaudRate | number) => {
        invoke("set_baud_rate", {baudRate: +baudRate.toString()}).then(() => {
            setConfig({...config, baudRate});

            localStorage.setItem('baudRate', baudRate.toString());

            setCustomBaudRate("");

            if (port === null) return;

            invoke("connect", {path: ports[port]});
        });
    }

    const setDataBits = (dataBits: DataBits) => {
        invoke("set_data_bits", {dataBits: dataBits.toString()}).then(() => {
            setConfig({...config, dataBits});
            // Save to localStorage
            localStorage.setItem('dataBits', dataBits.toString());

            if (port === null) return;

            invoke("connect", {path: ports[port]});
        });
    }

    const setStopBits = (stopBits: StopBits) => {
        invoke("set_stop_bits", {stopBits: stopBits.toString()}).then(() => {
            setConfig({...config, stopBits});
            localStorage.setItem('stopBits', stopBits.toString());

            if (port === null) return;

            invoke("connect", {path: ports[port]});
        });
    }

    const setParity = (parity: Parity) => {
        invoke("set_parity", {parity: parity.toString()}).then(() => {
            setConfig({...config, parity});
            localStorage.setItem('parity', parity.toString());

            if (port === null) return;

            invoke("connect", {path: ports[port]});
        });
    }


    const changeCustomBaudRate = (customBaudRate: string) => {
        if (customBaudRate.length > 9) return;

        setCustomBaudRate(customBaudRate);
    }

    const submitCustomBaudRate = (customBaudRate: string) => {
        if (customBaudRate.length > 9) return;

        if (isNaN(Number(customBaudRate))) return;

        setBaudRate(Number(customBaudRate));
    }

    return (
        <SettingsContext.Provider
            value={{
                ports,
                port,
                config,
                customBaudRate,
                rescan,
                connect,
                disconnect,
                setBaudRate,
                setDataBits,
                setStopBits,
                setParity,
                changeCustomBaudRate,
                submitCustomBaudRate
            }}>
            {children}
        </SettingsContext.Provider>
    )
}

export default SettingsProvider;