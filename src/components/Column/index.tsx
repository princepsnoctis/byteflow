import "./index.scss"

interface ColumnProps {
    gap?: number;
    flex?: number;
    children: React.ReactNode
}

function Column({gap = 0, flex = 1, children}: ColumnProps) {
    return (
        <div className="column" style={{gap, flex}}>
            {children}
        </div>
    )
}

export default Column;