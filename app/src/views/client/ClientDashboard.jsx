"use client";
import { useState, useEffect, useRef } from "react";
import { Outlet, useLocation } from "@/utils/react-router-dom";
import Products from "../../components/Client/Products";
import ClientNavbar from "../../components/Client/ClientNavbar";
import Footer from "../../components/Footer/Footer";
import ScrollToTop from "../../components/ScrollTop";

export default function ClientDashboard({ initialCategories = [], initialCategoryProducts = {} }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [priceFilter, setPriceFilter] = useState("all");
    const [sortBy, setSortBy] = useState("default");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState(initialCategories);
    const location = useLocation();
    const mainScrollRef = useRef(null);

    // Scroll to top when pathname changes
    useEffect(() => {
        if (mainScrollRef.current) {
            mainScrollRef.current.scrollTo({
                top: 0,
                left: 0,
                behavior: 'instant'
            });
        }
        // Immediate scroll
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'
        });
        // Also scroll after a short delay to handle browser scroll restoration
        const timeoutId = setTimeout(() => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'instant'
            });
        }, 100);
        
        return () => clearTimeout(timeoutId);
    }, [location.pathname]);

    // Get selected category name for header display
    const selectedCategoryName = categories.find(cat => cat.id === selectedCategory)?.name || null;

    return (
        <div className="min-h-screen bg-linear-to-br from-[#fef7f5] via-white to-white relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                {/* Large decorative circles */}
                <div className="absolute top-20 right-[5%] h-96 w-96 rounded-full bg-brandRed/5 blur-3xl" aria-hidden="true" />
                <div className="absolute top-96 left-[3%] h-80 w-80 rounded-full bg-brandRed/8 blur-3xl" aria-hidden="true" />
                <div className="absolute bottom-40 right-[10%] h-72 w-72 rounded-full bg-brandRed/6 blur-3xl" aria-hidden="true" />
                
                {/* Medium decorative circles */}
                <div className="absolute top-1/3 left-[8%] h-64 w-64 rounded-full bg-brandRed/4 blur-2xl" aria-hidden="true" />
                <div className="absolute bottom-1/4 left-[15%] h-56 w-56 rounded-full bg-brandRed/7 blur-2xl" aria-hidden="true" />
                <div className="absolute top-2/3 right-[20%] h-60 w-60 rounded-full bg-brandRed/5 blur-2xl" aria-hidden="true" />
                
                {/* Small accent circles */}
                <div className="absolute top-[15%] right-[30%] h-40 w-40 rounded-full bg-brandRed/6 blur-xl" aria-hidden="true" />
                <div className="absolute bottom-[30%] right-[40%] h-32 w-32 rounded-full bg-brandRed/5 blur-xl" aria-hidden="true" />
                <div className="absolute top-[60%] left-[25%] h-48 w-48 rounded-full bg-brandRed/4 blur-xl" aria-hidden="true" />
            </div>

            <ScrollToTop />
            <ClientNavbar 
                searchTerm={searchQuery}
                onSearchChange={setSearchQuery}
                priceFilter={priceFilter}
                onPriceFilterChange={setPriceFilter}
                sortBy={sortBy}
                onSortByChange={setSortBy}
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
            />
            
            <main ref={mainScrollRef} className="flex-1 overflow-y-auto pt-16 md:pt-20 relative z-10">
                <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-10 relative z-10">
                    {/* Enhanced Header Section */}
                    <header className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-linear-to-br from-[#fdf4f2] via-white to-white border border-brandRed/10 mb-4 sm:mb-8 shadow-sm">
                        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brandRed/10" aria-hidden="true" />
                        <div className="absolute -left-12 bottom-0 h-40 w-40 rounded-full bg-brandRed/5" aria-hidden="true" />

                        <div className="relative flex flex-col gap-3 sm:gap-6 px-4 py-4 sm:px-6 sm:py-6 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <p
                                    className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-brandRed"
                                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                                >
                                    Catalogue
                                </p>
                                <h1
                                    className="mt-1 sm:mt-3 text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900"
                                    style={{ fontFamily: "'Playfair Display', serif" }}
                                >
                                    {selectedCategoryName 
                                        ? `${selectedCategoryName} Products`
                                        : searchQuery
                                        ? `Search Results for "${searchQuery}"`
                                        : "Our Beauty Collection"
                                    }
                                </h1>
                                <p
                                    className="mt-1 sm:mt-3 max-w-2xl text-xs sm:text-sm text-gray-600 line-clamp-2 sm:line-clamp-none"
                                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                                >
                                    {selectedCategoryName
                                        ? `Discover our curated selection of ${selectedCategoryName.toLowerCase()} products, carefully selected for quality and effectiveness.`
                                        : searchQuery
                                        ? `Found products matching your search. Explore our collection to find the perfect beauty solutions.`
                                        : "Discover our carefully curated selection of premium beauty products. From skincare essentials to makeup favorites, find everything you need to enhance your beauty routine."
                                    }
                                </p>

                                {(selectedCategory || searchQuery || priceFilter !== "all" || sortBy !== "default") && (
                                    <div className="mt-3 sm:mt-5 flex items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl bg-white/90 px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-gray-700 shadow-sm">
                                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brandRed/10 text-brandRed">
                                            ⓘ
                                        </span>
                                        <p style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                            {(() => {
                                                const filters = [];
                                                if (selectedCategory) filters.push(`Category: ${selectedCategoryName}`);
                                                if (searchQuery) filters.push(`Search: "${searchQuery}"`);
                                                if (priceFilter !== "all") {
                                                    const priceLabels = {
                                                        "under-25": "Under $25",
                                                        "25-50": "$25 - $50",
                                                        "50-100": "$50 - $100",
                                                        "over-100": "Over $100"
                                                    };
                                                    filters.push(`Price: ${priceLabels[priceFilter] || priceFilter}`);
                                                }
                                                if (sortBy !== "default") {
                                                    const sortLabels = {
                                                        "price-low": "Price: Low to High",
                                                        "price-high": "Price: High to Low",
                                                        "name-asc": "Name: A to Z",
                                                        "name-desc": "Name: Z to A"
                                                    };
                                                    if (sortLabels[sortBy]) {
                                                        filters.push(sortLabels[sortBy]);
                                                    }
                                                }
                                                return filters.length > 0 
                                                    ? `Active filters: ${filters.join(" • ")}`
                                                    : "Browse all products in our collection.";
                                            })()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* Products Section */}
                    <section className="space-y-10 relative">
                        {/* Additional decorative elements around products section */}
                        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-brandRed/3 blur-3xl pointer-events-none" aria-hidden="true" />
                        <div className="absolute -bottom-10 -left-10 h-80 w-80 rounded-full bg-brandRed/4 blur-3xl pointer-events-none" aria-hidden="true" />
                        
                        <div className="relative z-10">
                            <Products 
                                searchQuery={searchQuery}
                                priceFilter={priceFilter}
                                sortBy={sortBy}
                                selectedCategory={selectedCategory}
                                onCategoriesLoaded={setCategories}
                                initialCategories={initialCategories}
                                initialCategoryProducts={initialCategoryProducts}
                            />
                            <Outlet />
                        </div>
                    </section>
                </div>
            </main>
            
            <Footer />
        </div>
    );
}