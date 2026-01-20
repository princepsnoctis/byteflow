import "./index.scss"
import Tab from "../Tab";
import ButtonWindowClose from "../ButtonWindowClose";
import ButtonWindowMinimize from "../ButtonWindowMinimize";
import ButtonWindowMaximize from "../ButtonWindowMaximize";

function Navigator() {
    return (
        <nav className="navigator">
            <div className="navigator__group navigator__group--left">
                <Tab title="Options" path="/"/>
                <div className="navigator__divider"></div>
                <Tab title="Receive" path="/receive"/>
                <div className="navigator__divider"></div>
                <Tab title="Transmit" path="/send"/>
                <div className="navigator__divider"></div>
                <Tab title="Macros" path="/macros"/>
            </div>
            <div className="navigator__group navigator__group--right">
                <ButtonWindowMinimize/>
                <ButtonWindowMaximize/>
                <ButtonWindowClose/>
            </div>
        </nav>
    )
}

export default Navigator;
