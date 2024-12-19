"use client";

import React from 'react';
import Webcam from 'react-webcam';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scan } from 'lucide-react';
import { useScanner } from './../../lib/scanner/use-scanner';
import { useCallback, useRef } from 'react';

interface BarcodeScannerProps {
  onResult?: (result: string) => void;
}

export function BarcodeScanner({ onResult }: BarcodeScannerProps) {
  const webcamRef = useRef<Webcam>(null);
  const { isScanning, startScanning, stopScanning, handleResult } = useScanner({ onResult });

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      // In a real implementation, we would process the image here
      // and detect barcodes using a barcode detection library
      handleResult("Demo barcode result");
    }
  }, [handleResult]);

  return (
    <Card className="p-4 w-full max-w-md mx-auto">
      <div className="space-y-4">
        {isScanning ? (
          <div className="relative aspect-square w-full">
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full h-full rounded-lg"
              videoConstraints={{
                facingMode: 'user',
                width: 1280,
                height: 720
              }}
            />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              <Button
                variant="secondary"
                onClick={capture}
              >
                Capture
              </Button>
              <Button
                variant="secondary"
                onClick={stopScanning}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            className="w-full"
            onClick={startScanning}
          >
            <Scan className="mr-2 h-4 w-4" />
            Start Barcode Scanner
          </Button>
        )}
      </div>
    </Card>
  );
}