import "./index.scss"
import {getCurrentWindow} from "@tauri-apps/api/window";
// @ts-ignore
import Minimize from '../../assets/icons/minimize.svg?react';

function ButtonWindowMinimize() {
    const handleMinimize = () => {
        const window = getCurrentWindow();

        window.minimize();
    };

    return (
        <div className="button-window-minimize" onClick={handleMinimize}>
            <Minimize className="button-window-minimize__icon"/>
        </div>
    )
}

export default ButtonWindowMinimize;