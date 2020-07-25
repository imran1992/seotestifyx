import { useEffect } from "react";
import Router from "next/router";
import nextCookie from "next-cookies";
import cookie from "js-cookie";

const isProd = process.env.NODE_ENV === "production";
const nextLogin = (Authorization, role, returnto) => {
  cookie.set("Authorization", Authorization, {
    expires: 30
  });
  if (returnto) {
    Router.push(returnto)
    // document.location.pathname = returnto;
  } else if (role === "student") document.location.pathname = "/online-class";
  else document.location.pathname = "/online-class";
};


const saveToken = (Authorization) => {
  cookie.set("Authorization", Authorization, {
    expires: 30
  });
};

const nextLogout = () => {
  // isProd
  // ? cookie.remove("Authorization", { domain: "omnisell.pk" })
  // :
  cookie.remove("Authorization");
  // to support logging out from all windows
  window.localStorage.setItem("logout", Date.now());
  document.location.href = "/";
};
const nextAuth = ctx => {
  const { Authorization } = nextCookie(ctx);
  if (!Authorization) {
    if (typeof window === "undefined") {
      ctx.res.writeHead(302, { Location: "/login" }).end();
      // ctx.res.end();
    } else {
      Router.push("/login");
    }
  }
  return Authorization;
};

const nextWithAuthSync = WrappedComponent => {
  const Wrapper = props => {
    const syncLogout = event => {
      if (event.key === "logout") {
        console.log("logged out from storage!");
        Router.push("/login");
      }
    };
    useEffect(() => {
      window.addEventListener("storage", syncLogout);
      return () => {
        window.removeEventListener("storage", syncLogout);
        window.localStorage.removeItem("logout");
      };
    }, []);
    return <WrappedComponent {...props} />;
  };
  Wrapper.getInitialProps = async ctx => {
    const Authorization = nextAuth(ctx);
    const componentProps =
      WrappedComponent.getInitialProps &&
      (await WrappedComponent.getInitialProps(ctx));
    return { ...componentProps, Authorization };
  };
  return Wrapper;
};

export { nextWithAuthSync, nextLogout, nextLogin, nextAuth, saveToken };
