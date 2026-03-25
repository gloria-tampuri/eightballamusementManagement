import React, { useState } from "react";
import Link from "next/link";
import styles from "../styles/catalogue.module.css";
import Footer from "../../components/Atoms/Footer/Footer";

export default function Catalogue() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const products = [
    {
      id: 1,
      name: "Professional Pool Table",
      category: "pool",
      price: "₵15,000 - ₵25,000",
      description:
        "Premium 8ft professional-grade pool table with slate surface",
      image: "/4ff4d5b0-b623-40cf-b93f-c22455088b5f.jpg",
    },
    {
      id: 2,
      name: "Tournament Snooker Table",
      category: "pool",
      price: "₵20,000 - ₵35,000",
      description:
        "Full-size 12ft tournament snooker table with professional finish",
      image: "/29bbe92d-1e0b-403c-8b5b-afdb841e64fc.jpg",
    },
    {
      id: 3,
      name: "Standard Pool Table",
      category: "pool",
      price: "₵8,000 - ₵12,000",
      description: "Quality pool table perfect for home or small venues",
      image: "/4ff4d5b0-b623-40cf-b93f-c22455088b5f.jpg",
    },
    {
      id: 4,
      name: "Tournament Table Tennis",
      category: "tabletennis",
      price: "₵4,500 - ₵7,000",
      description: "ITTF approved table tennis table for tournaments",
      image: "/Tennis.jpg",
    },
    {
      id: 5,
      name: "Indoor Table Tennis",
      category: "tabletennis",
      price: "₵4,500 - ₵5,000",
      description: "Durable indoor table tennis table for recreational play",
      image: "/Tennis.jpg",
    },
    {
      id: 6,
      name: "Outdoor Table Tennis",
      category: "tabletennis",
      price: "₵5,000 - ₵7,000",
      description: "Weather-resistant outdoor table tennis table",
      image: "/Tennis.jpg",
    },
    {
      id: 7,
      name: "Professional Foosball Table",
      category: "foosball",
      price: "₵15,000 - ₵16,000",
      description:
        "High-quality foosball table with smooth rods and quality balls",
      image: "/foosball.jpg",
    },
    {
      id: 8,
      name: "Standard Foosball Table",
      category: "foosball",
      price: "₵4,800 - ₵5,500",
      description:
        "Affordable foosball table for office and home entertainment",
      image: "/standard_foosball.jpg",
    },
    {
      id: 9,
      name: "Portable Basketball Hoop",
      category: "basketball",
      price: "₵4,000 - ₵5,500",
      description: "Adjustable portable basketball hoop system",
      image: "/BB.jpg",
    },
    {
      id: 10,
      name: "Wall-Mounted Basketball System",
      category: "basketball",
      price: "₵1,500 - ₵3,000",
      description:
        "Professional wall-mounted basketball hoop for indoor courts",
      image: "/39146.jpg",
    },
    {
      id: 11,
      name: "Cornhole Game Set",
      category: "outdoor",
      price: "₵800 - ₵1,500",
      description: "Complete cornhole set with boards and bean bags",
      image: "/Cornholeset.jpg",
    },
    {
      id: 12,
      name: "Badminton Set",
      category: "outdoor",
      price: "₵500 - ₵1,200",
      description: "Professional badminton set with net and rackets",
      image: "/Badminton.jpeg",
    },
  ];

  const categories = [
    { value: "all", label: "All Products" },
    { value: "pool", label: "Pool Tables" },
    { value: "tabletennis", label: "Table Tennis" },
    { value: "foosball", label: "Foosball" },
    { value: "basketball", label: "Basketball" },
    { value: "outdoor", label: "Outdoor Games" },
  ];

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <main className={styles.main}>
      {/* Navigation */}
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <Link href="/" className={styles.logo}>
            🎱 Eight Ball Amusement
          </Link>
          <div className={styles.navLinks}>
            <Link href="/" className={styles.navLink}>
              Home
            </Link>
            <Link href="/catalogue" className={styles.navLink}>
              Catalogue
            </Link>
            <a href="#contact" className={styles.navLink}>
              Contact
            </a>
          </div>
        </div>
      </nav>

      {/* Catalogue Header */}
      <section className={styles.catalogueHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>Product Catalogue</h1>
          <p className={styles.pageSubtitle}>
            Browse our extensive collection of premium gaming and entertainment
            equipment
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className={styles.filterSection}>
        <div className={styles.filterContainer}>
          <h3 className={styles.filterTitle}>Filter by Category</h3>
          <div className={styles.categoryButtons}>
            {categories.map((cat) => (
              <button
                key={cat.value}
                className={`${styles.categoryButton} ${
                  selectedCategory === cat.value ? styles.active : ""
                }`}
                onClick={() => setSelectedCategory(cat.value)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className={styles.catalogueSection}>
        <div className={styles.container}>
          <div className={styles.productsGrid}>
            {filteredProducts.map((product) => (
              <div key={product.id} className={styles.productCard}>
                {/* Image */}
                <div className={styles.imagePlaceholder}>
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className={styles.productImage}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextElementSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className={styles.fallbackPlaceholder}
                    style={product.image ? { display: "none" } : {}}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="80"
                      height="80"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                      ></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    <p className={styles.placeholderText}>Image Coming Soon</p>
                  </div>
                </div>

                {/* Product Info */}
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <p className={styles.productDescription}>
                    {product.description}
                  </p>

                  <div className={styles.productFooter}>
                    <div className={styles.price}>{product.price}</div>
                    <a href="tel:+233245830990" className={styles.enquireButton}>
                      Enquire Now
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2>Can't Find What You're Looking For?</h2>
          <p>Contact us for custom packages and special requests</p>

          <a className={styles.ctaButton} href="tel:+233245830990">
            Contact Us
          </a>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
