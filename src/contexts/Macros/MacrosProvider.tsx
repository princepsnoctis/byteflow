import {ReactNode, useEffect, useState} from "react";
import MacrosContext from "./MacrosContext.tsx";
import Macro from "../../models/Macro.ts";
import {open, save} from '@tauri-apps/plugin-dialog';
import {readTextFile, writeTextFile} from "@tauri-apps/plugin-fs";

function MacrosProvider({children}: { children: ReactNode }) {
    const [macros, setMacros] = useState<Macro[]>(() => {
        const savedMacros = localStorage.getItem('macros');

        return savedMacros ? JSON.parse(savedMacros) : [];
    });

    useEffect(() => {
        localStorage.setItem('macros', JSON.stringify(macros));
    }, [macros]);

    const createMacro = (macro: Macro) => {
        setMacros(prev => [macro, ...prev]);
    }

    const deleteMacro = (index: number) => {
        setMacros(prev => [...prev.slice(0, index), ...prev.slice(index + 1)]);
    }

    const updateMacro = (index: number, macro: Macro) => {
        if (macro.name.length > 12) return;

        setMacros(prev => [...prev.slice(0, index), macro, ...prev.slice(index + 1)]);
    }

    const importMacros = async () => {
        const filePath = await open({
            filters: [{name: 'JSON File', extensions: ['json']}],
            multiple: false,
        });

        if (filePath) {
            const stringified = await readTextFile(filePath);

            const parsed = JSON.parse(stringified);

            setMacros(parsed);
        }
    }

    const exportMacros = async () => {
        const filePath = await save({
            filters: [{name: 'JSON File', extensions: ['json']}],
            defaultPath: '.json'
        });

        if (filePath) {
            const stringified = JSON.stringify(macros, null, 2);

            await writeTextFile(filePath, stringified);
        }
    }

    return (
        <MacrosContext.Provider value={{
            macros,
            createMacro,
            updateMacro,
            deleteMacro,
            importMacros,
            exportMacros
        }}>{children}</MacrosContext.Provider>
    )
}

export default MacrosProvider;