import React, { useState } from "react";
import Head from "next/head";
import Router, { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Testimony } from "@sampleData/testemony";
import IntroSection from "@components/IntroSection";
  // import IntroSection2 from "@components/IntroSection/introMenu";
  import nextCookie from "next-cookies";

const LandingPage = (props) => {
  const user = useSelector((state) => state["USER"]["user"]);
  const { query } = useRouter();
  const [userType, setUserType] = useState(user ? user.role || "student" : "");

  return (
    <>
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

      {/* Intro Section */}
      <IntroSection apolloClient={null} apolloState={{ data: {} }} />
      {/* <IntroSection2 apolloClient={null} apolloState={{ data: {} }} /> */}

      {/* Fun & Exciting Education */}
      <section className="text-center py-5 darken-1" id="pricing">
        <div className="container">
          <div style={{ height: 600 }} className="row">
            <div className="col-sm-12 col-md-6 mb-r d-flex flex-column align-items-center justify-content-center">
              <h2 className="h1 pt-5 pb-3">
                A fun and exciting education with futuristic technology!
              </h2>
              <p className="mb-5 pb-3 h6">
                {userType === "student"
                  ? "Ask a teacher to teach you and your friends any time! You can set up classes and join classes or join your favorite teacher anytime for free!"
                  : "You can set up classes and get booked by thousands of avid students"}
              </p>
            </div>
            <div className="d-none col-sm-12 col-md-6 mb-r d-md-flex flex-column align-items-center justify-content-around wow zoomIn">
              <img
                className="img-fluid rounded"
                src="/images/tagline-saudi-landing.png"
                alt="project"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="text-center py-5 grey lighten-4" id="about">
        <div className="container">
          <div className="wow fadeIn">
            <h2 className="h1 pt-5 pb-3 text-primary">
              Our students love learning on our platform
            </h2>
            <p className="px-5 mb-5 pb-3 lead text-secondary">
              Here are some testimonials from current and past students
            </p>
          </div>
          <div className="row wow bounceInUp">
            {Testimony.map(({ quote, name }, index) => (
              <div key={`testimony${index}`} className="col-md-4 mb-4">
                <div className="card testimonial-card">
                  {/* Bacground color */}
                  <div className="card-up purple-gradient" />
                  {/* Avatar */}
                  <div className="avatar mx-auto white">
                    <img src="images/student.jpg" className="rounded-circle" />
                  </div>
                  <div className="card-body" style={{ minHeight: "25vh" }}>
                    {/* Name */}
                    <h4 className="card-title">{name}</h4>
                    <hr />
                    {/* Quotation */}
                    <p>
                      <i className="fa fa-quote-left" /> {quote}
                      <i className="fa fa-quote-right" />
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section
        id="contact"
        style={{
          height: 500,
        }}
      >
        <div className="distinguised pt-5 h-100">
          <div className="container h-100">
            <div className="row h-100">
              <div className="col-sm-12 col-md-6 h-100 d-flex flex-column align-items-center justify-content-around">
                <p className="text-white h3 font-weight-normal text-center">
                  Join a distinguished group of teachers and save preparation
                  and correction time with a Comprehensive tool for the teacher
                  and the strongest platform in Pakistan!
                </p>
                <p className="text-black text-center">
                  <a
                    className="btn btn-lg purple-gradient btn-rounded waves-effect waves-light wow swing"
                    href=""
                    onClick={(e) => {
                      e.preventDefault();
                      Router.push({ pathname: "/online-class", query });
                    }}
                  >
                    <i className="fa fa-graduation-cap mr-1" />
                    Start now for free!
                  </a>
                </p>
              </div>
              <div className="d-none col-sm-12 col-md-6 h-100 d-md-flex flex-column align-items-center justify-content-around wow zoomIn">
                <img
                  className="img-fluid rounded"
                  src="/images/20670.png"
                  alt="project"
                />
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
    </>
  );
};

LandingPage.getInitialProps = async (ctx) => {
  const { user } = ctx.store.getState().USER;
  const { Authorization } = nextCookie(ctx);
  if (ctx.req && Authorization) {
    if (user && user.role === "student")
      ctx.res.writeHead(302, { Location: "/online-class" }).end();
    else ctx.res.writeHead(302, { Location: "/online-class" }).end();
  } else if (Authorization) {
    if (user && user.role === "student")
      document.location.pathname = "/online-class";
    else document.location.pathname = "/online-class";
  } else return { Authorization };
};

export default LandingPage;
