import React from "react";

import { SessionProvider } from "next-auth/react";

const sessionWrapper = ({ children }: any) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default sessionWrapper;
