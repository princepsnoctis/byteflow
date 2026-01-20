import DataBits from "./DataBits.ts";
import StopBits from "./StopBits.ts";
import Parity from "./Parity.ts";
import BaudRate from "./BaudRate.ts";

interface Config {
    baudRate: BaudRate | number;
    dataBits: DataBits;
    stopBits: StopBits;
    parity: Parity;
}

export default Config;