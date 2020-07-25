import React from "react";
import { Typography } from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";

import {
  EmailShareButton,
  FacebookShareButton,
  InstapaperShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailIcon,
  FacebookIcon,
  InstapaperIcon,
  LinkedinIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";

const useStyles = makeStyles((theme) => ({
  fontBold: {
    fontWeight: "bold",
  },
  startDate: {
    marginTop: 7.5,
    fontSize: 14,
    letterSpacing: 0.5,
    color: "rgba(0,0,0,0.5)",
  },
  shareWithFriends: {
    marginTop: 20,
    color: blue[400],
    textTransform: "uppercase",
  },
  classShareContainer: {},
  shareBtnContainer: {
    marginTop: 5,
  },
}));

const ShareButtons = ({ shareUrl, title }) => {
  const classes = useStyles();

  return (
    <div className={`${classes.classShareContainer}`}>
      <Typography
        component="p"
        className={`${classes.startDate} ${classes.shareWithFriends} ${classes.fontBold}`}
      >
        share with friends
      </Typography>
      <div className={`${classes.shareBtnContainer}`}>
        <EmailShareButton className="mr-2" url={shareUrl} title={title}>
          <EmailIcon size={32} round />
        </EmailShareButton>
        <FacebookShareButton className="mr-2" url={shareUrl} title={title}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <InstapaperShareButton className="mr-2" url={shareUrl} title={title}>
          <InstapaperIcon size={32} round />
        </InstapaperShareButton>
        <LinkedinShareButton className="mr-2" url={shareUrl} title={title}>
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>
        <TelegramShareButton className="mr-2" url={shareUrl} title={title}>
          <TelegramIcon size={32} round />
        </TelegramShareButton>
        <TwitterShareButton className="mr-2" url={shareUrl} title={title}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>
        <WhatsappShareButton
          className="mr-2"
          url={shareUrl}
          separator=": "
          title={title}
        >
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
      </div>
    </div>
  );
};

export default ShareButtons;
