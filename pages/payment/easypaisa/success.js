import React, { useEffect, useState, Fragment } from "react";
import { useRouter } from "next/router";
import { isEmpty } from "lodash";
import { siteUrl } from "@utils/utilities";
const PaymentEasyPaisaEndResult = () => {
  const { query, replace, push } = useRouter();
  const { success, batchNumber, amount, orderRefNumber } = query;
  return !isEmpty(query) ? (
    <div style={{ width: "100vw", height: "100vh" }} className=''>
      <div>{success ? "Success" : "Failed"}</div>
      <div>{amount}</div>
      <div>{orderRefNumber}</div>
    </div>
  ) : (
    <div />
  );
};
export default PaymentEasyPaisaEndResult;
