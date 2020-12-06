import React, { useState } from "react";
import { useHistory } from "react-router-dom";
// import api from "./api";
import "./Main.css";

export default function Main() {
  console.log("entered main");
  const history = useHistory();
  console.log("main");
  const [val, setValue] = useState("");
  const search = () => {};
  /* const l = async () => {
    const k = await api.get("/");
    console.log(k);
  };
  l();*/
  console.log("last main");
  return (
    <div className="main">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          search();
        }}
      >
        <div className="ui fluid icon input">
          <input
            value={val}
            onChange={(e) => setValue(e.target.value)}
            type="text"
            placeholder="Search..."
          />
          <i onClick={search} className="search link icon"></i>
        </div>
      </form>

      <div className="bottom">
        <div className="box">
          <div className="header">Title</div>
          <p className="meta">Creator name</p>
          <img
            alt="brahmi"
            src="https://static.toiimg.com/photo/73836614.cms"
          />
          <img
            alt="brahmi"
            src="https://static.toiimg.com/photo/73836614.cms"
          />
          <img
            alt="brahmi"
            src="https://static.toiimg.com/photo/73836614.cms"
          />
          <img
            alt="brahmi"
            src="https://static.toiimg.com/photo/73836614.cms"
          />
        </div>
        <div className="box">
          <div className="header">Title</div>
          <p className="meta">Creator name</p>
          <img
            alt="brahmi"
            src="https://static.toiimg.com/photo/73836614.cms"
          />
          <img
            alt="brahmi"
            src="https://static.toiimg.com/photo/73836614.cms"
          />
          <img
            alt="brahmi"
            src="https://static.toiimg.com/photo/73836614.cms"
          />
          <img
            alt="brahmi"
            src="https://static.toiimg.com/photo/73836614.cms"
          />
        </div>
        <div className="box">
          <div className="header">Title</div>
          <p className="meta">Creator name</p>
          <img
            alt="brahmi"
            src="https://static.toiimg.com/photo/73836614.cms"
          />
          <img
            alt="brahmi"
            src="https://static.toiimg.com/photo/73836614.cms"
          />
          <img
            alt="brahmi"
            src="https://static.toiimg.com/photo/73836614.cms"
          />
          <img
            alt="brahmi"
            src="https://static.toiimg.com/photo/73836614.cms"
          />
        </div>
      </div>
    </div>
  );
}
/*
<!-- The core Firebase JS SDK is always required and must be listed first -->
<script src="/__/firebase/8.0.0/firebase-app.js"></script>

<!-- TODO: Add SDKs for Firebase products that you want to use
     https://firebase.google.com/docs/web/setup#available-libraries -->

<!-- Initialize Firebase -->
<script src="/__/firebase/init.js"></script>*/
