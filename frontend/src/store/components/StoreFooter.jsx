export default function StoreFooter() {
    return (
        <footer className="py-10 px-5" style={{ background: "var(--color-primary-dark)", color: "rgba(255,255,255,0.7)" }}>
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h4 className="text-white mb-3 font-semibold">Ecommerce</h4>
                        <p className="text-sm leading-7">
                            Cung cấp sản phẩm công nghệ chính hãng với giá tốt nhất.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white mb-3 font-semibold">Liên hệ</h4>
                        <p className="text-sm leading-7">
                            Email: info@ecommerce.com<br />
                            Phone: 0123 456 789
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white mb-3 font-semibold">Theo dõi</h4>
                        <p className="text-sm leading-7">
                            Facebook | Instagram | YouTube
                        </p>
                    </div>
                </div>
                <div className="border-t border-white/10 mt-6 pt-4 text-center text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                    © 2026 Ecommerce. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
