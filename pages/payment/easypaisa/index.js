import React, { useEffect, useState } from "react";
import { withApollo } from "@apolloX/apollo";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
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
const PaymentEasyPaisa = () => {
  const classes = useStyles();
  const { query, push } = useRouter();
  const {
    amount,
    merchantHashedReq,
    orderRefNum,
    auth_token,
    expiryDate,
    storeId,
    postBackURL,
    paymentMethod,
    autoRedirect,
  } = query;

  useEffect(() => {
    let ObjectOp = {};
    const form_ep = document.createElement("form");
    form_ep.method = "POST";
    if (auth_token) {
      form_ep.action = "https://easypay.easypaisa.com.pk/easypay/Confirm.jsf";
      ObjectOp = {
        auth_token,
        postBackURL,
      };
    } else if (amount && merchantHashedReq && orderRefNum) {
      form_ep.action = "https://easypay.easypaisa.com.pk/easypay/Index.jsf";
      ObjectOp = {
        autoRedirect,
        expiryDate,
        amount,
        orderRefNum: orderRefNum + "",
        paymentMethod,
        postBackURL,
        merchantHashedReq,
        storeId,
      };
    }
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
export default withApollo(PaymentEasyPaisa);
