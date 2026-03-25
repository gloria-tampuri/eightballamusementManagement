import React from "react";
import Link from "next/link";
import styles from "../styles/homepage.module.css";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import Footer from "../../components/Atoms/Footer/Footer";

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Navigation */}
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <div className={styles.logo}>🎱 Eight Ball Amusement</div>
          <div className={styles.navLinks}>
            <a href="#services" className={styles.navLink}>
              Services
            </a>
            <Link href="/catalogue" className={styles.navLink}>
              Catalogue
            </Link>
            <a href="#contact" className={styles.navLink}>
              Contact
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Premium Gaming & Entertainment</h1>
          <p className={styles.heroSubtitle}>
            Experience the ultimate entertainment with our world-class pool
            tables, table tennis, foosball/babyfoot, and other outdoor games
          </p>
          <a className={styles.ctaButton} href="tel:+233245830990">Book Now</a>
        </div>
        <div className={styles.heroBackground}>
          <div className={styles.heroImage}>
            <img src="/pexels-mart-production-10627128.jpg" alt="hero" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className={styles.services}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Our Premium Services</h2>
          <div className={styles.servicesGrid}>
            {/* Pool Tables */}
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>🎱</div>
              <h3>Pool Tables (Snooker)</h3>
              <p>
                Professional-grade pool tables available for rent or purchase.
                Perfect for homes, bars, and entertainment venues.
              </p>
              <ul className={styles.featureList}>
                <li>✓ Premium quality tables</li>
                <li>✓ Professional maintenance</li>
                <li>✓ Flexible rental periods</li>
                <li>✓ Setup & delivery included</li>
              </ul>
            </div>

            {/* Table Tennis */}
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>🏓</div>
              <h3>Table Tennis</h3>
              <p>
                Latest table tennis tables and equipment for tournaments or
                casual play. Great for offices and recreation centers.
              </p>
              <ul className={styles.featureList}>
                <li>✓ Tournament-grade tables</li>
                <li>✓ Professional paddles & balls</li>
                <li>✓ Coaching available</li>
                <li>✓ Quick setup</li>
              </ul>
            </div>

            {/* Foosball */}
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>⚽</div>
              <h3>Table Soccer (Foosball)</h3>
              <p>
                High-quality foosball tables for office fun and entertainment.
                Build team spirit and engagement.
              </p>
              <ul className={styles.featureList}>
                <li>✓ Modern designs</li>
                <li>✓ Durable construction</li>
                <li>✓ Family-friendly</li>
                <li>✓ Easy maintenance</li>
              </ul>
            </div>

            {/* Basketball */}
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>🏀</div>
              <h3>Basketball Equipment</h3>
              <p>
                Complete basketball solutions including hoops, goals, and
                outdoor court setup for unforgettable games.
              </p>
              <ul className={styles.featureList}>
                <li>✓ Portable hoops</li>
                <li>✓ Professional equipment</li>
                <li>✓ Court setup service</li>
                <li>✓ Tournament ready</li>
              </ul>
            </div>

            {/* Outdoor Games */}
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>🎯</div>
              <h3>Outdoor Games</h3>
              <p>
                Complete range of outdoor recreational equipment including
                cornhole, badminton, volleyball, and more.
              </p>
              <ul className={styles.featureList}>
                <li>✓ Wide variety</li>
                <li>✓ Weather-resistant</li>
                <li>✓ Group packages</li>
                <li>✓ Event support</li>
              </ul>
            </div>

            {/* Events */}
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>🎉</div>
              <h3>Event Rentals</h3>
              <p>
                Complete entertainment packages for corporate events, parties,
                tournaments, and special occasions.
              </p>
              <ul className={styles.featureList}>
                <li>✓ Custom packages</li>
                <li>✓ Professional setup</li>
                <li>✓ Full support</li>
                <li>✓ Affordable pricing</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className={styles.gallery}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Gallery</h2>
          <p className={styles.gallerySubtitle}>
            See our premium equipment and facilities in action
          </p>

          <div className={styles.galleryGrid}>
            {/* Gallery Item 1 */}
            <div className={styles.galleryItem}>
              <div className={styles.galleryImageWrapper}>
                <img
                  src="/4ff4d5b0-b623-40cf-b93f-c22455088b5f.jpg"
                  alt="Pool table setup"
                  className={styles.galleryImage}
                  onError={(e) =>
                    (e.target.src =
                      "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%25%22 height=%22100%25%22%3E%3Crect fill=%22%231A5C38%22 width=%22100%25%22 height=%22100%25%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2224%22 fill=%22%23fff%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EPool Tables%3C/text%3E%3C/svg%3E")
                  }
                />
              </div>
              <div className={styles.galleryCaption}>Premium Pool Tables</div>
            </div>

            {/* Gallery Item 2 */}
            <div className={styles.galleryItem}>
              <div className={styles.galleryImageWrapper}>
                <img
                  src="/Tennis.jpg"
                  alt="Table tennis"
                  className={styles.galleryImage}
                  onError={(e) =>
                    (e.target.src =
                      "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%25%22 height=%22100%25%22%3E%3Crect fill=%232E8B57%22 width=%22100%25%22 height=%22100%25%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2224%22 fill=%22%23fff%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3ETable Tennis%3C/text%3E%3C/svg%3E")
                  }
                />
              </div>
              <div className={styles.galleryCaption}>
                Tournament Table Tennis
              </div>
            </div>

            {/* Gallery Item 3 */}
            <div className={styles.galleryItem}>
              <div className={styles.galleryImageWrapper}>
                <img
                  src="/foosball.jpg"
                  alt="Foosball games"
                  className={styles.galleryImage}
                  onError={(e) =>
                    (e.target.src =
                      "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%25%22 height=%22100%25%22%3E%3Crect fill=%23C9A84C%22 width=%22100%25%22 height=%22100%25%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2224%22 fill=%22%231E1E1E%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EFoosball%3C/text%3E%3C/svg%3E")
                  }
                />
              </div>
              <div className={styles.galleryCaption}>
                Foosball Entertainment
              </div>
            </div>

            {/* Gallery Item 4 */}
            <div className={styles.galleryItem}>
              <div className={styles.galleryImageWrapper}>
                <img
                  src="/BB.jpg"
                  alt="Basketball setup"
                  className={styles.galleryImage}
                  onError={(e) =>
                    (e.target.src =
                      "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%25%22 height=%22100%25%22%3E%3Crect fill=%231A5C38%22 width=%22100%25%22 height=%22100%25%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2224%22 fill=%22%23fff%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EBasketball%3C/text%3E%3C/svg%3E")
                  }
                />
              </div>
              <div className={styles.galleryCaption}>Basketball Courts</div>
            </div>

            {/* Gallery Item 5 */}
            <div className={styles.galleryItem}>
              <div className={styles.galleryImageWrapper}>
                <img
                  src="/IMG_8168.jpg"
                  alt="Outdoor games"
                  className={styles.galleryImage}
                  onError={(e) =>
                    (e.target.src =
                      "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%25%22 height=%22100%25%22%3E%3Crect fill=%232E8B57%22 width=%22100%25%22 height=%22100%25%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2224%22 fill=%22%23fff%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EOutdoor Games%3C/text%3E%3C/svg%3E")
                  }
                />
              </div>
              <div className={styles.galleryCaption}>Outdoor Recreation</div>
            </div>

            {/* Gallery Item 6 */}
            <div className={styles.galleryItem}>
              <div className={styles.galleryImageWrapper}>
                <img
                  src="/f5c04087-1fe1-4238-8f09-fae545c1fdf2.jpg"
                  alt="Event setup"
                  className={styles.galleryImage}
                  onError={(e) =>
                    (e.target.src =
                      "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%25%22 height=%22100%25%22%3E%3Crect fill=%23C9A84C%22 width=%22100%25%22 height=%22100%25%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2224%22 fill=%22%231E1E1E%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EEvent Setup%3C/text%3E%3C/svg%3E")
                  }
                />
              </div>
              <div className={styles.galleryCaption}>Corporate Events</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className={styles.whyUs}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Why Choose Eight Ball?</h2>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefit}>
              <div className={styles.benefitNumber}>01</div>
              <h3>Premium Quality</h3>
              <p>
                Only the finest equipment and tables from trusted manufacturers
                worldwide
              </p>
            </div>
            <div className={styles.benefit}>
              <div className={styles.benefitNumber}>02</div>
              <h3>Professional Service</h3>
              <p>
                Expert setup, maintenance, and support for all your
                entertainment needs
              </p>
            </div>
            <div className={styles.benefit}>
              <div className={styles.benefitNumber}>03</div>
              <h3>Flexible Options</h3>
              <p>
                Rent or buy with flexible payment plans tailored to your budget
              </p>
            </div>
            <div className={styles.benefit}>
              <div className={styles.benefitNumber}>04</div>
              <h3>24/7 Support</h3>
              <p>
                Round-the-clock customer support to ensure uninterrupted
                entertainment
              </p>
            </div>
            <div className={styles.benefit}>
              <div className={styles.benefitNumber}>05</div>
              <h3>Fast Delivery</h3>
              <p>
                Quick delivery and setup within 24-48 hours across the region
              </p>
            </div>
            <div className={styles.benefit}>
              <div className={styles.benefitNumber}>06</div>
              <h3>Warranty</h3>
              <p>
                Comprehensive warranty on all equipment with damage protection
                options
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.container}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>500+</div>
            <div className={styles.statLabel}>Happy Customers</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>100+</div>
            <div className={styles.statLabel}>Units in Service</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>10+</div>
            <div className={styles.statLabel}>Years Experience</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>24/7</div>
            <div className={styles.statLabel}>Customer Support</div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2>Ready to Get Started?</h2>
          <p>Transform your space into an entertainment hub</p>
          <Link href="/catalogue" className={styles.ctaButtonLarge}>
            Explore Catalogue
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
