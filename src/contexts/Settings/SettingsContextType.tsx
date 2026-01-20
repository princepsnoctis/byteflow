import Config from "../../models/Config.ts";
import DataBits from "../../models/DataBits.ts";
import StopBits from "../../models/StopBits.ts";
import Parity from "../../models/Parity.ts";
import BaudRate from "../../models/BaudRate.ts";

interface SettingsContextType {
    ports: string[],
    port: number | null,
    config: Config,
    customBaudRate: string,
    rescan: () => void,
    connect: (port: number) => void,
    disconnect: () => void,
    setBaudRate: (baudRate: BaudRate) => void,
    setDataBits: (dataBits: DataBits) => void,
    setStopBits: (stopBits: StopBits) => void,
    setParity: (parity: Parity) => void,
    changeCustomBaudRate: (customBaudRate: string) => void,
    submitCustomBaudRate: (customBaudRate: string) => void,
}

export default SettingsContextType;
