"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import MeterGauge from "@/components/ui/gauge";
import Image from "next/image";
import { Share2 } from "lucide-react";
import { Crown } from "lucide-react";
import Script from "next/script";
import { Html5Qrcode } from "html5-qrcode";
import { Html5QrcodeScanner } from "html5-qrcode";


import ingrBg from "./../../../../public/freepik__expand__48121.png";
import {
  ScanBarcode,
  HeartPulse,
  History,
  CircleFadingArrowUp,
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  Fullscreen,
} from "lucide-react";
import ScanPage from "@/custom-Hooks/scanPage";

import backendScanPage from "@/components/backendScanPage";
// import BarcodeScanner from "@/components/barcodeScanner";

const Page = () => {
  const [loading, setloading] = useState(false);
  const [scannedCode, setScannedCode] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [qrResult, setQrResult] = useState<string>("");
  const [barcodeResult, setBarcodeResult] = useState<string>("");

  useEffect(() => {
    setloading(true);
  }, []);

  var html5QrcodeScanner: any;
  var html5QrCode: any;

  function onScanSuccess(decodedText: any, decodedResult: any) {
    // Handle on success condition with the decoded text or result.
    console.log(`Scan result: ${decodedText}`, decodedResult);
    alert(`decoded Barcode: ${decodedText}`);
    // ...
    // html5QrcodeScanner.clear();

    html5QrCode
      .stop()
      .then((ignore: any) => {
        // QR Code scanning is stopped.
      })
      .catch((err: any) => {
        // Stop failed, handle it.
      });

    // ^ this will stop the scanner (video feed) and clear the scan area.
  }

  function onScanError(errorMessage: any) {
    console.log("error message in onScanError:", errorMessage);
  }

  // const scanBarcode = async (e: any) => {
  //   html5QrcodeScanner = new Html5QrcodeScanner(
  //     "reader",
  //     { fps: 10, qrbox: 250 },
  //     true
  //   );

  //   html5QrcodeScanner.render(onScanSuccess, onScanError);

  //   // setShowScanner(true);
  //   console.log("scanned value in scan Page:", html5QrcodeScanner);
  // };

  const scanBarcode = async () => {
    html5QrCode = new Html5Qrcode(/* element id */ "reader");
    html5QrCode
      .start(
        { facingMode: "user" },
        {
          fps: 10, // Optional, frame per seconds for qr code scanning
          qrbox: { width: 250, height: 250 }, // Optional, if you want bounded box UI
        },
        (decodedText: any, decodedResult: any) => {
          // do something when code is read
          console.log("scanned value:", decodedText, decodedResult);
          alert(`decoded text:${decodedText}`);
          html5QrCode
            .stop()
            .then((ignore: any) => {
              // QR Code scanning is stopped.
            })
            .catch((err: any) => {
              // Stop failed, handle it.
            });
        },
        (errorMessage: any) => {
          // parse error, ignore it.
          console.log(errorMessage);
        }
      )
      .catch((err: any) => {
        // Start failed, handle it.
      });
  };

  // const handleScanSuccess = (decodedText: any) => {
  //   console.log("Scanned Code:", decodedText);
  //   setScannedCode(decodedText);
  //   setShowScanner(false);
  // };

  // const handleScanError = (error: any) => {
  //   console.error("Scan Error:", error);
  //   navigator.mediaDevices
  //     .getUserMedia({ video: true })
  //     .then((stream) => {
  //       console.log("Camera stream active", stream);
  //     })
  //     .catch((err) => console.error("Camera access denied:", err));
  // };

  return (
    <>
      <div className="mx-3 mt-1">
        <div className="flex gap-2 justify-between">
          <div className="flex gap-2">
            <div
              onClick={scanBarcode}
              className="flex cursor-pointer items-center gap-2  w-32 bg-green-200 p-2 rounded-xl "
            >
              <ScanBarcode size={50} color="#1aeb31" />

              <div className="flex flex-col ">
                <p className="text-lg font-semibold">Scan</p>
                <p className="text-xs">&Uncover</p>
              </div>
              {/* {showScanner && (
              <div>
                <BarcodeScanner
                  onScanSuccess={handleScanSuccess}
                  onScanError={handleScanError}
                />
                {scannedCode && <p>Scanned Code: {scannedCode}</p>}
              </div>
            )} */}

              {/* <BarcodeScanner onResult={setBarcodeResult} /> */}
              {/* {barcodeResult && (
              <div className="mt-4 p-4 bg-secondary rounded-lg">
                <p className="font-medium">Last Scanned Barcode:</p>
                <p className="mt-2 break-all">{barcodeResult}</p>
              </div>
            )} */}
            </div>

            <form className="">
              {/* <label for="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label> */}
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    className="w-6 h-6  text-purple-600 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  id="default-search"
                  className="block w-full  p-5 ps-10 text-lg text-gray-900 border border-gray-300 rounded-lg bg-purple-300 placeholder-gray-800 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-800 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search & discover..."
                  required
                />
                {/* <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button> */}
              </div>
            </form>
          </div>

          <div style={{ width: " 500px" }} id="reader"></div>

          <div className="flex gap-1">
            <div className="flex items-center gap-2  w-32 bg-yellow-200 p-2 rounded-xl ">
              <Crown size={50} color="#fbbe28" />
              <div className="flex flex-col ">
                <p className="text-lg font-semibold">Upgrade</p>
                {/* <p className="text-xs">&Uncover</p> */}
              </div>
            </div>

            <div className="flex items-center gap-2  w-32 bg-blue-200 p-2 rounded-xl ">
              <Share2 size={50} color="#066274" />
              <div className="flex flex-col ">
                <p className="text-lg font-semibold">Share</p>
                {/* <p className="text-xs">&Uncover</p> */}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-600 rounded-md p-1 my-1">
          <div className="my-1 w-full">
            <h4 className="text-xl font-bold  text-white">Ingredients</h4>
            <div>
              <div className="p-1.5 bg-white text-xs rounded-md w-full   flex gap-1">
                <div className=" ">
                  <div className="flex flex-col items-center justify-center p-2 m-0.5 rounded-sm bg-slate-200">
                    <Image
                      className="rounded-md m-3"
                      src={ingrBg}
                      width={300}
                      height={300}
                      alt="Picture of the author"
                    />
                    <p className="text-gray-700 textlg font-bold p-2">
                      malkist biscuits
                    </p>
                  </div>
                </div>

                <div className="w-full  p-2 font-sans text-lg font-normal">
                  maltodextrin
                </div>
              </div>
            </div>
          </div>

          <div className="my-2 w-full">
            <h4 className="text-xl font-bold  text-white">Summary</h4>
            <div className="p-1.5 bg-slate-50 text-md font-normal  rounded-md w-full h-[30vw]  overflow-y-auto scrollbar-none ">
              {/* bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-opacity-5 */}
              maltodextrin
            </div>
          </div>

          <div className="flex gap-2 items-center m-2">
            <div className="">
              <MeterGauge value={80} />
            </div>
            <div className="text-white overflow-auto w-full h-20">
              <p className=" bg-gradient-to-r from-green-400 via-orange-400 to-red-500 rounded-md p-1 overflow-y-scroll scrollbar-none">
                No , its Lorem ipsum, dolor sit amet consectetur adipisicing
                elit. Incidunt. Lorem ipsum dolor sit, amet consectetur
                adipisicing elit. Culpa porro aliquid inventore assumenda nemo
                reprehenderit facilis, explicabo id dolorum facere fuga maiores.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
