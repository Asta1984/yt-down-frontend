import { Link, useLocation } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";

interface NavbarProps {
  title?: string;
  subtitle?: string;
}

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Queue", href: "/queue" },
];

export function Navbar({
  title = "Freedowm",
  subtitle = "download anything, any format",
}: NavbarProps) {
  const location = useLocation();

  const { scrollY } = useScroll();

  // 0 opacity at the top -> 90% opacity after 100px of scrolling
  const backgroundOpacity = useTransform(
    scrollY,
    [0, 100],
    [0, 0.5]
  );

  return (
    <motion.header
      className="border-b border-zinc-800/10 px-6 py-4 backdrop-blur-md"
      style={{
        backgroundColor: useTransform(
          backgroundOpacity,
          (opacity) => `rgba(0, 0, 0, ${opacity})`
        ),
      }}
    >
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-amber-700 md:text-2xl font-medium tracking-tight">
            {title}
          </span>

          <span className="text-xs text-accent-foreground">
            {subtitle}
          </span>
        </div>

        <nav className="flex items-center gap-4">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;

            return (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm transition-colors ${
                  isActive
                    ? "text-amber-700 font-medium"
                    : "text-accent-foreground hover:text-amber-700"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </motion.header>
  );
}