import React from "react";
import "../assets/uploader.css";
import { useState } from "react";
function Uploader({ data }) {
  let [mainImg, setmainImg] = useState(null);

  if (data.length === 0) {
    return (
      <>
        <h2>No files selected</h2>
      </>
    );
  } else {
    return (
      <div className="uploaderMaindiv">
        {data.map((val, index) => {
          let mainSize = String(val.size / (1000 * 1024));
          let reader = new FileReader();
          reader.onload = function (ev) {
            if (mainImg === null) {
              setmainImg(ev.target.result);
            }
          };
          reader.readAsDataURL(data[index]);
          return (
            <div key={index}>
              <div className="border border-dark rounded m-1 p-1 d-flex">
                <div>
                  <img
                    width={40}
                    height={40}
                    src={mainImg}
                    alt="file"
                    className="imageOfUpload border border-success rounded me-1"
                  />
                </div>
                <div>
                  <div className="">File Name : {val.name}</div>
                  <div className="">File size : {mainSize.slice(0, 6)}mb</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Uploader;
