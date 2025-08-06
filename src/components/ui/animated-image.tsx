"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

interface AnimatedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  quality?: number;
}

export function AnimatedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = "",
  priority = false,
  sizes,
  style,
  objectFit = "cover",
  quality,
}: AnimatedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const imageStyle: React.CSSProperties = {
    objectFit: objectFit,
    ...style,
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading state */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 bg-muted flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-6 h-6 text-muted-foreground" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error state */}
      {hasError ? (
        <div className="absolute inset-0 bg-muted/50 flex flex-col items-center justify-center text-muted-foreground">
          <svg
            className="w-8 h-8 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <span className="text-xs">Failed to load image</span>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0 : 1 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            fill={fill}
            sizes={sizes}
            priority={priority}
            onLoad={handleLoad}
            onError={handleError}
            style={imageStyle}
            className={`transition-all duration-500 ${
              isLoading ? "scale-[1.01] blur-sm" : "scale-100 blur-0"
            }`}
          />
        </motion.div>
      )}
    </div>
  );
}

export default AnimatedImage;
