import React, { Fragment } from "react";
export default () => {
  return (
    <Fragment>
      <script
        async
        src={"https://www.googletagmanager.com/gtag/js?id=UA-147246396-1"}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'UA-147246396-1');
          `
        }}
      />
    </Fragment>
  );
};
