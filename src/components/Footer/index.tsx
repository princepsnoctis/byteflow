import "./index.scss"
import {useSettings} from "../../contexts/Settings";
import {useSend} from "../../contexts/Send";
import {useReceive} from "../../contexts/Receive";

function Footer() {
    const {ports, port, config} = useSettings();
    const {bytesReceived} = useReceive();
    const {bytesSent} = useSend();
    const {parity, stopBits, dataBits, baudRate} = config;

    const status = port === null ? "disconnected" : "connected";

    return (
        <footer className={`footer footer--${status}`}>
            <div className="footer__stats">
                <div className={`footer__status footer__status--${status}`}></div>
                {port !== null ? <div className="footer__stat">{ports[port]}</div> : ""}
                <div className="footer__stat">Baud rate: {baudRate}</div>
                <div className="footer__stat">Data bits: {dataBits}</div>
                <div className="footer__stat">Stop bits: {stopBits}</div>
                <div className="footer__stat">Parity: {parity}</div>
            </div>
            <div className="footer__stats">
                <div className="footer__stat">Bytes received: {bytesReceived}B</div>
                <div className="footer__stat">Bytes sent: {bytesSent}B</div>
            </div>
        </footer>
    )
}

export default Footer;