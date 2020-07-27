import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useDispatch } from "react-redux";
import isEmpty from "lodash/isEmpty";
import useInput from "@components/useInput";
import Router, { useRouter } from "next/router";
import nextCookie from "next-cookies";
import { userLogin } from "@utils/API";
import { nextLogout, nextLogin } from "@utils/nextAuth";
import PhoneInput from "react-phone-input-2";

const loginPage = () => {
  const dispatch = useDispatch();
  const [input, handleInputChange] = useInput();
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const { pathname, query } = useRouter();
  const { returnto } = query;

  const { password } = input;

  const validLogin = !isEmpty(phone) && !isEmpty(password);

  const logintoAccount = () => {
    setLoading(true);
    const sanitizedPhone = phone.replace(/ /g, "").replace(/-/g, "");
    userLogin({ phone: sanitizedPhone, password }).then(response => {
      const { ok, data, problem } = response;
      if (ok) {
        if (data.user.active) {
          dispatch({ type: "LOGED_IN", payload: data.user });
          nextLogin(data.accessToken, data.user.role, returnto);
        } else {
          setMessage("Sorry. Your account is no longer active.");
        }
      } else if (data) setMessage(data.message || problem);
      else setMessage(problem);
      setLoading(false);
    });
  };
  const handleOnChange = (value, data, event) => {
    // console.log("LOGS", value);
    // setPhone(value.replace(/[^0-9]+/g, "").slice(data.dialCode.length));
    setPhone(value);
    console.log("LOGS", value);
  };
  return (
    <div className="login-page" id="top">
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
      <header>
        <nav
          className="navbar navbar-expand-lg navbar-dark fixed-top scrolling-navbar"
          id="navbar"
        >
          <div className="container ">
            <a
              style={{ fontWeight: "bolder" }}
              className="navbar-brand w-50"
              onClick={e => {
                e.preventDefault();
                Router.push("/");
              }}
              href=""
            >
              <img src="/images/logo.png" height="50px" alt="logo schoolx" />
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarContent"
              aria-controls="navbarContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div
              className="collapse navbar-collapse  justify-content-end"
              id="navbarContent"
            />
          </div>
        </nav>
        {/* Intro Section */}
      </header>
      <section
        style={{ height: "auto" }}
        className="view hm-gradient"
        id="intro"
      >
        <div className="full-bg-img d-flex align-items-center h-100">
          <div className="container">
            <div className="row no-gutters justify-content-center">
              <div
                style={{ marginTop: "150px" }}
                className="col-md-10 col-sm-12 mx-auto mb-5"
              >
                <h2 className="h1 pt-5 pb-3 text-center">
                  Termes & conditions
                </h2>
                <p className="text-white">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Eaque dolorem provident animi veritatis rerum minus quidem
                  nisi assumenda ipsum totam! Necessitatibus numquam eligendi
                  consequatur maxime, repellat quia nihil pariatur! Neque?
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="page-footer indigo darken-2 center-on-small-only pt-0 mt-0 pl-0">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="mb-5 flex-center">
                <a
                  href="https://www.facebook.com/schoolxpk"
                  target="_blank"
                  className="px-3"
                >
                  <i className="fa fa-facebook fa-lg white-text" />
                </a>
                <a
                  href="https://instagram.com/schoolxacademy?igshid=1i5sc0z99ebt8"
                  target="_blank"
                  className="px-3"
                >
                  <i className="fa fa-instagram fa-lg white-text" />
                </a>
                <a
                  href="https://www.linkedin.com/company/schoolxpk/"
                  target="_blank"
                  className="px-3"
                >
                  <i className="fa fa-linkedin fa-lg white-text" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-copyright">
          <div className="container-fluid">
            <p style={{ paddingTop: 17 }} className="text-center">
              © 2020 SCHOOLX
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default loginPage;
