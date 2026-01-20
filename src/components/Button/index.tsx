import "./index.scss"

interface ButtonProps {
    text: string;
    disabled?: boolean;
    onClick?: () => void;
}

function Button({text, disabled = false, onClick}: ButtonProps) {
    const handleClick = () => {
        if (!disabled && onClick) onClick();
    }

    return (
        <div className={`button ${disabled ? "button--disabled" : ""}`} onClick={handleClick}>
            <div className="button__text">{text}</div>
        </div>
    )
}

export default Button;