"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import MeterGauge from "@/components/ui/gauge";
import Image from "next/image";
import { Share2 } from "lucide-react";
import { Crown } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { redirect, useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { toast } from "react-toastify";

import Script from "next/script";
import { Html5Qrcode } from "html5-qrcode";
import { Html5QrcodeScanner } from "html5-qrcode";

import structuredFormatText from "@/components/structuredFormatText";
import Loader from "@/components/ui/loading_ui";

import ingrBg from "@/public/default_image.png";
import { ScanBarcode } from "lucide-react";
import ScanPage from "@/custom-Hooks/scanPage";
import { useStore } from "@/zustand/zustandStore";
import { error } from "console";

var html5QrCode: any;
interface Product {
  product_name?: string;
  ingredients_text?: string;
  brands?: string;
  image_url?: string;
  [key: string]: any; // To allow additional dynamic properties if needed
}

var ApiLimitCountIncrement: any;

// const scanBarcode = async (
//   setloading: any,
//   setscanning: any,
//   setdecodedtext: any,
//   setproductInfo: any,
//   setsummaryText: any,
//   setsummaryIndicator: any,
//   sethealthRatingIndicator: any,
//   session: any,
//   updateCount: any
// ) => {
//   html5QrCode = new Html5Qrcode(/* element id */ "reader");
//   html5QrCode
//     .start(
//       { facingMode: "user" },
//       {
//         fps: 10, // Optional, frame per seconds for qr code scanning
//         qrbox: { width: 325, height: 325 }, // Optional, if you want bounded box UI
//       },
//       (decodedText: any, decodedResult: any) => {
//         // do something when code is read
//         console.log("scanned value:", decodedText, decodedResult);
//         setdecodedtext(decodedText);
//         // alert(`decoded text:${decodedText}`);
//         toast(`decoded text:${decodedText}`, {
//           position: "top-center",
//           autoClose: 5000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: "light",
//         });
//         html5QrCode
//           .stop()
//           .then((ignore: any) => {
//             setscanning(false);
//             sendScannedCodeToBackend(
//               setloading,
//               decodedText,
//               setproductInfo,
//               setsummaryText,
//               setsummaryIndicator,
//               sethealthRatingIndicator,
//               session,
//               updateCount
//             );

//             ApiLimitCountIncrement(session, updateCount);
//             // QR Code scanning is stopped.
//           })
//           .catch((err: any) => {
//             console.log("error in scanning:", err);
//             // Stop failed, handle it.
//           });
//       },
//       (errorMessage: any) => {
//         // parse error, ignore it.
//         console.log(errorMessage);
//       }
//     )
//     .catch((err: any) => {
//       // Start failed, handle it.
//       console.log('error message in scanBarcode:',err.message)
//     });
// };

const scanBarcode = async (
  setloading: any,
  setscanning: any,
  setdecodedtext: any,
  setproductInfo: any,
  setsummaryText: any,
  setsummaryIndicator: any,
  sethealthRatingIndicator: any,
  session: any,
  updateCount: any
) => {
  // Request camera access and list available cameras
  Html5Qrcode.getCameras()
    .then((devices) => {
      /**
       * devices would be an array of objects of type:
       * { id: "id", label: "label" }
       */
      if (devices && devices.length) {
        var cameraId = devices[0].id; // Use the first camera
        html5QrCode = new Html5Qrcode("reader");

        html5QrCode
          .start(
            { deviceId: { exact: cameraId } }, // Use the selected camera
            {
              fps: 10, // Optional, frame per seconds for QR code scanning
              qrbox: { width: 325, height: 325 }, // Optional, bounded box UI
            },
            (decodedText: any, decodedResult: any) => {
              // Process decoded QR code
              console.log("scanned value:", decodedText, decodedResult);
              setdecodedtext(decodedText);

              toast(`decoded text:${decodedText}`, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });

              html5QrCode
                .stop()
                .then((ignore: any) => {
                  setscanning(false);

                  sendScannedCodeToBackend(
                    setloading,
                    decodedText,
                    setproductInfo,
                    setsummaryText,
                    setsummaryIndicator,
                    sethealthRatingIndicator,
                    session,
                    updateCount
                  );

                  ApiLimitCountIncrement(session, updateCount);
                })
                .catch((err: any) => {
                  console.log("error in stopping scanner:", err);
                });
            },
            (errorMessage: any) => {
              // Handle scanning errors
              console.log(errorMessage);
            }
          )
          .catch((err: any) => {
            // Handle start failure
            console.log("error message in scanBarcode:", err.message);
          });
      } else {
        console.log("No cameras found.");
        toast("No cameras found. Please check your device settings.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    })
    .catch((err) => {
      // Handle camera access error
      console.error("Error accessing cameras:", err);
      toast("Error accessing cameras. Please grant camera permissions.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    });
};

const sendScannedCodeToBackend = async (
  setloading: any,
  decodedText: string,
  setproductInfo: any,
  setsummaryText: any,
  setsummaryIndicator: any,
  sethealthRatingIndicator: any,
  session: any,
  updateCount: any
) => {
  try {
    setloading(true);
    // console.log("session in front end scan:", session);
    const res = await fetch(
      `/api/getingredients/${session?.user?.email}/${decodedText}`
    );
    const data = await res.json();
    const objData = await JSON.parse(data.data);
    setproductInfo(objData);
    // console.log(
    //   "data fetched in sendScannedCodeToBackend:",
    //   objData.product.ingredients_text
    // );

    if (!res.ok) {
      toast("Sorry product not found!!!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }

    if (objData.product.ingredients_text) {
      // chatgptApiCall();
      geminiApiCall(
        objData.product.ingredients_text,
        setloading,
        setsummaryText,
        setsummaryIndicator,
        sethealthRatingIndicator,
        useStore,
        session
      );
    }

    // setloading(false);
  } catch (error: any) {
    console.log("error in sendscannedcodetobackend function:", error.message);
  } finally {
  }
};

const chatgptApiCall = async () => {
  const res = await fetch("/api/chatgpt");
  const resMessFromChatgpt = await res.json();
  // console.log("response message from chatgpt!!!:", resMessFromChatgpt);
};

const geminiApiCall = async (
  productIngredient: string,
  setloading: any,
  setsummaryText: any,
  setsummaryIndicator: any,
  sethealthRatingIndicator: any,
  router: any,
  session: any
) => {
  try {
    setloading(true);

    const res = await fetch(`/api/gemini/${session?.user?.email}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productIngredient),
    });

    const resMessFromgemini = await res.json();
    // console.log("response message from chatgpt!!!:", resMessFromgemini.message);

    setsummaryText(resMessFromgemini.message);
    setsummaryIndicator(resMessFromgemini.summary);
    sethealthRatingIndicator(resMessFromgemini.healthrating);
    setloading(false);
  } catch (error: any) {
    console.log("error in geminiApiCall function:", error.message);
  } finally {
  }
};

const ApiLimitCount = async (session: any) => {
  const apiLimitStatus = await fetch(
    `/api/apilimit/checkapilimit/${session?.user?.email}`
  );
  const result = await apiLimitStatus.json();
  // console.log("result of apilimit:", result.count);
  return result;
};

ApiLimitCountIncrement = async (session: any, updateCount: any) => {
  const apiLimitStatus = await fetch(
    `/api/apilimit/incrementapilimit/${session?.user?.email}`
  );
  const result = await apiLimitStatus.json();
  // console.log("result of apilimitincrement count:", result.count);
  updateCount(result.count);
  return result;
};

const BackendScanPage = () => {
  const [loading, setloading] = useState(false);
  const [scanning, setscanning] = useState(false);
  const [decodedtext, setdecodedtext] = useState("");
  const [summaryText, setsummaryText] = useState("");
  const [summaryIndicator, setsummaryIndicator] = useState("");
  const [healthRatingIndicator, sethealthRatingIndicator] = useState("");
  const [productInfo, setproductInfo] = useState<Product>({});
  const [searchInput, setSearchInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { data: session, status } = useSession();
  const storeVal = useStore((state: any) => state.count);
  const updateCount = useStore((state: any) => state.updateCount);
  const updateModel = useStore((state: any) => state.updateModel);

  // console.log("storeval from zustand in scan:", storeVal);// Logs the current count from zustand

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    const checkApiLimit = async () => {
      if (session) {
        const result = await ApiLimitCount(session);
        updateCount(result.count);
        if (result.status == 202) {
          updateModel(true);
        } else {
          updateModel(false);
        }
        // console.log("apilimitresult status:)", result);
        if (result.status == 403) {
          // console.log("!result in scan:", result);
          // alert("free tier limit is up , please upgrade your plan");
          toast(`Free tier limit is up, please upgrade your plan!`, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          router.push("/upgrade");
        }
      }
    };

    checkApiLimit();
  }, [session,updateCount,updateModel,router]);

  // console.log(loading);

  const handleInputChange = (e: any) => {
    setSearchInput(e.target.value); // Update search input state
  };

  const handleSearchSubmit = async (e: any) => {
    e.preventDefault(); // Prevent default form submission
    setloading(true);
    setError(null);

    if (!searchInput.trim()) {
      setError("Please enter a barcode.");
      toast("Please enter barcode id of product!!!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setloading(false);
      return;
    }

    try {
      sendScannedCodeToBackend(
        setloading,
        searchInput,
        setproductInfo,
        setsummaryText,
        setsummaryIndicator,
        sethealthRatingIndicator,
        session,
        updateCount
      );

      setSearchInput("");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setloading(false);
    }
  };

  return (
    <div>
      {!scanning ? (
        <div className="p-5 mt-1 w-full">
          <div className=" flex gap-2 justify-between">
            <div className="flex gap-2">
              <div
                onClick={async () => {
                  await setscanning(true);
                  scanBarcode(
                    setloading,
                    setscanning,
                    setdecodedtext,
                    setproductInfo,
                    setsummaryText,
                    setsummaryIndicator,
                    sethealthRatingIndicator,
                    session,
                    updateCount
                  );
                }}
                className="flex cursor-pointer items-center gap-2  w-32 bg-green-200 p-2 rounded-xl sm:w-32 md:w-32 hover:bg-green-300"
              >
                <ScanBarcode size={50} color="#1aeb31" />

                <div className="flex flex-col ">
                  <p className="text-lg font-semibold">Scan</p>
                  <p className="text-xs">&Uncover</p>
                </div>
              </div>

              <div className="hidden sm:block">
                <form onSubmit={handleSearchSubmit} className="">
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
                      value={searchInput}
                      onChange={handleInputChange}
                      className="block w-full  p-5 ps-10 text-lg text-gray-900 border border-gray-300 rounded-lg bg-purple-300 placeholder-gray-800 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-800 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Search by barcode id..."
                      required
                    />
                  </div>
                </form>
              </div>
            </div>

            <div className="flex gap-1">
              <div
                onClick={(e) => {
                  router.push("/upgrade");
                }}
                className=" cursor-pointer flex items-center gap-2  w-32 bg-yellow-200 p-2 rounded-xl sm:w-40 md:w-48 hover:bg-yellow-300"
              >
                <Crown size={50} color="#fbbe28" />
                <div className="flex flex-col ">
                  <p className="text-lg font-semibold">Upgrade</p>
                </div>
              </div>

              <div className="hidden sm:block">
                <div className="flex items-center gap-2  w-32 bg-blue-200 p-2 py-3.5 rounded-xl sm:w-32 md:w-32 hover:bg-blue-300 cursor-pointer">
                  <Share2 size={50} color="#066274" />
                  <div className="flex flex-col ">
                    <p className="text-lg font-semibold">Share</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-600 rounded-md p-1 my-1 ">
            <div className="my-2 w-full">
              <h4 className="text-xl font-bold  text-white">Ingredients</h4>
              <div>
                <div className="p-1.5 bg-white text-xs rounded-md w-full   flex gap-1">
                  <div className=" ">
                    <div className="flex flex-col items-center justify-center p-2 m-0.5 rounded-sm bg-slate-200">
                      <Image
                        className="rounded-md m-3"
                        // src={ingrBg}
                        src={productInfo?.product?.image_url || ingrBg}
                        width={300}
                        height={300}
                        alt="Picture of the author"
                      />
                      <p className="text-gray-700 textlg font-bold p-2">
                        {/* malkist biscuits */}
                        {!productInfo?.product
                          ? "Scan a product to get insights"
                          : productInfo.product.product_name ||
                            "No information available"}
                      </p>
                    </div>
                  </div>

                  <div className="w-full  p-2 font-sans text-lg font-normal">
                    {productInfo?.product?.ingredients_text ||
                      "No ingredients available"}
                    {/* maltodextrin */}
                  </div>
                </div>
              </div>
            </div>

            <div className="my-2 w-full">
              <h4 className="text-xl font-bold  text-white">Summary</h4>
              <div className="p-1.5 bg-slate-50 text-md font-normal  rounded-md w-full h-[30vw]  overflow-y-auto scrollbar-none mx-auto">
                {/* bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-opacity-5 */}

                {/* {loading? <p>loading...</p>: <div>{summaryText}</div>} */}
                {loading ? (
                  <Loader />
                ) : !summaryText ? (
                  <div>Scan to ingredients summary</div>
                ) : (
                  <div>{structuredFormatText(summaryText)}</div>
                )}
              </div>
            </div>

            <div className="flex gap-2 items-center m-2">
              <div className="">
                <MeterGauge
                  value={healthRatingIndicator ? healthRatingIndicator : 0}
                />
              </div>
              <div className="text-white overflow-auto w-full h-20">
                <div className=" bg-gradient-to-r from-green-500 via-orange-400 to-red-400 rounded-md p-1 overflow-y-scroll scrollbar-none">
                  {loading ? (
                    <Loader />
                  ) : !summaryIndicator ? (
                    <div>Scan to get personalized health summary!!</div>
                  ) : (
                    summaryIndicator
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ width: "73.9vw", height: "100%" }} id="reader"></div>
      )}
    </div>
  );
};

export default BackendScanPage;
