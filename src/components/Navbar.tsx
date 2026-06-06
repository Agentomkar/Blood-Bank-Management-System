"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Droplets,
  Phone,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  ChevronDown,
  Activity,
  Users,
  Building2,
  BarChart3,
  Zap,
  Shield,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { useTheme } from "./ThemeContext";
import { useAudio, soundEngine } from "./AudioController";
import MagneticButton from "./MagneticButton";

const navLinks = [
  { href: "#inventory", label: "Inventory" },
  { href: "#donate", label: "Donate" },
  { href: "#emergency", label: "Emergency" },
  { href: "#dashboard", label: "Dashboard" },
  { href: "#features", label: "Features" },
  { href: "#contact", label: "Contact" },
];

const megaMenuItems = [
  {
    icon: Activity,
    title: "Blood Tracking",
    desc: "Real-time unit tracking from donor to patient",
    href: "#inventory",
    color: "text-crimson-400",
    bg: "bg-crimson-600/10",
  },
  {
    icon: Users,
    title: "Donor Management",
    desc: "Register and manage donor database",
    href: "#donate",
    color: "text-blue-400",
    bg: "bg-blue-600/10",
  },
  {
    icon: Zap,
    title: "Emergency Requests",
    desc: "Coordinate urgent blood requests",
    href: "#emergency",
    color: "text-amber-400",
    bg: "bg-amber-600/10",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    desc: "Comprehensive inventory analytics",
    href: "#dashboard",
    color: "text-emerald-400",
    bg: "bg-emerald-600/10",
  },
  {
    icon: Shield,
    title: "Compliance",
    desc: "FDA & HIPAA compliance tools",
    href: "#features",
    color: "text-purple-400",
    bg: "bg-purple-600/10",
  },
  {
    icon: Building2,
    title: "Hospital Network",
    desc: "120+ partner hospitals connected",
    href: "#dashboard",
    color: "text-cyan-400",
    bg: "bg-cyan-600/10",
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { enabled: audioEnabled, toggle: toggleAudio } = useAudio();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay: 2.8, ease: [0.76, 0, 0.24, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-color)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3 group" data-magnetic>
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-crimson-600 to-blood-dark flex items-center justify-center group-hover:shadow-lg group-hover:shadow-crimson-600/30 transition-all duration-300 group-hover:scale-110">
                  <Droplets className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-crimson-500 rounded-full animate-pulse-glow" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight">
                Life<span className="text-crimson-500">Stream</span>
              </span>
            </a>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {/* Platform Mega Menu Trigger */}
              <div
                className="relative mega-menu-trigger"
                onMouseEnter={() => setMegaOpen(true)}
                onMouseLeave={() => setMegaOpen(false)}
              >
                <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200 rounded-lg hover:bg-white/5">
                  Platform
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Mega Menu Dropdown */}
                <AnimatePresence>
                  {megaOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                      className="absolute top-full left-1/2 -translate-x-1/2 w-[640px] pt-3"
                    >
                      <div className="glass-strong rounded-2xl p-6 shadow-2xl shadow-black/20">
                        <div className="grid grid-cols-2 gap-3">
                          {megaMenuItems.map((item, i) => (
                            <motion.a
                              key={item.title}
                              href={item.href}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-all group/item"
                              onClick={() => {
                                setMegaOpen(false);
                                soundEngine.click();
                              }}
                            >
                              <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform`}>
                                <item.icon className={`w-5 h-5 ${item.color}`} />
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-[var(--text-primary)] mb-0.5">
                                  {item.title}
                                </div>
                                <div className="text-xs text-[var(--text-muted)]">
                                  {item.desc}
                                </div>
                              </div>
                            </motion.a>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
                          <a href="#features" className="flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-crimson-400 transition-colors" onClick={() => setMegaOpen(false)}>
                            <BookOpen className="w-3.5 h-3.5" />
                            View all features
                          </a>
                          <a href="#donate" className="flex items-center gap-2 text-xs font-medium text-crimson-400 hover:text-crimson-300 transition-colors" onClick={() => setMegaOpen(false)}>
                            Get started
                            <ArrowRight className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200 rounded-lg hover:bg-white/5"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Right Controls */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Audio Toggle */}
              <MagneticButton
                strength={0.2}
                onClick={toggleAudio}
                className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors relative group"
              >
                {audioEnabled ? (
                  <Volume2 className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-crimson-400 transition-colors" />
                ) : (
                  <VolumeX className="w-4 h-4 text-[var(--text-muted)] group-hover:text-crimson-400 transition-colors" />
                )}
              </MagneticButton>

              {/* Theme Toggle */}
              <MagneticButton
                strength={0.2}
                onClick={toggleTheme}
                className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors group"
              >
                <AnimatePresence mode="wait">
                  {theme === "dark" ? (
                    <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Sun className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-amber-400 transition-colors" />
                    </motion.div>
                  ) : (
                    <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Moon className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-crimson-400 transition-colors" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </MagneticButton>

              {/* Emergency */}
              <a
                href="tel:+1800BLOOD"
                className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-muted)] hover:text-crimson-400 transition-colors rounded-lg"
                data-magnetic
              >
                <Phone className="w-4 h-4" />
                <span className="hidden xl:inline">Emergency</span>
              </a>

              {/* CTA */}
              <MagneticButton
                href="#donate"
                className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2"
              >
                <Droplets className="w-4 h-4" />
                Donate Now
              </MagneticButton>
            </div>

            {/* Mobile Toggle */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-[var(--text-secondary)]" />
                ) : (
                  <Moon className="w-5 h-5 text-[var(--text-secondary)]" />
                )}
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[var(--overlay-bg)] backdrop-blur-xl pt-24 px-6 lg:hidden overflow-y-auto"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="text-2xl font-display font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-3 border-b border-[var(--border-color)]"
                >
                  {link.label}
                </motion.a>
              ))}

              {/* Mobile Audio Toggle */}
              <button
                onClick={toggleAudio}
                className="flex items-center gap-3 text-lg text-[var(--text-secondary)] py-3 border-b border-[var(--border-color)]"
              >
                {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                Sound Effects: {audioEnabled ? "On" : "Off"}
              </button>

              <MagneticButton
                href="#donate"
                onClick={() => setMobileOpen(false)}
                className="btn-primary mt-6 px-6 py-4 rounded-xl text-center text-lg font-semibold text-white"
              >
                Donate Now
              </MagneticButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
