import React, { useState } from "react";
import BarcodeScanner from "../components/barcodeScanner";

const ScanPage = () => {
  const [scannedCode, setScannedCode] = useState("");

  const handleScanSuccess = (decodedText:any) => {
    console.log("Scanned Code:", decodedText);
    setScannedCode(decodedText);
  };

  const handleScanError = (error:any) => {
    console.error("Scan Error:", error);
  };

  return (
    <div>
      <h1>Scan a Barcode</h1>
      <BarcodeScanner onScanSuccess={handleScanSuccess} onScanError={handleScanError} />
      {scannedCode && <p>Scanned Code: {scannedCode}</p>}
    </div>
  );
};

export default ScanPage;
