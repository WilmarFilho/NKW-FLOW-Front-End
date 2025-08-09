// Libs
import { useState, useCallback } from 'react';

interface UseDragAndDropFileProps {
  onDropFile: (file: File) => void;
}

export const useDragAndDropFile = ({ onDropFile }: UseDragAndDropFileProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      onDropFile(file);
    }
  }, [onDropFile]);

  return {
    isDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
};