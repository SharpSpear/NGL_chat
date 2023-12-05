import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getDoc, doc, setDoc } from "firebase/firestore";
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
    hideBranding: false,
    questionType: 0,
    question: "Type your question here...",
    epoch: params.number,
    responses: 0,
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
      doc(db, "questions", params.name, "allQuestions", params.number),
      data
    );
  };

  const Submit = async (e) => {
    e.preventDefault();
    if (params.number) {
      const time = (new Date().getTime()).toFixed(0);
      console.log("time", time);
      const data = {
        response: text,
        epoch: time,
        questionEpoch: params.number,
        ipAddressLocation: location,
      };
      await sendResponse(data);
      const data1 = {
        ...qData,
        responses: qData.responses + 1,
      }
      setQData(qData)
      await postQuestion(data1)
    }
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        Authorization: 'Basic YTYzYWM4MDktYzI1ZC00ZDg0LWEzZGYtZWUyYzllNTExZDNm',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "include_aliases": {
          "external_id": [params.name]
        },
        "app_id": "f79a94cc-b930-4394-a510-545c145da21a",
        "target_channel": "push",
        "ios_badgeType": "Increase",
        "ios_badgeCount": 1,
        "headings": {en: 'Honest', es: 'Honest'},
        "subtitle": {en: params.questionType, es: 'Honest'},
        "included_segments": ["Subscribed Users"],
        "contents": {en: "You just got a new response! Tap to view", es: 'Honest'}
      })
    };
    
    await fetch('https://onesignal.com/api/v1/notifications', options)
      .then(response => response.json())
      .then(response => console.log(response))
      .catch(err => console.error(err));

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

  const fetchData = async () => {
    setLoading(true);
    var color =
      "#EC1187 linear-gradient(to bottom right, #EC1187 0%, #FF8D10 100%)";
    try {
      const docSnap = await getDoc(
        doc(db, "questions", params.name, "allQuestions", params.number)
      );
      const data = docSnap.data();
      if (data) {
        setQData(data);
        if (data.topColor)
          color = `${data.topColor} linear-gradient(to bottom right, ${data.topColor} 0%, ${data.bottomColor} 100%)`;
        else if (data.questionType == 1) {
          color = "#2CD27E"
        } else if (data.questionType == 2) {
          color = "#F88379"
        } else if (data.questionType == 3) {
          color = "#26A1D5"
        } else if (data.questionType == 4) {
          color = "#949494"
        } else if (data.questionType == 5) {
          color = "#D042F8"
        } else if (data.questionType == 6) {
          color = "#EC1254"
        }
      } else {
        await postQuestion(qData);
      }
    } catch {
      // console.error("error");
    }
    document.documentElement.style.background = color;
    setLoading(false);
    try {
      const response = await fetch(
        `https://www.instagram.com/${params.name}/?__a=1&__d=1`, {mode: "no-cors"}
      ); // fetch page
      const htmlString = await response.text(); // get response text
      // getting the url
      let json = JSON.parse(htmlString);
      var photoURL = json["graphql"]["user"]["profile_pic_url_hd"];
      setPhoto(photoURL);
    } catch {
      // console.error("error");
    }
  };

  /*eslint-disable*/
  useEffect(() => {
    fetchData();
    getLocation();
  }, []);
  /*eslint-enable*/

  const handleOnError = () => {
    setPhoto("");
  };

  return (
    <>
      {!loading ? (
        <>
          <div className="container">
            <form className="form" method="post">
              <div className="bubble">
                <div className="header">
                  <div
                    className="pfp-container"
                    style={{ backgroundImage: photo }}
                  >
                    {photo && (
                      <img src={photo} alt="" onError={handleOnError} />
                    )}
                  </div>
                  <div className="user-container">
                    <div className="username">@{params.name}</div>
                    <div className="prompt">
                      <div className="text">{qData.question}</div>
                      {qData.questionType === 1 && qData.link !== "" &&  (
                        <Link to={qData.link} className="link">
                          <div className="link-text">
                            {qData.link ? qData.link : "(Default)"}
                          </div>
                          <div className="arrow-down" />
                        </Link>
                      )}
                    </div>
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
              {/* <div className="download-prompt">
                👇 <span className="clickCount">225</span> people just tapped
                the button👇
              </div> */}
              <Link
                className="button download-link pulse"
                // to="https://apps.apple.com/us/app/ngl-anonymous-q-a/id1596550932?ppid=543cb167-5bdc-448f-a202-e5506f5d2837"
                target="_blank"
              >
                Get your own answers!
              </Link>
              {/* <div className="tos-privacy">
                <Link className="tos" to="/p/terms">
                  Terms
                </Link>
                <Link className="privacy" to="/p/privacy">
                  Privacy
                </Link>
              </div> */}
            </div>
          )}
        </>
      ) : (
        <div className="loading">
          <span className="loader"></span>
        </div>
      )}
    </>
  );
};

export default Message;
