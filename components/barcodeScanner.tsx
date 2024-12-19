import React, { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {Html5QrcodeScanner} from "html5-qrcode"



type scanInput = {
    onScanSuccess:()=>string|number,
     onScanError:()=>void
}

const BarcodeScanner = ({ onScanSuccess, onScanError }: any) => {
//   const scannerRef = useRef(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  

  useEffect(() => {

    const html5QrCode = new Html5Qrcode("scanner");

    html5QrCode
      .start(
        { facingMode: "user" }, 
        // Use rear camera
        {
          fps: 10, // Frames per second
          qrbox: { width: 250, height: 250 }, // Scanning box
        },
        (decodedText) => {
          onScanSuccess(decodedText);
          console.log(decodedText)
        },
        (errorMessage) => {
          if (onScanError) {
            onScanError(errorMessage);
          }
        }
      )
      .catch((err:any) => console.error("Error starting scanner:", err));

//-----------------------------------------------------------------------------

scannerRef.current = new Html5QrcodeScanner(
    "qr-reader",
    { fps: 10, qrbox: { width: 250, height: 250 } },
    false
  );

  scannerRef.current.render(
    (decodedText) => {
        onScanSuccess(decodedText);
      if (scannerRef.current) {
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    },
    (error) => {
      console.error(error);
    }
  );

    // Cleanup on unmount
    return () => {
      html5QrCode.stop().then((ignore:any) => {
        console.log("stopped successfully>:",ignore)
      }).catch((err:any) => console.error("Error stopping scanner:", err));
    };
  }, [onScanSuccess, onScanError]);

  return <div id="scanner"  style={{ width: "600px", height: "100px" }}></div>;
};

export default BarcodeScanner;
