import {createContext} from "react";

import MacrosContextType from "./MacrosContextType.tsx";

const MacrosContext = createContext<MacrosContextType | undefined>(undefined);

export default MacrosContext;