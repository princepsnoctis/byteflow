import Newline from "../../models/Newline.ts";

interface SendContextType {
    newline: Newline,
    bytesSent: number,
    setNewline: (newline: Newline) => void,
    send: (message: string) => void,
}

export default SendContextType;
