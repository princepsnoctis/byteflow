import {createContext} from "react";
import SettingsContextType from "./SettingsContextType.tsx";

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export default SettingsContext;