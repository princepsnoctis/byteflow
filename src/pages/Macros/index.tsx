import "./index.scss"
import {useSettings} from "../../contexts/Settings";
import Column from "../../components/Column";
import Row from "../../components/Row";
import TextFieldText from "../../components/TextFieldText";
import Button from "../../components/Button";
import {useMacros} from "../../contexts/Macros";
import Section from "../../components/Section";
import {useState} from "react";

function Macros() {
    const {port} = useSettings();
    const {macros, createMacro, updateMacro, deleteMacro, importMacros, exportMacros} = useMacros();
    const [name, setName] = useState("");
    const [command, setCommand] = useState("");

    return (
        <main className={`main ${port === null ? "main--disconnected" : "main--connected"}`}>
            <div className="main__inner">
                <Column gap={8}>
                    <Row>
                        <Section title="Macros">
                            <Column gap={4}>
                                <Row gap={4}>
                                    <TextFieldText value={name} placeholder={"Name"} onChange={(value) => {
                                        if (value.length <= 12) setName(value);
                                    }}/>

                                    <Column flex={4}>
                                        <Row>
                                            <TextFieldText value={command} placeholder={"Command"}
                                                           onChange={setCommand}/>
                                        </Row>
                                    </Column>

                                    <Button text="Create" onClick={() => {
                                        createMacro({name, command});
                                        setName("");
                                        setCommand("");
                                    }}/>
                                </Row>
                                {macros.map((macro, index) => (
                                    <Row gap={4} key={index}>
                                        <TextFieldText value={macro.name} placeholder={"Name"}
                                                       onChange={(name) => updateMacro(index, {...macro, name})}/>

                                        <Column flex={4}>
                                            <Row>
                                                <TextFieldText value={macro.command} placeholder={"Command"}
                                                               onChange={(command) => updateMacro(index, {
                                                                   ...macro,
                                                                   command
                                                               })}/>
                                            </Row>
                                        </Column>

                                        <Button text="Delete" onClick={() => deleteMacro(index)}/>
                                    </Row>
                                ))}
                            </Column>
                        </Section>
                    </Row>

                    <Row gap={4}>
                        <Button text="Import" onClick={importMacros}/>
                        <Button text="Export" onClick={exportMacros}/>
                    </Row>
                </Column>
            </div>
        </main>
    )
}

export default Macros;
