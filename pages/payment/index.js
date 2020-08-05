import React, { useEffect, useState } from "react";
import { withApollo, initApolloClient } from "@apolloX/apollo";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { makeStyles } from "@material-ui/core/styles";
import { getpaymentMethod, postOrder, posttoEasyPAisa } from "@utils/API";
import { useSelector } from "react-redux";
import { isEmpty, orderBy } from "lodash";
import { useRouter } from "next/router";
import { Typography, Chip, Button, Divider } from "@material-ui/core";
import { ContactlessOutlined } from "@material-ui/icons";
const useStyles = makeStyles((theme) => ({
  cartItem: {
    width: 1150,
    border: "1px solid #ccc",
    borderRadius: 8,
    padding: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
}));
const Payment = () => {
  const { push } = useRouter();
  const classes = useStyles();
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const { error, data, fetchMore, networkStatus, client, loading } = useQuery(
    gql`
      {
        findEnrollment(query: { userId: "5f27d0278b35546ca90e9b0a" }) {
          _id
          name
          phone
          validUpTo
          createdAt
          Course {
            name
            price
            image_url
            description
          }
        }
      }
    `,
    {
      variables: {
        skip: 0,
        first: 10,
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  const { data: PMData, loading: PMLoading } = useQuery(
    gql`
      {
        findPaymentmethod(query: {}) {
          _id
          name
          status
          description
          image_url
          discount
        }
      }
    `,
    {
      variables: {
        skip: 0,
        first: 10,
      },
      notifyOnNetworkStatusChange: true,
    }
  );
  useEffect(() => {
    if (PMData) setPaymentMethods(PMData["findPaymentmethod"]);
    console.log("PMData", PMData);
  }, [PMData]);

  useEffect(() => {
    if (data && data["findEnrollment"]) {
      setCartItems(data["findEnrollment"]);
      console.log("CART", data["findEnrollment"]);
    }
  }, [data]);

  const totalToPay = cartItems.reduce(
    (p, c) => p + parseInt(c.Course.price),
    0
  );
  const products = cartItems.reduce((p, c) => {
    p.push(c._id);
    return p;
  }, []);
  return (
    <div style={{ padding: 15 }}>
      <div style={{ marginBottom: 10 }}>{`Select payment method`}</div>
      <div> {`To pay: Rs ${totalToPay}`}</div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        {paymentMethods.map(({ name, _id, status }, index) =>
          status === "active" ? (
            <Button
              key={_id}
              style={{ marginBottom: 10, marginTop: 10 }}
              color={"secondary"}
              variant="outlined"
              onClick={() => {
                console.log("Data2Go", {
                  amount:
                    totalToPay % 1 === 0 ? totalToPay + ".0" : totalToPay + "",
                  pgwId: _id,
                  pgwName: name,
                  status: "initiated",
                  payment_status: "initiated",
                  products,
                });
                if (name === "Credit/Debit Card") {
                  posttoEasyPAisa({
                    amount:
                      totalToPay % 1 === 0
                        ? totalToPay + ".0"
                        : totalToPay + "",
                    pgwId: _id,
                    pgwName: name,
                    status: "initiated",
                    payment_status: "initiated",
                    products,
                  })
                    .then(({ data }) => {
                      if (data && data.merchantHashedReq) {
                        console.log("DATa", data);
                        const {
                          amount,
                          merchantHashedReq,
                          orderRefNum,
                          paymentMethod,
                          storeId,
                          postBackURL,
                          expiryDate,
                          autoRedirect,
                        } = data;
                        push({
                          pathname: "/payment/easypaisa",
                          query: {
                            amount,
                            orderRefNum,
                            merchantHashedReq,
                            paymentMethod,
                            storeId,
                            postBackURL,
                            expiryDate,
                            autoRedirect,
                          },
                        });
                      }
                    })
                    .catch((e) => {});
                }
              }}
            >
              {name}
            </Button>
          ) : null
        )}
      </div>
    </div>
  );
};
export default withApollo(Payment);
