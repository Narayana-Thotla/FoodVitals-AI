"use client";
import React, { useEffect } from "react";

// import { UpgradePage } from '@/pages/upgradePage'
import UpgradePage from "@/pages/upgradePage_2";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useStore } from "@/zustand/zustandStore";
import { apiLimitCount } from "@/utils/apiLimitCount";

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const storeVal = useStore((state: any) => state.count);
  const updateCount = useStore((state: any) => state.updateCount);
  const updateModel = useStore((state: any) => state.updateModel);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }

    const proFunction = async () => {
      const result = await apiLimitCount(session);
      updateCount(result.count);
      if (result.status == 202) {
        updateModel(true);
      } else {
        updateModel(false);
      }
    };

    if (status == "authenticated") {
      proFunction();
    }
  }, [status, session, updateCount, updateModel, router]);

  return (
    <div>
      <UpgradePage session={session} status={status} />
    </div>
  );
};

export default Page;
