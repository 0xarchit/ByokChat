"use client";

import React, { useRef, useEffect, ReactNode, useState } from "react";

interface AnimatedContentProps {
  children: ReactNode;
  distance?: number;
  direction?: "vertical" | "horizontal";
  reverse?: boolean;
  duration?: number;
  delay?: number;
  threshold?: number;
}

const AnimatedContentOptimized: React.FC<AnimatedContentProps> = ({
  children,
  distance = 100,
  direction = "vertical",
  reverse = false,
  duration = 0.8,
  delay = 0,
  threshold = 0.1,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  const getTransform = () => {
    if (isVisible) return "translate3d(0, 0, 0)";

    const dir = reverse ? -1 : 1;
    if (direction === "vertical") {
      return `translate3d(0, ${distance * dir}px, 0)`;
    }
    return `translate3d(${distance * dir}px, 0, 0)`;
  };

  const animationStyle = {
    opacity: isVisible ? 1 : 0,
    transform: getTransform(),
    transition: `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s`,
    willChange: isVisible ? "auto" : "opacity, transform",
  } as React.CSSProperties;

  return (
    <div ref={ref} style={animationStyle}>
      {children}
    </div>
  );
};

export default AnimatedContentOptimized;
