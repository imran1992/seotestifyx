import React from "react";
import Link from "next/link";
import Head from "next/head";
import { Button } from "@material-ui/core";
import Style from "../styles/errorPage";

const Error = ({ statusCode }) => {
  return (
    <div className={"errorScreenContainer"}>
      <Head>
        <meta
          property="og:title"
          content="SCHOOLX leading online learning platform"
        />
        <meta
          property="og:description"
          content="SCHOOLX leading online learning platform"
        />
      </Head>
      <div className={"errorBodyContainer"}>
        <div className="page-layout error-page">
          <div className="error-content">
            <div className="error-title">Oops! Something broke...</div>
            <div className="error-subtitle">
              We are unable to open this right now
            </div>
            <Link href="/">
              <Button
                variant="contained"
                color="primary"
                fullWidth={false}
                className={"errorBtn"}
              >
                Go to Homepage
              </Button>
            </Link>

            <div className="error-image" width="100">
              {statusCode ? (
                <svg
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 360 200"
                >
                  <path
                    d="M196.6 39c-18.9 5.8-30.1-4.9-48.2-7.8-8.2-1.2-20.2-2.5-28.4.4-8.6 3.3-8.2 9.1-8.6 17.7-.8 19.8-24.5 11.1-29 30.1-2.9 11.9-1.5 21.4 7.2 29.2 4.5 4.5 7.8 9.1 8.2 15.6.4 12.8-12.8 32.1 4.1 40.8 9.5 4.9 22.2-.4 32.5 4.5 5.4 2.5 8.6 7 14.4 9.1 9.9 2.9 18.1.4 27.2-2.9 8.6-3.3 17.3-6.6 25.9-7.4 6.6-.4 13.2.8 19.4-.8 7-1.6 9.1-6.2 14.4-9.5 6.6-3.7 14.8 0 21.8-2.5 17.3-5.4 3.3-22.2 3.7-34.2.4-13.2 10.5-23.1 9.7-37.5-1.2-16.1-12.1-19.8-24.9-25.5-4.5-2.1-7.8-4.1-10.7-8.2-3.3-4.1-4.9-11.1-9.1-14-6.5-5-19.8-2.3-29.6 2.9"
                    fill="#d5d7d8"
                    opacity=".34"
                  ></path>
                  <path
                    className="st5"
                    d="M71.7 57.8l-74.1.2.2 5.4h73.9zM225 139.5v9.7h7.8c4.3 0 7.8-3.5 7.8-7.8s-3.5-7.8-7.8-7.8H225v5.9z"
                  ></path>
                  <text
                    transform="translate(139.932 89.421)"
                    className="st5"
                    fontSize="38.118"
                    fontFamily="ProximaNova-Extrabld"
                  >
                    {statusCode}
                  </text>
                  <path
                    className="st5"
                    d="M166.8 1185.1l14.8-15.6-14.3-9.8 33.2-16.9-14.8 15.6 14.3 9.8-7.5 3.8-7 3.6-18.7 9.5z"
                    transform="translate(0 -1020.362)"
                  ></path>
                  <path
                    className="st5"
                    d="M125.9 137.9c-7.9 1.6-29.2 3.7-32.9-6.6-3.8-10.5-1.6-17 1.2-25.1 2.3-6.7 4.9-14.3 4.6-25.4-.2-8-3.2-14-8.8-17.9-4.3-3-12.6-4.6-18.2-5.1v5.5c4.6.4 11.8 1.8 15.1 4.1 4.2 2.9 6.3 7.3 6.5 13.5.3 10.1-2 16.9-4.3 23.5-2.9 8.4-5.6 16.4-1.2 28.8 3.4 9.4 14.9 11.6 24.6 11.6 7.6 0 14.1-1.3 14.7-1.4l-1.3-5.5z"
                  ></path>
                  <path
                    className="st5"
                    d="M144.7 143.5h-6.1v-4.1h6.1c.5 0 1-.4 1-1 0-.5-.4-1-1-1h-6.1V134H131c-4.2 0-7.6 3.4-7.6 7.6 0 4.2 3.4 7.6 7.6 7.6h7.6v-3.8h6.1c.5 0 1-.4 1-1 0-.5-.5-.9-1-.9zM-4.2 63.3h72.6s4.2-.9 14.3 2.2l6.3-3s-7.3-5.8-23.4-4.6l-69.3.2-.5 5.2z"
                  ></path>
                  <g>
                    <path
                      className="st5"
                      d="M238.3 138.7c7.9 1.6 29.2 3.7 32.9-6.6 3.8-10.5 1.6-17-1.2-25.1-2.3-6.7-4.9-14.3-4.6-25.4.2-8 3.2-14 8.8-17.9 4.3-3 12.6-4.6 18.2-5.1v5.5c-4.6.4-11.8 1.8-15.1 4.1-4.2 2.9-6.3 7.3-6.5 13.5-.3 10.1 2 16.9 4.3 23.5 2.9 8.4 5.6 16.4 1.2 28.8-3.4 9.4-14.9 11.6-24.6 11.6-7.6 0-14.1-1.3-14.7-1.4l1.3-5.5z"
                    ></path>
                    <path
                      className="st5"
                      d="M368.4 64.1h-72.5-.1c-.2 0-4.3-.5-14.3 2.2l-6.3-3s7.3-5.8 23.4-4.6l69.3.2.5 5.2z"
                    ></path>
                  </g>
                </svg>
              ) : (
                <div className="error-title">"An error occurred on client"</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Style />
    </div>
  );
};

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
