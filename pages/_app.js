import React from "react";
import App from "next/app";
import Head from "next/head";
import Router from "next/router";
import withRedux from "next-redux-wrapper";
import { Provider } from "react-redux";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import { PersistGate } from "redux-persist/integration/react";
import persistedStore from "@redux/store";
import DashboardHeader from "@components/DashboardHeader";
import Pixel from "@components/Pixel";
import HeadTags from "@components/headTags";
import Footer from "@components/Footer";
import { DefaultSeo } from "next-seo";
import SEO from "../next-seo.config";
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
const Arr = ["", "live", "login", "register", "termes"];
const theme = createMuiTheme({});
class MyApp extends App {
  getmeta = () => {
    if (this.props.router) {
      if (this.props.router.pathname == "/") {
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

  render() {
    const { Component, pageProps, store, router } = this.props;
    if (typeof window !== "undefined") {
      // console.log(window, 'windown window');
    }

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
        <DefaultSeo {...SEO} />
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
          {this.getmeta()}
        </Head>
        <Pixel name="FACEBOOK_PIXEL_1" />
        {process.browser ? (
          <PersistGate persistor={store.__PERSISTOR} loading={null}>
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
        ) : (
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
        )}
      </Provider>
    );
  }
}
export default withRedux(persistedStore, { debug: false })(MyApp);
