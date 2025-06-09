import Link from "next/link";
import classes from "./Navigation.module.css";
import {
  MdOutlineDashboard,
  MdOutlineWallet,
  MdClose,
  MdEmojiTransportation,
} from "react-icons/md";
import { TbTools } from "react-icons/tb";
import { FaCalendarWeek, FaTasks } from "react-icons/fa";
import { GiExpense, GiHamburgerMenu } from "react-icons/gi";
import { CiLogin } from "react-icons/ci";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { getSignedInEmail, signOut } from "../../../auth";

const ADMIN_EMAIL = "richard.ababio@eightball.com";

// Navigation items configuration
const ADMIN_NAV_ITEMS = [
  { href: "/dashboard", icon: MdOutlineDashboard, label: "Dashboard" },
  { href: "/dashboard/asserts", icon: MdOutlineWallet, label: "All Assets" },
  { href: "/dashboard/weeklycashups", icon: FaCalendarWeek, label: "Weekly Cashups" },
  { href: "/dashboard/previousweek", icon: FaCalendarWeek, label: "Previous Week" },
  { href: "/dashboard/expenditure", icon: GiExpense, label: "General Expenditure" },
  { href: "/dashboard/todo", icon: FaTasks, label: "Todo List" },
  { href: "/dashboard/accessories", icon: TbTools, label: "Accessories" },
  { href: "/dashboard/transport", icon: MdEmojiTransportation, label: "Transport" },
];

const USER_NAV_ITEMS = [
  { href: "/dashboard", icon: MdOutlineDashboard, label: "Dashboard" },
  { href: "/dashboard/weeklycashups", icon: FaCalendarWeek, label: "Weekly Cashups" },
  { href: "/dashboard/previousweek", icon: FaCalendarWeek, label: "Previous Week" },
  { href: "/dashboard/accessories", icon: TbTools, label: "Accessories" },
  { href: "/dashboard/transport", icon: MdEmojiTransportation, label: "Transport" },
];

const Navigation = () => {
  const [admin, setAdmin] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check admin status on component mount
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const email = await getSignedInEmail();
        setAdmin(email === ADMIN_EMAIL);
      } catch (error) {
        console.error("Failed to get signed-in email:", error);
        setAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  // Handle sign out
  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      router.push("/login"); // Redirect to login page after sign out
    } catch (error) {
      console.error("Sign out failed:", error);
      // You might want to show an error message to the user here
    }
  }, [router]);

  // Toggle mobile navigation
  const toggleNav = useCallback(() => {
    setShowNav(prev => !prev);
  }, []);

  // Render navigation items
  const renderNavItems = useCallback((items) => {
    return items.map((item) => {
      const IconComponent = item.icon;
      return (
        <Link key={item.href} className={classes.link} href={item.href}>
          <div className={classes.section}>
            <IconComponent className={classes.icons} />
            <span>{item.label}</span>
          </div>
        </Link>
      );
    });
  }, []);

  // Render logout button
  const renderLogoutButton = useCallback(() => (
    <div onClick={handleSignOut} className={classes.logout}>
      <CiLogin />
      <h4>LOG OUT</h4>
    </div>
  ), [handleSignOut]);

  // Show loading state while checking admin status
  if (isLoading) {
    return (
      <div className={classes.navDisplay}>
        <div>
          <header className={classes.header}>
            <div className={classes.logo}>
              <img src="/Eigtball-Logo.png" alt="Eightball Logo" />
            </div>
          </header>
        </div>
      </div>
    );
  }

  const navItems = admin ? ADMIN_NAV_ITEMS : USER_NAV_ITEMS;

  return (
    <div className={classes.navDisplay}>
      <div>
        <header className={classes.header}>
          <div className={classes.logo}>
            <img src="/Eigtball-Logo.png" alt="Eightball Logo" />
          </div>
          <div className={classes.menu}>
            {showNav ? (
              <MdClose
                className={classes.icons}
                onClick={toggleNav}
                aria-label="Close navigation menu"
              />
            ) : (
              <GiHamburgerMenu
                className={classes.icons}
                onClick={toggleNav}
                aria-label="Open navigation menu"
              />
            )}
          </div>
        </header>

        {/* Desktop Navigation */}
        <nav className={classes.nav}>
          {renderNavItems(navItems)}
          {renderLogoutButton()}
        </nav>

        {/* Mobile Navigation */}
        {showNav && (
          <nav className={classes.phoneNav}>
            {renderNavItems(navItems)}
            {renderLogoutButton()}
          </nav>
        )}
      </div>
    </div>
  );
};

export default Navigation;