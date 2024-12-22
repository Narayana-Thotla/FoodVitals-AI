


export const apiLimitCount = async (session: any) => {
    // console.log(session);
    const apiLimitStatus = await fetch(
      `/api/apilimit/checkapilimit/${session?.user?.email}`
    );
    const result = await apiLimitStatus.json();
    // console.log("result of apilimit:", result.count);
  
    return result;
  };