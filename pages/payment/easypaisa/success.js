import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { siteUrl } from "@utils/utilities";
const PaymentEasyPaisaEndResult = () => {
  const { query, replace, push } = useRouter();
  const { success, batchNumber, amount, orderRefNumber } = query;
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div>{success ? "Success" : "Failed"}</div>
      <div>{amount}</div>
      <div>{orderRefNumber}</div>
    </div>
  );
};
export default PaymentEasyPaisaEndResult;
