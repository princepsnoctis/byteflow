import "./index.scss"

interface RowProps {
    gap?: number;
    children: React.ReactNode
}

function Row({gap = 0, children}: RowProps) {
    return (
        <div className="row" style={{gap}}>
            {children}
        </div>
    )
}

export default Row;