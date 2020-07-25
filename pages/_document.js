  
import React from 'react';
import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheets } from '@material-ui/core/styles';
export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    // console.log(ctx, 'ttttttttttttttt');
    const sheets = new ServerStyleSheets();
    const initialProps = await Document.getInitialProps(ctx);
    // console.log(initialProps, 'initai dssdfd fsdf');
    
    return { 
      ...initialProps,
      styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
     };
  }

  render() {
    return (
      <Html className="full-height" lang="en">
        <Head />
        {/* <Head>
          <meta charSet="utf-8" />
          <meta
            name="description"
            content="SchoolX is a complete learning platform for your needs ✓ Learn various subjects as a student ✓ Teach your skills and at your own pace as a teacher"
          />
          <meta
            property="og:description"
            content="SchoolX is a complete learning platform for your needs ✓ Learn various subjects as a student ✓ Teach your skills and at your own pace as a teacher"
          />
          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
          />
          <meta property="og:title" content="SchoolX | Pakistan's leading online learning platform" />
          <meta property="og:type" content="website" />
          <meta
            property="og:url"
            content="https://www.schoolx.pk/"
          />
          <meta property="og:image" content="/images/logo_check.jpg" />
          <meta property="og:image:secure_url" content="/images/logo_check.jpg" />
          <meta property="og:site_name" content="SCHOOLX" />
          <meta property="og:image:width" content="202" />
          <meta property="og:image:height" content="42" />
          <link rel="icon" href="/images/favicon.png" />
        </Head>
        */}
        <body>
          <Main />
          <NextScript />
          <script type="text/javascript" src="/js/jquery-3.2.1.min.js" />
          <script type="text/javascript" src="/js/popper.min.js" />
          <script type="text/javascript" src="/js/bootstrap.min.js" />
          <script type="text/javascript" src="/js/mdb.min.js" />
          <script>new WOW().init();</script>
        </body>
      </Html>
    );
  }
}
