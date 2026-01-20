import './index.scss';
// @ts-ignore
import Close from '../../assets/icons/close.svg?react';
import {getCurrentWindow} from '@tauri-apps/api/window';

function ButtonWindowClose() {
    const handleClose = () => {
        const window = getCurrentWindow();

        window.close();
    };

    return (
        <div className="button-window-close" onClick={handleClose}>
            <Close className="button-window-close__icon"/>
        </div>
    );
}

export default ButtonWindowClose;
