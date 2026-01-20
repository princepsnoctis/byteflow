import "./index.scss"
import Section from "../../components/Section";
import Column from "../../components/Column";
import Row from "../../components/Row";
import Button from "../../components/Button";
import ButtonState from "../../components/ButtonState";
import Dropdown from "../../components/Dropdown";
import TextFieldNumber from "../../components/TextFieldNumber";
import Parity from "../../models/Parity.ts";
import StopBits from "../../models/StopBits.ts";
import DataBits from "../../models/DataBits.ts";
import BaudRate from "../../models/BaudRate.ts";
import {useSettings} from "../../contexts/Settings";

function Settings() {
    const {
        ports,
        port,
        config,
        customBaudRate,
        rescan,
        connect,
        disconnect,
        setBaudRate,
        setDataBits,
        setStopBits,
        setParity,
        changeCustomBaudRate,
        submitCustomBaudRate,
    } = useSettings();

    return (
        <main className={`main ${port === null ? "main--disconnected" : "main--connected"}`}>
            <div className="main__inner main__inner--flex">
                <Section title="Control">
                    <Column gap={4}>
                        <Row>
                            <Button text="Drop" onClick={disconnect}/>
                        </Row>
                        <Row>
                            <Button text="Scan" onClick={rescan}/>
                        </Row>
                    </Column>
                </Section>

                <Section title="Port">
                    <Column gap={4}>
                        <Row>
                            <Dropdown
                                options={ports}
                                selected={port}
                                onSelect={(option) => {
                                    connect(option)
                                }}
                            />
                        </Row>
                    </Column>
                </Section>

                <Section title="Baud rate" style={{flex: 3}}>
                    <Row gap={4}>
                        <Column gap={4}>
                            {Object.values(BaudRate).slice(0, 5).map((value, index) => (
                                <Row key={index}>
                                    <ButtonState text={value.toString()} active={value === config.baudRate}
                                                 onClick={() => setBaudRate(value)} key={index}/>
                                </Row>
                            ))}
                        </Column>
                        <Column gap={4}>
                            {Object.values(BaudRate).slice(5, 10).map((value, index) => (
                                <Row key={index}>
                                    <ButtonState text={value.toString()} active={value === config.baudRate}
                                                 onClick={() => setBaudRate(value)} key={index}/>
                                </Row>
                            ))}
                        </Column>
                        <Column gap={4}>
                            {Object.values(BaudRate).slice(10, 14).map((value, index) => (
                                <Row key={index}>
                                    <ButtonState text={value.toString()} active={value === config.baudRate}
                                                 onClick={() => setBaudRate(value)} key={index}/>
                                </Row>
                            ))}

                            <Row>
                                <TextFieldNumber value={customBaudRate} placeholder="Custom"
                                                 onChange={changeCustomBaudRate}
                                                 onSubmit={submitCustomBaudRate}/>
                            </Row>
                        </Column>
                    </Row>
                </Section>

                <Section title="Data bits">
                    <Column gap={4}>
                        {Object.values(DataBits).map((value, index) => (
                            <Row key={index}>
                                <ButtonState text={value.toString()} active={value === config.dataBits}
                                             onClick={() => setDataBits(value)} key={index}/>
                            </Row>
                        ))}
                    </Column>
                </Section>

                <Section title="Stop bits">
                    <Column gap={4}>
                        {Object.values(StopBits).map((value, index) => (
                            <Row key={index}>
                                <ButtonState text={value.toString()} active={value === config.stopBits}
                                             onClick={() => setStopBits(value)} key={index}/>
                            </Row>
                        ))}
                    </Column>
                </Section>

                <Section title="Parity">
                    <Column gap={4}>
                        {Object.values(Parity).map((value, index) => (
                            <Row key={index}>
                                <ButtonState text={value.toString()} active={value === config.parity}
                                             onClick={() => setParity(value)} key={index}/>
                            </Row>
                        ))}
                    </Column>
                </Section>
            </div>
        </main>
    )
}

export default Settings;