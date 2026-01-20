import "./index.scss"

interface ButtonStateProps {
    text: string;
    active?: boolean;
    onClick?: () => void;
}

function ButtonState({text, active = false, onClick}: ButtonStateProps) {
    return (
        <div className={`button-state ${active ? "button-state--active" : ""}`} onClick={onClick}>
            <div className="button-state__text">{text}</div>
        </div>
    )
}

export default ButtonState;