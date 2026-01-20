import "./index.scss"
// @ts-ignore
import Maximize from '../../assets/icons/maximize.svg?react';
import {getCurrentWindow} from "@tauri-apps/api/window";

function ButtonWindowMaximize() {
    const handleMaximize = async () => {
        const window = getCurrentWindow();

        if (await window.isMaximized()) {
            window.unmaximize();
        } else {
            window.maximize();
        }
    };

    return (
        <div className="button-window-maximize" onClick={handleMaximize}>
            <Maximize className="button-window-maximize__icon"/>
        </div>
    )
}

export default ButtonWindowMaximize;