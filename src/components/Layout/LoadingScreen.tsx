import { useEffect, useState } from 'react';
import styles from './LoadingScreen.module.css'

interface LoadingScreenProps {
  onFinish?: () => void; 
}

export default function LoadingScreen({ onFinish } : LoadingScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);

   useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      
      if (onFinish) {
        setTimeout(onFinish, 500); 
      }
    }, 1000); // tempo mínimo do loading

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className={`${styles.loadingOverlay} ${fadeOut ? styles.fadeOut : ''}`}>
      <div className={styles.spinner}></div>
    </div>
  );
}
