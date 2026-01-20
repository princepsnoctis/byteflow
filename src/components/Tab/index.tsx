import {useSettings} from "../../contexts/Settings";
import "./index.scss"
import {NavLink} from "react-router-dom";

interface TabProps {
    title: string;
    path: string;
}

function Tab({title, path}: TabProps) {
    const {port} = useSettings();

    const status = port === null ? "disconnected" : "connected";

    return (
        <NavLink className={({isActive}) => `tab tab--${status} ${isActive ? "tab--active" : ""}`} to={path}>
            <div className="tab__title">{title}</div>
        </NavLink>
    )
}

export default Tab;