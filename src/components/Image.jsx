import { useEffect, useState } from 'react';

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
  const { currentSrc, isLoaded } = useProgressiveImage(src, lqip);
  const imageClassName = buildImageClassName(isLoaded, lqip, className);

  return <img src={currentSrc} alt={alt} className={imageClassName} />;
};

/**
 * Custom hook to handle progressive image loading
 * @param {string} src - High-quality image URL
 * @param {string} [lqip] - Low-quality image URL (optional)
 * @returns {{currentSrc: string, isLoaded: boolean}} Current image source and loading state
 */
function useProgressiveImage(src, lqip) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(lqip || src);

  useEffect(() => {
    // Reset loading state when src changes
    setIsLoaded(false);
    setCurrentSrc(lqip || src);

    const img = new window.Image();
    img.src = src;

    img.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
    };

    img.onerror = () => {
      setIsLoaded(true);
    };

    // Cleanup function
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, lqip]);

  return { currentSrc, isLoaded };
}

/**
 * Build image className based on loading state
 * @param {boolean} isLoaded - Whether the high-quality image has loaded
 * @param {string} [lqip] - Low-quality image URL (optional)
 * @param {string} [className] - Additional CSS classes
 * @returns {string} Complete className string
 */
function buildImageClassName(isLoaded, lqip, className) {
  const classes = ['transition-all', 'duration-300'];
  if (className) {
    classes.push(className);
  }

  // Loading state classes
  if (!isLoaded && lqip) {
    classes.push('scale-110', 'blur-sm');
  } else {
    classes.push('blur-0', 'scale-100');
  }

  return classes.join(' ');
}

export default Image;
