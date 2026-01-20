import {createContext} from "react";
import ReceiveContextType from "./ReceiveContextType.tsx";

const ReceiveContext = createContext<ReceiveContextType | undefined>(undefined);

export default ReceiveContext;