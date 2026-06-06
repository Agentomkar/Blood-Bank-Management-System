"use client";

import { useRef, useState, type ReactNode } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  href?: string;
}

export default function MagneticButton({
  children,
  className = "",
  strength = 0.3,
  onClick,
  href,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;
    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const style = {
    transform: `translate(${position.x}px, ${position.y}px)`,
    transition: position.x === 0 ? "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)" : "transform 0.15s ease-out",
  };

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={className}
        style={style}
        data-magnetic
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      className={className}
      style={style}
      data-magnetic
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
