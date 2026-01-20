import {useEffect, useState} from "react";
import "./index.scss";
// @ts-ignore
import ArrowDown from "../../assets/icons/arrow_down.svg?react";

interface DropdownProps {
    options: string[];
    selected: number | null;
    onSelect: (option: number) => void;
}

function Dropdown({options, selected, onSelect}: DropdownProps) {
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        setExpanded(false);
    }, [options, selected])

    const toggleExpanded = () => {
        if (options.length === 0) return;

        setExpanded(prev => !prev);
    }

    return (
        <div
            className={`dropdown ${expanded ? "dropdown--expanded" : ""} ${options.length === 0 ? "dropdown--disabled" : ""}`}>
            <div className="dropdown__header" onClick={toggleExpanded}>
                <div className="dropdown__text">{selected === null ? "Select" : options[selected]}</div>
                <ArrowDown className="dropdown__icon"></ArrowDown>
            </div>
            {expanded && (
                <div className="dropdown__menu">
                    {options.map((option, index) => (
                        (index !== selected) && (
                            <>
                                <div className="dropdown__item" onClick={() => {
                                    onSelect(index);
                                    setExpanded(false)
                                }} key={index}>{option}</div>
                            </>
                        )
                    ))}
                </div>
            )}
        </div>
    );
}

export default Dropdown;