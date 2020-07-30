import React, { Fragment } from "react";
import Head from "next/head";
import Router from "next/router";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import DashboardHeader from "@components/DashboardHeader";
import Pixel from "@components/Pixel";
import HeadTags from "@components/headTags";
import Footer from "@components/Footer";
import "@public/css/bootstrap.min.css";
import "antd/dist/antd.css";
import "@components/shared/loader/styles.scss";
import "../styles/web.scss";
import "katex/dist/katex.min.css";
import "@public/css/phoneStyle.css";
import "@public/css/rootTheme.css";
import "@public/styles/main.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-phone-input-2/lib/bootstrap.css";
import "react-perfect-scrollbar/dist/css/styles.css";

//===============[Redux]=============================
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { useStore } from "@redux/store";
//===================================================
const Arr = ["", "live", "login", "register", "termes"];
const theme = createMuiTheme({
  spacing: 4,
  palette: {
    primary: {
      main: "#007bff",
    },
  },
});
const APP = ({ Component, pageProps, router }) => {
  const store = useStore(pageProps.initialReduxState);
  const persistor = persistStore(store);
  const getmeta = () => {
    if (router) {
      if (router.pathname == "/") {
        return (
          <>
            <title>
              Choose Program | SchoolX, the leading online learning platform in
              Pakistan
            </title>
            <meta property="og:url" content="https://schoolx.pk/" />
            <meta
              property="og:title"
              content="Choose Program | SchoolX, the leading online learning platform in Pakistan"
            />
            <meta
              name="description"
              content={`Schoolx is the largest online learning platform in Pakistan for A Level, O Level, FSc & Matric. ✓ Get best tuition and study all subjects online with best teachers of Pakistan`}
            />
            <meta property="og:site_name" content="SchoolX" />
            <meta property="og:image" content="/images/logoN.png" />
            <meta property="og:image:secure_url" content="/images/logoN.png" />
            <meta property="og:image" content="image" />
            <meta property="og:image:width" content="202" />
            <meta property="og:image:height" content="42" />
            <meta
              property="og:image:alt"
              content="SchoolX | Online Learning Platform"
            />
          </>
        );
      }
    }
  };

  //const { Component, pageProps, store, router } = this.props;
  if (typeof window !== "undefined") {
    Router.events.on("routeChangeComplete", (url) => {
      setTimeout(() => {
        window.gtag("config", "UA-147246396-1", {
          page_location: url,
          page_title: document.title,
        });
      }, 0);
    });
  }

  // console.log(router, "router", pageProps);

  // console.log(router.route.split("/")[1], 'router.route.split("/")[1]');

  // console.log(Helmet.title.toString(), 'ddddddddddd', Helmet.Helmet);

  return (
    <Provider store={store}>
      <Head>
        <HeadTags />
        <meta
          name="viewport"
          content="initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, width=device-width, user-scalable=no"
        />
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
        />
        <link rel="icon" href="/images/favicon.png" />
        {getmeta()}
      </Head>
      <Pixel name="FACEBOOK_PIXEL_1" />
      <PersistGate loading={<Component {...pageProps} />} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <div
            className={
              !Arr.includes(router.route.split("/")[1]) &&
              !Arr.includes(router.route.split("/")[2])
                ? "layout"
                : ""
            }
          >
            {/* {!Arr.includes(router.route.split("/")[1]) &&
                !Arr.includes(router.route.split("/")[2]) && (
                  )} */}
            {router.route != "/online-class/live/[slug]" ? (
              <DashboardHeader />
            ) : null}
            <Component {...pageProps} />
            {router.route.split("/")[1] == "programs" ||
            router.route.split("/")[1] == "classlIst"
              ? null
              : !Arr.includes(router.route.split("/")[1]) && <Footer />}
          </div>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};
export default APP;
