import "./index.scss"
import Row from "../../components/Row";
import Column from "../../components/Column";
import Section from "../../components/Section";
import Button from "../../components/Button";
import ButtonState from "../../components/ButtonState";
import TextFieldText from "../../components/TextFieldText";
import Newline from "../../models/Newline.ts";
import {useSend} from "../../contexts/Send";
import {useState} from "react";
import {useSettings} from "../../contexts/Settings";
import {useMacros} from "../../contexts/Macros";

function Send() {
    const [text, setText] = useState("");
    const {port} = useSettings();
    const {newline, setNewline, send} = useSend();
    const {macros} = useMacros();

    return (
        <main className={`main ${port === null ? "main--disconnected" : "main--connected"}`}>
            <div className="main__inner">
                <Column gap={8}>
                    <Row gap={8}>
                        <Section title="Message">
                            <Row gap={4}>
                                <TextFieldText value={text} placeholder="Text" disabled={port === null} onChange={setText} onSubmit={() => {
                                    send(text);
                                    setText("")
                                }}/>
                            </Row>
                        </Section>

                        <Section title="Newline">
                            <Row gap={4}>
                                {Object.values(Newline).map((value, index) => (
                                    <ButtonState text={value.toString()} active={value === newline}
                                                 onClick={() => setNewline(value)} key={index}/>
                                ))}
                            </Row>
                        </Section>
                    </Row>

                    {macros.length !== 0 && (
                        <Section title="Macros">
                            <Column gap={4}>
                                {Array.from({length: Math.ceil(macros.length / 6)}).map((_, rowIndex) => {
                                    const startIndex = rowIndex * 6;
                                    const rowMacros = macros.slice(startIndex, startIndex + 6);
                                    const emptySlots = 6 - rowMacros.length;

                                    return (
                                        <Row gap={4} key={rowIndex}>
                                            {rowMacros.map((macro, index) => (
                                                <Button
                                                    text={macro.name}
                                                    onClick={() => send(macro.command)}
                                                    disabled={port === null}
                                                    key={startIndex + index}
                                                />
                                            ))}
                                            {emptySlots > 0 &&
                                                Array(emptySlots)
                                                    .fill(0)
                                                    .map((_, i) => (
                                                        <Button text="" disabled={true}
                                                                key={`empty-${startIndex + i}`}/>
                                                    ))}
                                        </Row>
                                    );
                                })}
                            </Column>
                        </Section>
                    )}
                </Column>
            </div>
        </main>
    )
}

export default Send;