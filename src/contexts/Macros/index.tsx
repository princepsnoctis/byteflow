import {useContext} from "react";
import MacrosContext from "./MacrosContext.tsx";

function useMacros() {
    const macrosContext = useContext(MacrosContext);

    if (!macrosContext) {
        throw new Error("useMacros must be used within a MacrosProvider");
    }

    return macrosContext;
}

export {useMacros};