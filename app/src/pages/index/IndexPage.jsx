"use client";
import Header from "../../components/Header/Header";
import MainComponent from "../../components/main/MainComponent";
import Discover from "../../components/Sections/Discover";
import Navbar from "../../components/Header/NavBar";
import NosValeur from "../../components/Sections/NosValeur";
import History from "../../components/Sections/History";
import Routine from "../../components/Sections/Routine";
import Reviews from "../../components/Sections/Reviews";
import Instagram from "../../components/Sections/Instagram";
import BlogSlider from "../../components/Sections/BlogSlider";
import Newsletter from "../../components/Sections/Newsletter";
import Footer from "../../components/Footer/Footer";
import ClientNavbar from "../../components/Client/ClientNavbar";
import { useAuth } from "../../contexts/AuthContext";
import { LatestProductsProvider } from "../../contexts/LatestProductsContext";

export default function Index() {
    const { user, isAuthenticated } = useAuth();
    const authenticated = isAuthenticated();
    const role = user?.role?.toLowerCase();
    const isClientUser = authenticated && (role === "individual" || role === "professional");

    return (
        <div>
            {isClientUser ? <ClientNavbar /> : <Navbar />}

            <section id="accueil" className="scroll-mt-24">
                <Header />
            </section>
            <section id="selection" className="scroll-mt-24">
                <LatestProductsProvider>
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
                <BlogSlider />
            </section>
            <section id="newsletter" className="scroll-mt-24">
                <Newsletter />
            </section>
            <Footer />
        </div>
    );
}