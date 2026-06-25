import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import slugify from "slugify";

export default function SlideRenderer({ data, title }) {
    const settings = data?.settings || {};
    const slides = data?.slides || [];
    const ss = data?.sectionSettings || {};

    if (slides.length === 0) return null;

    const perView = settings.slidesPerView || 1;
    const canLoop = slides.length > perView;
    const speed = settings.speed || 600;
    const isContinuous = settings.delay === 0;

    const sectionId = title ? slugify(title, { lower: true, strict: true }) : undefined;
    const extraClasses = ss.classes || "";

    const sectionStyle = {};
    if (ss.bgGradient) {
        sectionStyle.background = ss.bgGradient;
    } else if (ss.bgColor) {
        sectionStyle.backgroundColor = ss.bgColor;
    }
    if (ss.textColor) {
        sectionStyle.color = ss.textColor;
    }

    const containerClass = ss.fullWidth ? "" : "max-w-6xl mx-auto px-5 py-6";

    const autoplayConfig = settings.autoplay
        ? isContinuous
            ? { delay: 0, disableOnInteraction: false }
            : { delay: settings.delay || 3000, disableOnInteraction: false }
        : false;

    return (
        <section
            className={`section ${sectionId ? `section-${sectionId}` : ""} ${extraClasses}`.trim()}
            id={sectionId || undefined}
            style={sectionStyle}
        >
            <div className={containerClass}>
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    navigation={settings.showNav !== false}
                    pagination={settings.showDots !== false ? { clickable: true } : false}
                    loop={canLoop}
                    slidesPerView={perView}
                    spaceBetween={20}
                    speed={speed}
                    autoplay={autoplayConfig}
                >
                    {slides.map((slide, i) => (
                        <SwiperSlide key={i}>
                            <div className="slide-item">
                                <div className="slider-item_image">
                                    {slide.image && <img src={slide.image} alt={slide.title || ""} />}
                                </div>

                                <div className="slide-item_content">
                                    {slide.title && <h3>{slide.title}</h3>}
                                    {slide.description && <p>{slide.description}</p>}
                                    {slide.link && slide.button_text && (
                                        <a href={slide.link}>{slide.button_text}</a>
                                    )}
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}
