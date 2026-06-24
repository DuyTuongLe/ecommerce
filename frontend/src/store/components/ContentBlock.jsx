import SectionRenderer from "./SectionRenderer";
import SlideRenderer from "./SlideRenderer";
import slugify from "slugify";

export default function ContentBlock({ section }) {
    const json = section.noi_dung_json;

    if (!json) return null;

    if (section.type === "slide") {
        return <SlideRenderer data={json} title={section.title} />;
    }

    const sectionId = section.title
        ? slugify(section.title, { lower: true, strict: true })
        : undefined;

    const sectionClass = `section ${sectionId ? `section-${sectionId}` : ""}`.trim();

    return (
        <SectionRenderer
            data={json}
            sectionClass={sectionClass}
            sectionId={sectionId}
        />
    );
}
