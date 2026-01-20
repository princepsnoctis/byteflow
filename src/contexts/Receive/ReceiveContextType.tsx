import Log from "../../models/Log.ts";
import Format from "../../models/Format.ts";

interface ReceiveContextType {
    logs: Log[],
    format: Format,
    logging: boolean,
    bytesReceived: number,
    searchPhrase: string,
    clear: () => void,
    toggleLogging: () => void,
    setFormat: (format: Format) => void,
    setSearchPhrase: (searchPhrase: string) => void,
}

export default ReceiveContextType;
