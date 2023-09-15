import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { collection, getDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import axios from "axios";

const Message = () => {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [text, setText] = useState();
  const [focus, setFocus] = useState(false);
  const [photo, setPhoto] = useState(
    `https://firebasestorage.googleapis.com/v0/b/honest-c986c.appspot.com/o/profilePictures%2FprofPic-${params.name}.jpg?alt=media`
  );
  const [location, setLocation] = useState("");
  const [qData, setQData] = useState({
    active: true,
    bottomColor: "#FF8D10",
    topColor: "#EC1187",
    hideBranding: false,
    questionType: 1,
    question: "Send me anonymous messages:",
    epoch: params.number,
  });

  const sendResponse = async (data) => {
    await setDoc(
      doc(db, "responses", params.name, data.questionEpoch, data.epoch),
      {
        response: data.response,
        questionEpoch: data.questionEpoch,
        epoch: data.epoch,
        ipAddressLocation: data.ipAddressLocation,
      }
    );
  };

  const postQuestion = async (data) => {
    await setDoc(
      doc(db, "questions", params.name, data.epoch, data.epoch),
      data
    );
  };

  const Submit = async (e) => {
    e.preventDefault();
    if (params.number) {
      const time = (new Date().getTime() / 1000).toFixed(0);
      console.log("time", time);
      const data = {
        response: text,
        epoch: time,
        questionEpoch: params.number,
        ipAddressLocation: location,
      };
      await sendResponse(data);
    }

    navigate("/p/sent");
  };

  const getLocation = async () => {
    await axios
      .get("https://ipapi.co/json/")
      .then((res) => {
        console.log("data", res.data);
        const data =
          res.data.city + ", " + res.data.region + ", " + res.data.country;
        setLocation(data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getLocation();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const docSnap = await getDoc(
        doc(db, "questions", params.name, params.number, params.number)
      );
      const data = docSnap.data();
      if (data) {
        var color = `${data.topColor} linear-gradient(to bottom right, ${data.topColor} 0%, ${data.bottomColor} 100%)`;
        setQData(data);
      } else {
        var color =
          "#EC1187 linear-gradient(to bottom right, #EC1187 0%, #FF8D10 100%)";
        await postQuestion(qData);
      }
      document.documentElement.style.background = color;
    } catch {
      console.error("error");
    }
    setLoading(false);

    try {
      const response = await fetch(
        `https://www.instagram.com/${params.name}/?__a=1&__d=1`
      ); // fetch page
      const htmlString = await response.text(); // get response text
      console.log("string", htmlString);
      // getting the url
      let json = JSON.parse(htmlString);
      var photoURL = json["graphql"]["user"]["profile_pic_url_hd"];
      setPhoto(photoURL);
    } catch {
      console.error("error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOnError = () => {
    setPhoto("");
  };

  return (
    <>
      {!loading && (
        <>
          <div className="container">
            <form className="form" method="post">
              <div className="bubble">
                <div className="header">
                  <div className="pfp-container">
                    {photo && (
                      <img src={photo} alt="" onError={handleOnError} />
                    )}
                  </div>
                  <div className="user-container">
                    <div className="username">@{params.name}</div>
                    <div className="prompt">{qData.question}</div>
                  </div>
                </div>
                <div className="textarea-container">
                  {/* <div className="dice-button">🎲</div> */}
                  <textarea
                    placeholder="Reply anonymously here"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    name="question"
                    autoComplete="off"
                    maxLength="300"
                  />
                </div>
              </div>
              <div className="anonymous-tooltip">
                Your response is fully anonymous 🔒
              </div>
              {text && (
                <button className="submit" type="submit" onClick={Submit}>
                  Send!
                </button>
              )}
            </form>
          </div>
          {!focus && (
            <div className="bottom-container">
              <div className="download-prompt">
                👇 <span className="clickCount">225</span> people just tapped
                the button👇
              </div>
              <Link
                className="button download-link pulse"
                to="https://apps.apple.com/us/app/ngl-anonymous-q-a/id1596550932?ppid=543cb167-5bdc-448f-a202-e5506f5d2837"
                target="_blank"
              >
                Get your own responses!
              </Link>
              <div className="tos-privacy">
                <Link className="tos" to="/p/terms">
                  Terms
                </Link>
                <Link className="privacy" to="/p/privacy">
                  Privacy
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Message;
