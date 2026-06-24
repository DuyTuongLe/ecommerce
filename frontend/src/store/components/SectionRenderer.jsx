const SPAN_CLASS = {
    1: "col-span-1", 2: "col-span-2", 3: "col-span-3",
    4: "col-span-4", 5: "col-span-5", 6: "col-span-6",
    7: "col-span-7", 8: "col-span-8", 9: "col-span-9",
    10: "col-span-10", 11: "col-span-11", 12: "col-span-12",
};

export default function SectionRenderer({ data, sectionClass, sectionId }) {
    const rows = data?.rows || [];
    const ss = data?.sectionSettings || {};

    if (rows.length === 0) return null;

    const sectionStyle = {};
    if (ss.bgGradient) {
        sectionStyle.background = ss.bgGradient;
    } else if (ss.bgColor) {
        sectionStyle.backgroundColor = ss.bgColor;
    }
    if (ss.textColor) {
        sectionStyle.color = ss.textColor;
    }

    const containerClass = ss.fullWidth
        ? "px-5"
        : "max-w-6xl mx-auto px-5";

    const extraClasses = ss.classes || "";

    return (
        <section
            className={`${sectionClass || ""} ${extraClasses}`.trim()}
            id={sectionId || undefined}
            style={sectionStyle}
        >
            <div className={containerClass}>
                {rows.map((row, i) => (
                    <div key={i} className="store-section-grid">
                        {row.columns?.map((col, j) => {
                            const span = typeof col.span === "object" ? col.span.desktop : col.span;
                            const classes = col.style?.classes || "";
                            const colBg = col.style?.bgColor || "";
                            const colStyle = colBg && !colBg.startsWith("bg-") ? { backgroundColor: colBg } : {};

                            return (
                                <div
                                    key={j}
                                    className={`${SPAN_CLASS[span] || "col-span-12"} ${classes}`}
                                    id={col.style?.id || undefined}
                                    style={colStyle}
                                    dangerouslySetInnerHTML={{ __html: col.content || "" }}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
        </section>
    );
}
