"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navigation.module.css";

interface NavigationProps {
  themeToggle?: React.ReactNode;
}

export default function Navigation({ themeToggle }: NavigationProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Prevent background scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div className={styles.navWrapper}>
      {/* Desktop Navigation */}
      <nav className={styles.desktopNav}>
        <Link 
          href="/" 
          className={`${styles.link} ${pathname === "/" ? styles.active : ""}`}
        >
          Team Builder
        </Link>
        <Link 
          href="/type-analyzer" 
          className={`${styles.link} ${pathname === "/type-analyzer" ? styles.active : ""}`}
        >
          Type Analyzer
        </Link>
        <div className={styles.desktopToggle}>
          {themeToggle}
        </div>
      </nav>

      {/* Mobile Hamburger Button */}
      <button 
        className={`${styles.hamburger} ${isOpen ? styles.openHamburger : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Mobile Backdrop */}
      <div 
        className={`${styles.backdrop} ${isOpen ? styles.backdropOpen : ""}`}
        onClick={() => setIsOpen(false)}
      />
      
      {/* Mobile Side Drawer */}
      <div className={`${styles.mobileDrawer} ${isOpen ? styles.drawerOpen : ""}`}>
        <div className={styles.drawerLinks}>
          <Link 
            href="/" 
            className={`${styles.link} ${pathname === "/" ? styles.active : ""}`}
            onClick={() => setIsOpen(false)}
          >
            Team Builder
          </Link>
          <Link 
            href="/type-analyzer" 
            className={`${styles.link} ${pathname === "/type-analyzer" ? styles.active : ""}`}
            onClick={() => setIsOpen(false)}
          >
            Type Analyzer
          </Link>
        </div>
        
        <div className={styles.drawerFooter}>
          {themeToggle}
        </div>
      </div>
    </div>
  );
}
