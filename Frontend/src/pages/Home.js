import { Link } from "react-router-dom";
import NavBar from "../features/navbar/Navbar";
import ProductList from "../features/product/components/ProductList";
import Footer from "../features/common/Footer";

function Home() {
    return (
        <div className="bg-background min-h-screen flex flex-col ">
            <NavBar>
                {/* Hero Section */}
                <section className="w-full flex flex-col items-center justify-center text-center py-20 px-4 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 animate-fadeIn rounded-2xl shadow-glass mb-12 mt-4">
                    <img src="/logo.svg" alt="Anything Logo" className="h-20 w-20 mb-6 drop-shadow-xl animate-bounceIn" />
                    <h1 className="text-5xl md:text-6xl font-extrabold text-primary mb-4 tracking-tight animate-fadeIn">Anything</h1>
                    <p className="text-lg md:text-2xl text-gray-700 mb-8 max-w-2xl animate-fadeIn">Discover, shop, and enjoy a modern e-commerce experience. Elegant, fast, and built for you.</p>
                    <button
                        className="px-8 py-3 bg-primary text-white font-semibold rounded-xl shadow-elevated hover:bg-accent transition-colors duration-300 animate-bounceIn"
                        onClick={() => {
                            const section = document.getElementById('featured-products');
                            if (section) {
                                section.scrollIntoView({ behavior: 'smooth' });
                            }
                        }}
                    >
                        Shop Now
                    </button>
                </section>
                {/* Featured Products Section */}
                <section id="featured-products" className="w-full animate-slideUp">
                    <ProductList />
                </section>
            </NavBar>
            <Footer />
        </div>
    );
}

export default Home;