import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import { siteUrl } from "@utils/utilities";

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
const PaymentEasyPaisaEndResult = () => {
  const classes = useStyles();
  const { query } = useRouter();
  const { status, desc, orderRefNum } = query;
  useEffect(() => {
    if (status) {
    } else {
      console.log("Query", query);
    }
  }, [query]);
  return (
    <div>
      <div className={classes.textBox}>{status}</div>
      <div className={classes.textBox}>{desc}</div>
      <div className={classes.textBox}>{orderRefNum}</div>
      <div className={classes.logoBox}>
        <img src="/images/easypaisa.png" />
      </div>
    </div>
  );
};
export default PaymentEasyPaisaEndResult;
