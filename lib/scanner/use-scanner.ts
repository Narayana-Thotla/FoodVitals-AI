"use client";

import { useState, useCallback } from 'react';

interface UseScannerProps {
  onResult?: (result: string) => void;
}

export function useScanner({ onResult }: UseScannerProps) {
  const [isScanning, setIsScanning] = useState(false);

  const handleResult = useCallback((result: string) => {
    onResult?.(result);
    setIsScanning(false);
  }, [onResult]);

  const startScanning = useCallback(() => {
    setIsScanning(true);
  }, []);

  const stopScanning = useCallback(() => {
    setIsScanning(false);
  }, []);

  return {
    isScanning,
    startScanning,
    stopScanning,
    handleResult
  };
}