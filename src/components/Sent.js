import React from "react";
import { Link, useNavigate } from "react-router-dom";
import LeftArrow from "../assets/left.png";
import CheckImage from "../assets/sent.png";
import Logo from "../assets/logo.png";

const Sent = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="container">
        <div className="navbar">
          <div className="back" onClick={() => navigate(-1)}>
            <img src={LeftArrow} alt="back" width="24" height="24" />
          </div>
        </div>
        <div className="check">
          <img src={CheckImage} alt="sent" data-xblocker="passed" />
          <div className="sent">Sent!</div>
        </div>
        <div className="message-container">
          {/* <div className="download-prompt">
            👇 <span className="clickCount">225</span> people just tapped the
            button👇
          </div> */}
          <Link
            className="button download-link pulse"
            to="https://apps.apple.com/us/app/ngl-anonymous-q-a/id1596550932?ppid=543cb167-5bdc-448f-a202-e5506f5d2837"
            target="_blank"
          >
            Get your own responses!
          </Link>
          <div className="back">Turn your followers into honest answers 💡</div>
          {/* <Link className="back" to="javascript:history.back()">
            Sent another message
          </Link> */}
        </div>
      </div>
      <div className="bottom">
        <Link
          className="button-small button-translucent rizz-button"
          to="https://apps.apple.com/us/app/apple-store/id1663086857"
        >
          <img src={Logo} alt="logo" width="130" />
        </Link>
      </div>
    </>
  );
};

export default Sent;
