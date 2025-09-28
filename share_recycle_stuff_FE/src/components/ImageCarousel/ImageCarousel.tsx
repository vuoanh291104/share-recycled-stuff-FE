import { useState } from 'react';
import Icon from '@ant-design/icons';
import ArrowLeftIcon from '../icons/ArrowLeftIcon';
import ArrowRightIcon from '../icons/ArrowRightIcon';
import styles from './ImageCarousel.module.css';

interface ImageCarouselProps {
  images: string[];
  currentIndex: number;
  hasMoreImages: boolean;
  onImageChange?: (index: number) => void;
}

const ImageCarousel = ({ 
  images, 
  currentIndex, 
  hasMoreImages,
  onImageChange 
}: ImageCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(currentIndex);

  const handlePrevious = () => {
    const newIndex = activeIndex > 0 ? activeIndex - 1 : images.length - 1;
    setActiveIndex(newIndex);
    onImageChange?.(newIndex);
  };

  const handleNext = () => {
    const newIndex = activeIndex < images.length - 1 ? activeIndex + 1 : 0;
    setActiveIndex(newIndex);
    onImageChange?.(newIndex);
  };

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
    onImageChange?.(index);
  };

  return (
    <div className={styles.carousel}>
      <div className={styles.imageContainer}>
        <img
          src={images[activeIndex]}
          alt={`Post image ${activeIndex + 1}`}
          className={styles.image}
        />
        
        {hasMoreImages && (
          <>
            <button 
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={handlePrevious}
              aria-label="Previous image"
            >
              <Icon 
                component={ArrowLeftIcon} 
                className={styles.navIcon}
              />
            </button>
            
            <button 
              className={`${styles.navButton} ${styles.nextButton}`}
              onClick={handleNext}
              aria-label="Next image"
            >
              <Icon 
                component={ArrowRightIcon} 
                className={styles.navIcon}
              />
            </button>
          </>
        )}
      </div>
      
      {images.length > 1 && (
        <div className={styles.indicators}>
          {images.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${index === activeIndex ? styles.activeDot : styles.inactiveDot}`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;