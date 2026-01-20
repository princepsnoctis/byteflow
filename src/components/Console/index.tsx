import {Fragment, useEffect, useRef} from "react";
import "./index.scss";
import {useReceive} from "../../contexts/Receive";
import Format from "../../models/Format.ts";
import Log from "../../models/Log.ts";

function Console() {
    const {logs, format, searchPhrase} = useReceive();
    const consoleEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (consoleEndRef.current) {
            consoleEndRef.current.scrollIntoView({behavior: "smooth"});
        }
    }, [logs]);

    const getLogText = (log: Log, currentFormat: Format): string => {
        switch (currentFormat) {
            case Format.Utf8:
                return log.utf8;
            case Format.Ascii:
                return log.ascii;
            case Format.Hex:
                return log.hex;
            default:
                return log.utf8;
        }
    };

    return (
        <div className="console">
            {logs.map((log, index) => {
                const logText = getLogText(log, format);
                const parts = searchPhrase ? logText.split(searchPhrase) : [logText];

                return (
                    <div className="console__line" key={index}>
                        {parts.map((part, partIndex) => (
                            <Fragment key={`${index}-${partIndex}`}>
                                {part}
                                {searchPhrase && partIndex < parts.length - 1 && (
                                    <span className="console__marked">{searchPhrase}</span>
                                )}
                            </Fragment>
                        ))}
                    </div>
                );
            })}
            <div ref={consoleEndRef}/>
        </div>
    );
}

export default Console;
