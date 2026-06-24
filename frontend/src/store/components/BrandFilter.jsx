import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { getStoreBrands } from "../../shared/services/storeApi";

export default function BrandFilter({ lang = "vi", activeBrandId, onSelect }) {
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        getStoreBrands(lang).then(setBrands);
    }, [lang]);

    if (brands.length === 0) return null;

    return (
        <div style={{ background: "#f8f9fa", borderBottom: "1px solid #eee" }}>
            <div className="max-w-6xl mx-auto px-5" style={{ paddingTop: 8, paddingBottom: 8 }}>
                <Swiper
                    modules={[Navigation]}
                    navigation
                    pagination={false}
                    slidesPerView="auto"
                    spaceBetween={10}
                    style={{ padding: "0 30px" }}
                >
                    {/* Tất cả */}
                    <SwiperSlide style={{ width: "auto" }}>
                        <button
                            onClick={() => onSelect(null, "")}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "6px 14px",
                                border: !activeBrandId ? "2px solid #2f456f" : "1px solid #ddd",
                                borderRadius: 20,
                                background: !activeBrandId ? "#2f456f" : "#fff",
                                color: !activeBrandId ? "#fff" : "#333",
                                cursor: "pointer",
                                fontSize: 13,
                                whiteSpace: "nowrap",
                            }}
                        >
                            {lang === "vi" ? "Tất cả" : "All"}
                        </button>
                    </SwiperSlide>
                    {brands.map((brand) => (
                        <SwiperSlide key={brand.id} style={{ width: "auto" }}>
                            <button
                                onClick={() => onSelect(brand.id, brand.name)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                    padding: "6px 14px",
                                    border: activeBrandId === brand.id ? "2px solid #2f456f" : "1px solid #ddd",
                                    borderRadius: 20,
                                    background: activeBrandId === brand.id ? "#2f456f" : "#fff",
                                    color: activeBrandId === brand.id ? "#fff" : "#333",
                                    cursor: "pointer",
                                    fontSize: 13,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {brand.logo && (
                                    <img src={brand.logo} alt={brand.name} style={{ height: 20, width: "auto", objectFit: "contain" }} />
                                )}
                                {brand.name}
                            </button>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}
