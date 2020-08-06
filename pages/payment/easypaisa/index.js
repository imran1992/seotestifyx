import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import { siteUrl } from "@utils/utilities";

const easyPaisaUrl = "https://easypay.easypaisa.com.pk/easypay/";

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

  useEffect(() => {
    //console.log("Executing", "Started");
    if (postBackURL) {
      const form_ep = document.createElement("form");
      form_ep.method = "POST";
      let ObjectOp;
      if (auth_token) {
        form_ep.action = easyPaisaUrl + "Confirm.jsf";
        ObjectOp = {
          auth_token,
          postBackURL: `${siteUrl}payment/easypaisa/success`,
        };
      } else if (amount && merchantHashedReq && orderRefNum) {
        form_ep.action = easyPaisaUrl + "Index.jsf";
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
      for (let key_ep in ObjectOp) {
        const element_ep = document.createElement("input");
        element_ep.type = "hidden";
        element_ep.value = ObjectOp[key_ep];
        element_ep.name = key_ep;
        form_ep.appendChild(element_ep);
      }
      //console.log("allData", ObjectOp);
      document.body.appendChild(form_ep);
      form_ep.submit();
      form_ep.remove();
    } else {
      console.log("Query", query);
    }
  }, []);
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
