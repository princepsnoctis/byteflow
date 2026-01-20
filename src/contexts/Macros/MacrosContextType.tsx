import Macro from "../../models/Macro.ts";

interface MacrosContextType {
    macros: Macro[];
    createMacro: (macro: Macro) => void,
    updateMacro: (index: number, macro: Macro) => void,
    deleteMacro: (index: number) => void,
    importMacros: () => void,
    exportMacros: () => void,
}

export default MacrosContextType;
