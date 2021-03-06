import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";

const useStyles = makeStyles((theme) => ({
  logoBox: {
    width: "20%",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 60,
  },
  textBox: {
    width: "9%",
    display: "block",
    margin: "auto",
    marginTop: 50,
    fontSize: 14,
  },
}));
const PaymentEasyPaisaConfirm = () => {
  const classes = useStyles();
  const { query, push } = useRouter();
  const {
    amount,
    merchantHashedReq,
    orderRefNum,
    expiryDate,
    storeId,
    postBackURL,
    paymentMethod,
    autoRedirect,
  } = query;

  useEffect(() => {
    if (amount && merchantHashedReq && orderRefNum) {
      const form_ep = document.createElement("form");
      form_ep.method = "POST";
      form_ep.action = "https://easypay.easypaisa.com.pk/easypay/Index.jsf";
      const ObjectOp = {
        autoRedirect,
        expiryDate,
        amount,
        orderRefNum: orderRefNum + "",
        paymentMethod,
        postBackURL,
        merchantHashedReq,
        storeId,
      };
      console.log("allData", ObjectOp);
      for (let key_ep in ObjectOp) {
        const element_ep = document.createElement("input");
        element_ep.type = "hidden";
        element_ep.value = ObjectOp[key_ep];
        element_ep.name = key_ep;
        form_ep.appendChild(element_ep);
      }
      document.body.appendChild(form_ep);
      form_ep.submit();
      form_ep.remove();
    }
  }, []);
  return (
    <div>
      <div className={classes.textBox}>Connecting To...</div>
      <div className={classes.logoBox}>
        <img src="/images/easypaisa.png" />
      </div>
    </div>
  );
};
export default PaymentEasyPaisaConfirm;
