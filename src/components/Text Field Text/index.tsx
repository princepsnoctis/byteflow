import "./index.scss"

import {ChangeEventHandler} from "react";

interface TextFieldTextProps {
    value: string;
    placeholder: string;
    onChange?: (value: string) => void;
    onSubmit?: (value: string) => void;
}

function TextFieldText({value, placeholder, onChange, onSubmit}: TextFieldTextProps) {
    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        if (onChange) {
            onChange(event.target.value);
        }
    }

    const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
        if (onSubmit && event.key === "Enter") {
            onSubmit((event.target as HTMLInputElement).value);
        }
    };

    return (
        <div className="text-field-text">
            <input
                className="text-field-text__input"
                value={value}
                placeholder={placeholder}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                type="text"
            />
        </div>
    );
}

export default TextFieldText;
