"use client";

import React from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scan } from 'lucide-react';
import { useScanner } from '@/lib/scanner/use-scanner';
import { useEffect, useRef } from 'react';

interface QRCodeScannerProps {
  onResult?: (result: string) => void;
}

export function QRCodeScanner({ onResult }: QRCodeScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const { isScanning, startScanning, stopScanning, handleResult } = useScanner({ onResult });

  useEffect(() => {
    if (isScanning && !scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scannerRef.current.render(
        (decodedText) => {
          handleResult(decodedText);
          if (scannerRef.current) {
            scannerRef.current.clear();
            scannerRef.current = null;
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    };
  }, [isScanning, handleResult]);

  return (
    <Card className="p-4 w-full max-w-md mx-auto">
      <div className="space-y-4">
        {isScanning ? (
          <div className="relative">
            <div id="qr-reader" className="w-full" />
            <Button
              variant="secondary"
              className="mt-4 w-full"
              onClick={stopScanning}
            >
              Cancel Scanning
            </Button>
          </div>
        ) : (
          <Button
            className="w-full"
            onClick={startScanning}
          >
            <Scan className="mr-2 h-4 w-4" />
            Start QR Scanner
          </Button>
        )}
      </div>
    </Card>
  );
}