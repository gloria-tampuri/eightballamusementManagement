import React from 'react'
import styles from './Footer.module.css'
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerContent}>
            <div className={styles.footerSection}>
              <h3>Eight Ball Amusement</h3>
              <p>
                Your premier destination for quality gaming and entertainment
                equipment.
              </p>
            </div>
            <div className={styles.footerSection}>
              <h4>Quick Links</h4>
              <ul>
                <li>
                  <a href="#services">Services</a>
                </li>
                <li>
                  <a href="#about">About</a>
                </li>
                <li>
                  <a href="#contact">Contact</a>
                </li>
                <li>
                  <a href="#faq">FAQ</a>
                </li>
              </ul>
            </div>
            <div className={styles.footerSection}>
              <h4>Contact</h4>
              <p>📞 + (233) 24 583 0990</p>
              <p>📧 info@eightball.com</p>
              <p>📍 Kumasi, Ghana</p>
            </div>
            <div className={styles.footerSection}>
              <h4>Social Media</h4>
              <div className={styles.socialIcons}>
                <a href="#">
                  <FaFacebook />
                </a>
                <a href="#">
                  <FaInstagram />
                </a>
                <a href="#">
                  <FaTwitter />
                </a>
              </div>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; 2026 Eight Ball Amusement. All rights reserved.</p>
            <Link href="/login" className={styles.adminLogin}>
              Login as Admin
            </Link>
          </div>
        </div>
      </footer>
  )
}

export default Footer