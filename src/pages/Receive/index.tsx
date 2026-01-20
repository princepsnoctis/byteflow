import "./index.scss"
import Row from "../../components/Row";
import Column from "../../components/Column";
import Section from "../../components/Section";
import Button from "../../components/Button";
import ButtonState from "../../components/ButtonState";
import Console from "../../components/Console";
import {useReceive} from "../../contexts/Receive";
import Format from "../../models/Format.ts";
import {useSettings} from "../../contexts/Settings";
import TextFieldText from "../../components/TextFieldText";

function Receive() {
    const {format, logging, searchPhrase, setSearchPhrase, clear, toggleLogging, setFormat} = useReceive();
    const {port} = useSettings();

    return (
        <main className={`main ${port === null ? "main--disconnected" : "main--connected"}`}>
            <div className="main__inner main__inner--flex">
                <Column gap={8}>
                    <Row gap={8}>
                        <Section title="Control">
                            <Row gap={4}>
                                <Button text="Clear" onClick={clear}/>
                                <ButtonState text={logging ? "Stop" : "Record"} active={logging} onClick={toggleLogging}/>
                            </Row>
                        </Section>

                        <Section title="Format">
                            <Row gap={4}>
                                {Object.values(Format).map((value, index) => (
                                    <ButtonState text={value.toString()} active={value === format}
                                                 onClick={() => setFormat(value)} key={index}/>
                                ))}
                            </Row>
                        </Section>
                    </Row>

                    <Console/>

                    <Row>
                        <TextFieldText value={searchPhrase} placeholder={"Search"} onChange={setSearchPhrase}/>
                    </Row>
                </Column>
            </div>
        </main>
    )
}

export default Receive;