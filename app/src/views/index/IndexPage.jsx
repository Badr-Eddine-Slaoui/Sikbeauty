import dynamic from "next/dynamic";
import Header from "../../components/Header/Header";
import NavbarWrapper from "../../components/Header/NavbarWrapper";
import Footer from "../../components/Footer/Footer";
import { LatestProductsProvider } from "../../contexts/LatestProductsContext";

const MainComponent = dynamic(() => import("../../components/main/MainComponent"), { ssr: true });
const Discover = dynamic(() => import("../../components/Sections/Discover"), { ssr: true });
const NosValeur = dynamic(() => import("../../components/Sections/NosValeur"), { ssr: true });
const History = dynamic(() => import("../../components/Sections/History"), { ssr: true });
const Routine = dynamic(() => import("../../components/Sections/Routine"), { ssr: true });
const Reviews = dynamic(() => import("../../components/Sections/Reviews"), { ssr: true });
const Instagram = dynamic(() => import("../../components/Sections/Instagram"), { ssr: true });
const BlogSlider = dynamic(() => import("../../components/Sections/BlogSlider"), { ssr: true });
const Newsletter = dynamic(() => import("../../components/Sections/Newsletter"), { ssr: true });

async function getLatestProducts() {
    const apiUrl = process.env.INTERNAL_API_URL || "http://back-end:3000/api/v1";
    try {
        const res = await fetch(`${apiUrl}/products/latest`, { 
            next: { revalidate: 60 }, // Reduced revalidation for better debugging
            cache: 'no-store' // Disable cache temporarily to ensure fresh data
        });
        if (!res.ok) return [];
        const data = await res.json();
        
        // Robust extraction
        const payload = data?.data ?? data;
        if (Array.isArray(payload)) return payload;
        if (Array.isArray(payload?.products)) return payload.products;
        if (Array.isArray(payload?.data)) return payload.data;
        
        return [];
    } catch (error) {
        console.error("Failed to fetch latest products:", error);
        return [];
    }
}

async function getLatestBlogs() {
    const apiUrl = process.env.INTERNAL_API_URL || "http://back-end:3000/api/v1";
    try {
        const res = await fetch(`${apiUrl}/blogs/latest?limit=6`, { 
            next: { revalidate: 60 }
        });
        if (!res.ok) return [];
        const data = await res.json();
        
        // Robust extraction
        const payload = data?.data ?? data;
        if (Array.isArray(payload)) return payload;
        if (Array.isArray(payload?.blogs)) return payload.blogs;
        if (Array.isArray(payload?.data)) return payload.data;

        return [];
    } catch (error) {
        console.error("Failed to fetch latest blogs:", error);
        return [];
    }
}

export default async function Index() {
    const latestProducts = await getLatestProducts();
    const latestBlogs = await getLatestBlogs();

    return (
        <div>
            <NavbarWrapper />

            <section id="accueil" className="scroll-mt-24">
                <Header />
            </section>
            <section id="selection" className="scroll-mt-24">
                <LatestProductsProvider initialProducts={latestProducts}>
                    <MainComponent />
                </LatestProductsProvider>
            </section>
            <section id="decouvrir" className="scroll-mt-24">
                <Discover />
            </section>
            <section id="valeurs" className="scroll-mt-24">
                <NosValeur />
            </section>
            <section id="histoire" className="scroll-mt-24">
                <History />
            </section>
            <section id="routines" className="scroll-mt-24">
                <Routine />
            </section>
            <section id="avis" className="scroll-mt-24">
                <Reviews />
            </section>
            <section id="instagram" className="scroll-mt-24">
                <Instagram />
            </section>
            <section id="blog" className="scroll-mt-24">
                <BlogSlider initialBlogs={latestBlogs} />
            </section>
            <section id="newsletter" className="scroll-mt-24">
                <Newsletter />
            </section>
            <Footer />
        </div>
    );
}