import { useState, useEffect } from 'react';

/**
 * Image component with LQIP (Low Quality Image Placeholder) support
 * Shows a blurred low-quality image while the full-quality image loads
 * @param {object} props - Component props
 * @param {string} props.src - High-quality image URL
 * @param {string} [props.lqip] - Low-quality image URL or base64 data URL (optional)
 * @param {string} props.alt - Alt text for the image
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} Image element with LQIP loading
 */
const Image = ({ src, lqip, alt, className = '' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(lqip || src);

  useEffect(() => {
    // Reset loading state when src changes
    setIsLoaded(false);
    setCurrentSrc(lqip || src);

    // Don't load high-quality image if it's the same as LQIP
    if (lqip === src) {
      setIsLoaded(true);
      return;
    }

    // Preload the high-quality image
    const img = new window.Image();
    img.src = src;

    img.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
    };

    img.onerror = () => {
      // If high-quality fails to load, mark as loaded anyway to remove blur
      setIsLoaded(true);
    };

    // Cleanup function
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, lqip]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={`transition-all duration-300 ${
        !isLoaded && lqip ? 'blur-sm scale-110' : 'blur-0 scale-100'
      } ${className}`}
    />
  );
};

export default Image;
