import React, { useEffect, useState } from "react";
import { withApollo, initApolloClient } from "@apolloX/apollo";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import { isEmpty, orderBy } from "lodash";
import { useRouter } from "next/router";
import { Typography, Chip, Button, Divider } from "@material-ui/core";
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
const Cart = () => {
  const classes = useStyles();
  const { push } = useRouter();
  const user = useSelector(({ USER }) => USER.user);
  const [cartItems, setCartItems] = useState([]);
  const { error, data, fetchMore, networkStatus, client, loading } = useQuery(
    gql`
      {
        findEnrollment(query: { userId: "${user._id}" }) {
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
  useEffect(() => {
    if (data && data["findEnrollment"]) {
      const copyOfCart = data["findEnrollment"].reduce((p, c) => {
        p.push({ ...c, selected: true });
        return p;
      }, []);
      setCartItems(copyOfCart);
      console.log("CART", copyOfCart);
    }
  }, [data]);

  const totalToPay = cartItems.reduce(
    (p, c) => (c.selected ? p + parseInt(c.Course.price) : p),
    0
  );
  const payForProduct = cartItems.reduce((p, c) => {
    c.selected && p.push(c._id);
    return p;
  }, []);
  console.log("tobePay", payForProduct);
  return (
    <div
      style={{
        padding: 15,
        minHeight: "calc(100vh - 114px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ marginBottom: 10 }}>{`${
        cartItems.length
      } Course${cartItems.length > 1 && "s"} in Cart`}</div>
      {cartItems.map(({ Course: { price, name, image_url }, _id }, index) => {
        return (
          <div key={_id} className={classes.cartItem}>
            <div style={{ width: 600, flexDirection: "row" }}>
              <img
                src={image_url ? image_url : "/images/mathematics0.jpg"}
                style={{
                  width: 100,
                  marginRight: 10,
                  height: 60,
                  borderRadius: 3,
                }}
              />
              <span>{name}</span>
            </div>
            <div style={{ width: 300 }}></div>
            <div style={{ width: 250 }}>
              {parseInt(price) ? `Rs ${price}` : "Free"}
            </div>
          </div>
        );
      })}
      {cartItems.length && (
        <div
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            width: 1150,
            padding: 10,
            display: "flex",
          }}
        >
          <span
            style={{
              flexDirection: "column",
              display: "flex",
            }}
          >
            {`Total: Rs ${totalToPay}`}
            <Button
              variant="contained"
              color={"secondary"}
              onClick={() => {
                push({
                  pathname: "/payment",
                  query: {
                    amount:
                      totalToPay % 1 === 0
                        ? totalToPay + ".0"
                        : totalToPay + "",
                    products: payForProduct.reduce(
                      (p, c, idx) => p + (idx ? "," + c : c),
                      ""
                    ),
                  },
                });
              }}
            >
              CHECK OUT
            </Button>
          </span>
        </div>
      )}
    </div>
  );
};
export default withApollo(Cart);
