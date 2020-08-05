import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import { siteUrl } from "@utils/utilities";

const easypaisaUrl = "https://easypay.easypaisa.com.pk/easypay/";

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
const PaymentEasyPaisa = () => {
  const classes = useStyles();
  const { query } = useRouter();
  
  useEffect(() => {
    const {
      postBackURL,
      amount,
      merchantHashedReq,
      orderRefNum,
      expiryDate,
      storeId,
      paymentMethod,
      autoRedirect,
      auth_token,
    } = query;
    if (postBackURL) {
      const form_ep = document.createElement("form");
      form_ep.method = "POST";
      let ObjectOp = {};
      if (auth_token) {
        form_ep.action = easypaisaUrl + "Confirm.jsf";
        ObjectOp = {
          auth_token,
          postBackURL: `${siteUrl}payment/easypaisa/success`,
        };
      } else if (amount && merchantHashedReq && orderRefNum) {
        form_ep.action = easypaisaUrl + "Index.jsf";
        ObjectOp = {
          autoRedirect,
          expiryDate,
          amount,
          orderRefNum,
          paymentMethod,
          postBackURL,
          merchantHashedReq,
          storeId,
        };
      }
      //console.log("allData", ObjectOp);
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
    } else {
      console.log("Query", query);
    }
  }, [query]);
  return (
    <div>
      <div className={classes.textBox}>connecting to easypaisa...</div>
      <div className={classes.logoBox}>
        <img src="/images/easypaisa.png" />
      </div>
    </div>
  );
};
export default PaymentEasyPaisa;
