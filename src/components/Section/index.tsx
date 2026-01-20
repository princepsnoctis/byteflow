import "./index.scss"

interface SectionProps {
    title: string;
    style?: React.CSSProperties;
    children: React.ReactNode
}

function Section({title, style, children}: SectionProps) {
    return (
        <section className="section" style={style}>
            <div className="section__title">{title}</div>
            <div className="section__children">
                {children}
            </div>
        </section>
    )
}

export default Section;