import {createContext} from "react";
import SendContextType from "./SendContextType.tsx";

const SendContext = createContext<SendContextType | undefined>(undefined);

export default SendContext;