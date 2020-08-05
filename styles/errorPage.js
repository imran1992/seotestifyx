const errorStyle = () => (
  <style global jsx>{`
    .errorScreenContainer {
      width: 100%;
      height: 100vh;
      position: relative;
      overflow-x: hidden;
    }
    .errorBodyContainer {
      margin-top: 5%;
      height: 88vh;
      width: 100%;
    }
    .error-page {
      background-color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      padding-top: 52px;
      font-family: Roboto, Helvetica, Arial, sans-serif;
      width: 100%;
    }
    .error-content {
      width: 100%;
      text-align: center;
      padding-bottom: 24px;
    }
    .error-title {
      font-size: 16px;
      font-weight: 800;
      color: rgba(0, 0, 0, 0.87);
      padding-bottom: 8px;
      padding-top: 32px;
    }
    .error-subtitle {
      color: rgba(0, 0, 0, 0.56);
      font-size: 14px;
      width: 100%;
      display: inline-block;
      margin: 0 0 24px;
    }
    .errorBtn {
      margin-top: 24px !important;
      padding: 12px 56px !important;
    }
    .error-image {
      margin-top: 40px;
    }
    .error-st5 {
      fill: #8b9da5;
    }
  `}</style>
);
export default errorStyle;
