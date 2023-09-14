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
  const [photo, setPhoto] = useState();
  const [question, setQuestion] = useState();
  const [location, setLocation] = useState();

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

  const Submit = async (e) => {
    e.preventDefault();
    const time = (new Date().getTime() / 1000).toFixed(0);
    console.log("time", time);
    if (question) {
      const data = {
        response: text,
        epoch: time,
        questionEpoch: params.number,
        ipAddressLocation: location,
      };
      await sendResponse(data);
      navigate("/p/sent");
    }
  };

  const getLocation = async () => {
    await axios
      .get("https://ipapi.co/json/")
      .then((res) => {
        console.log("data", res.data);
        const data =
          res.data.city + ", " + res.data.region + ", " + res.data.country_name;
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
        doc(db, "questions", `${params.name}-${params.number}`)
      );
      const data = docSnap.data();
      if (data) {
        var color = `${data.topColor} linear-gradient(to bottom right, ${data.topColor} 0%, ${data.bottomColor} 100%)`;
        setQuestion(data.question);
      } else {
        var color = "transparent";
      }
      document.getElementById("root").style.background = color;
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

  return (
    <>
      {!loading && (
        <>
          <div className="container">
            <form className="form" method="post">
              <div className="bubble">
                <div className="header">
                  <div className="pfp-container">
                    {photo && <img src={photo} alt="profile" />}
                  </div>
                  <div className="user-container">
                    <div className="username">@{params.name}</div>
                    <div className="prompt">{question}</div>
                  </div>
                </div>
                <div className="textarea-container">
                  <div className="dice-button">🎲</div>
                  <textarea
                    placeholder="send me anonymous messages..."
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
