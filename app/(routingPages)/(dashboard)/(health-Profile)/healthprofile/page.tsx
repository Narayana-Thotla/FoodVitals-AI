"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { toast } from "react-toastify";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useStore } from "@/zustand/zustandStore";
import { apiLimitCount } from "@/utils/apiLimitCount";

type hecon = {
  id: String;
  allergies: String[];
  chronicConditions: String[];
  pastSurgeries: String[];
  dietaryPreferences: String[];
  familyMedicalHistory: String[];
  createdAt: string;
  updatedAt: string;
};

var loopOfField: any = [
  "allergies",
  "chronicConditions",
  "pastSurgeries",
  "dietaryPreferences",
  "familyMedicalHistory",
];

const healthprofileItems = [
  {
    title: "Add Allergies",
    fields: { loopOfField },
    color: "green",
  },
  {
    title: "Add Chronic Conditions",
    fields: { loopOfField },
    color: "red",
  },
  {
    title: "Add Past Surgeries",
    fields: { loopOfField },
    color: "red",
  },
  {
    title: "Add Dietary Preferences",
    fields: { loopOfField },
    color: "red",
  },
  {
    title: "Add Family Medical History",
    fields: { loopOfField },
    color: "red",
  },
];

console.log(loopOfField[0]);

const page = () => {
  const [inputValue, setInputValue] = useState("");
  const [userHealthData, setuserHealthData] = useState<hecon[]>([]);
  const storeVal = useStore((state: any) => state.count);
  const updateCount = useStore((state: any) => state.updateCount);
  const updateModel = useStore((state: any) => state.updateModel);

  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }
    const allHealthCon = async () => {
      const result = await apiLimitCount(session);
      updateCount(result.count);
      if (result.status == 202) {
        updateModel(true);
      } else {
        updateModel(false);
      }
      const response = await fetch(
        `/api/healthprofile/${session?.user?.email}/all`
      );
      const data = await response.json();
      const jsonData = await JSON.parse(data.data);
      setuserHealthData(jsonData);
    };

    if (status === "authenticated") {
      allHealthCon();
    }
  }, [status, inputValue, setuserHealthData, userHealthData]);

  const handleSave = async (heaCon: string) => {
    if (!inputValue) {
      // alert("Please enter an allergy.");
      toast(`Input field cannot be empty!`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    try {
      console.log(heaCon);
      const response = await fetch(
        `/api/healthprofile/${session?.user?.email}/${heaCon}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputval: inputValue }),
        }
      );

      if (response.ok) {
        // alert("Allergy saved successfully!");
        toast(`Health condition Saved successfully!`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setInputValue("");
      } else {
        const errorData = await response.json();
        // alert(`Error: ${errorData.message}`);
        toast(`Error: ${errorData.message}`, {
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
    } catch (error) {
      // alert("Failed to save allergy. Please try again later.");
      toast(`Failed to save allergy. Please try again later!`, {
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
  };

  const deleteVal = async (hpfield: any, item: any) => {
    console.log(hpfield, item);
    const res = await fetch(
      `/api/healthprofile/${session?.user?.email}/${hpfield}/${item}`
    );
    const dataaa = await res.json();
    await setuserHealthData(dataaa.editedData);
    console.log("dlelete val json:", dataaa.editedData);
  };

  return (
    <div className="w-[75.2vw]">
      <div className="bg-slate-600 rounded-md p-1 m-1">
        <div className="my-1 mx-2 w-full flex justify-between items-center">
          <h4 className="text-xl font-bold  text-white">
            Health Profile
            <p className="text-sm font-medium text-slate-200">
              (Add Your Health Details for Smarter Insights)
            </p>
          </h4>
        </div>

        <div className="bg-white m-1">
          <div className="m-2">
            {healthprofileItems?.map((hpitems, indexOfParent) => {
              return (
                <div key={indexOfParent}>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger> {hpitems.title} </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex justify-between">
                          <div className=" w-[80%]">
                            <Input
                              type="text"
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
                              className="bg-slate-200 border-none"
                              placeholder="Add your allergy here and save"
                            />
                          </div>
                          <div>
                            <Button
                              onClick={() => {
                                handleSave(loopOfField[indexOfParent]);
                              }}
                              variant="outline"
                              className=" bg-slate-400"
                            >
                              Save
                            </Button>
                          </div>
                        </div>

                        {(userHealthData[0] as any)?.[
                          loopOfField[indexOfParent]
                        ]?.map((item: any, index: any) => {
                          return (
                            <div key={index}>
                              <div className=" my-3 mx-3 ">
                                <div className="flex justify-between bg-gray-300 p-2 rounded-sm shadow-xl">
                                  <div className="flex">
                                    <div className="">
                                      <ChevronRight />
                                    </div>
                                    <div className="px-2"> {item}</div>
                                  </div>
                                  <div
                                    onClick={() => {
                                      deleteVal(
                                        loopOfField[indexOfParent],
                                        item
                                      );
                                    }}
                                  >
                                    <Trash2 className="cursor-pointer" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;

//         |||||for reference for future in doubt||||||
{
  /* //--------------------------------------------------------------------- */
}
{
  /* <AccordionItem value="item-1">
                <AccordionTrigger> Add Allergies </AccordionTrigger>
                <AccordionContent>
                  <div className="flex justify-between">
                    <div className=" w-[80%]">
                      <Input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="bg-slate-200 border-none"
                        placeholder="Add your allergy here and save"
                      />
                    </div>
                    <div>
                      <Button
                        onClick={() => {
                          handleSave("allergies");
                        }}
                        variant="outline"
                        className=" bg-slate-400"
                      >
                        Save
                      </Button>
                    </div>
                  </div>

                  {userHealthData[0]?.allergies?.map((item, index) => {
                    return (
                      <div key={index}>
                        <div className=" my-3 mx-3 ">
                          <div className="flex justify-between bg-gray-300 p-2 rounded-sm shadow-xl">
                            <div className="flex">
                              <div className="">
                                <ChevronRight />
                              </div>
                              <div className="px-2"> {item}</div>
                            </div>
                            <div>
                              <Trash2 className="cursor-pointer" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div className=" my-3 mx-3 ">
                    <div className="flex justify-between bg-gray-300 p-2 rounded-sm shadow-xl">
                      <div className="flex">
                        <div className="">
                          <ChevronRight />
                        </div>
                        <div className="px-2">
                          {" "}
                          {userHealthData[0]?.allergies[0]}
                        </div>
                      </div>
                      <div>
                        <Trash2 className="cursor-pointer" />
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem> */
}
{
  /* //------------------------------------------------------------ */
}
{
  /* <AccordionItem value="item-2">
                <AccordionTrigger>Add Chronic Conditions</AccordionTrigger>
                <AccordionContent>
                  <div className="flex justify-between">
                    <div className=" w-[80%]">
                      <Input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="bg-slate-200 border-none"
                        placeholder="Add your cc here and save"
                      />
                    </div>
                    <div>
                      <Button
                        onClick={() => {
                          handleSave("chronicConditions");
                        }}
                        variant="outline"
                        className=" bg-slate-400"
                      >
                        Save
                      </Button>
                    </div>
                  </div>

                  <div className=" my-3 mx-3 ">
                    <div className="flex justify-between bg-gray-300 p-2 rounded-sm shadow-xl">
                      <div className="flex">
                        <div className="">
                          <ChevronRight />
                        </div>
                        <div className="px-2"> asthma</div>
                      </div>
                      <div>
                        <Trash2 className="cursor-pointer" />
                      </div>
                    </div>
                  </div>

                  <div className=" my-3 mx-3 ">
                    <div className="flex justify-between bg-gray-300 p-2 rounded-sm shadow-xl">
                      <div className="flex">
                        <div className="">
                          <ChevronRight />
                        </div>
                        <div className="px-2"> peanut allergy</div>
                      </div>
                      <div>
                        <Trash2 className="cursor-pointer" />
                      </div>
                    </div>
                  </div>

                  <div className=" my-3 mx-3 ">
                    <div className="flex justify-between bg-gray-300 p-2 rounded-sm shadow-xl">
                      <div className="flex">
                        <div className="">
                          <ChevronRight />
                        </div>
                        <div className="px-2"> peanut allergy</div>
                      </div>
                      <div>
                        <Trash2 className="cursor-pointer" />
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem> */
}
{
  /* //---------------------------------------------------------------- */
}
{
  /* <AccordionItem value="item-3">
                <AccordionTrigger>Add Past Surgeries</AccordionTrigger>
                <AccordionContent>
                  Yes. It&apos;s animated by default, but you can disable it if
                  you prefer.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Add Dietary Preferences</AccordionTrigger>
                <AccordionContent>
                  Yes. It&apos;s animated by default, but you can disable it if
                  you prefer.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Add Family Medical History</AccordionTrigger>
                <AccordionContent>
                  Yes. It&apos;s animated by default, but you can disable it if
                  you prefer.
                </AccordionContent>
              </AccordionItem> */
}
{
  /* </Accordion> */
}
