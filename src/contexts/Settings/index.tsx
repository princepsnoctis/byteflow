import {useContext} from "react";
import SettingsContext from "./SettingsContext.tsx";

function useSettings() {
    const settingsContext = useContext(SettingsContext);

    if (!settingsContext) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }

    return settingsContext;
}

export {useSettings};