import "./index.scss"
import {ChangeEventHandler} from "react";

interface TextFieldNumberProps {
    value: string;
    placeholder: string;
    onChange?: (value: string) => void;
    onSubmit?: (value: string) => void;
}

function TextFieldNumber({value, placeholder, onChange, onSubmit}: TextFieldNumberProps) {
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
        <div className="text-field-number">
            <input
                className="text-field-number__input"
                value={value}
                placeholder={placeholder}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                type="number"
            />
        </div>
    );
}

export default TextFieldNumber;
