import "./index.scss"
import {ChangeEventHandler} from "react";

interface TextFieldTextProps {
    value: string;
    placeholder: string;
    disabled?: boolean;
    onChange?: (value: string) => void;
    onSubmit?: (value: string) => void;
}

function TextFieldText({value, placeholder, disabled, onChange, onSubmit}: TextFieldTextProps) {
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
        <div className={`text-field-text ${disabled ? "text-field-text--disabled" : ""}`}>
            <input
                className="text-field-text__input"
                value={value}
                placeholder={placeholder}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                type="text"
                disabled={disabled}
            />
        </div>
    );
}

export default TextFieldText;
