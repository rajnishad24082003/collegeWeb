import React, { useState } from "react";
import { useProfile } from "../context/profile.context";
import Loading from "./Loading";
import Uploader from "./Uploader";
import {
  uploadBytes,
  getDownloadURL,
  ref as ref_storage,
} from "firebase/storage";
import { storage, database } from "../misc/firebase";
import {
  ref as ref_database,
  push,
  update,
  serverTimestamp,
} from "firebase/database";
import { Modal, Message } from "rsuite";

function UploadComponent() {
  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = React.useState(0);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEntered = () => {
    setTimeout(() => setRows(80), 2000);
  };

  let allUseData = useProfile();
  let [titletext, settitletext] = useState("");
  let titleInput = (e) => {
    settitletext(e.target.value);
  };
  let [Isloading, setIsloading] = useState(false);
  let [wholeFiles, setwholeFiles] = useState([]);
  let MAXSIZE = 1024 * 1000 * 10; //10mb
  let mainfilefun = (e) => {
    let filterFiles = Object.values(e.target.files)
      .filter((el) => el.size <= MAXSIZE)
      .slice(0, 5);
    setwholeFiles(filterFiles);
  };
  let UploadandClose = async () => {
    setIsloading(true);
    try {
      let UploadPromises = wholeFiles.map(async (val, index) => {
        let RandomName = `${val.name}${new Date()}`;
        let storageRef = ref_storage(
          storage,
          `allTheFiles/${allUseData.profile.uid}/${RandomName}`
        );
        let finallyUploadedPromises = await uploadBytes(storageRef, val, {
          cacheControl: `public,max-age=${3600 * 24 * 3}`,
        });
        return finallyUploadedPromises;
      });

      let uploadSnapshots = await Promise.all(UploadPromises);
      let shapPromises = uploadSnapshots.map(async (val, index) => {
        return {
          contentType: val.metadata.contentType,
          name: val.metadata.name,
          url: await getDownloadURL(
            ref_storage(storage, val.metadata.fullPath)
          ),
        };
      });
      let files = await Promise.all(shapPromises);
      await afterUpload(files);
    } catch (error) {
      console.log(error);
    }
  };
  let messageSend = async (val) => {
    const starCountRef = ref_database(database, `/files`);
    const newpostkey = push(starCountRef).key;
    const updates = {};
    updates[`/files/${newpostkey}`] = {
      title: titletext,
      author: {
        name: allUseData.profile.name,
        uid: allUseData.profile.uid,
        createdAt: allUseData.profile.createdAt,
        ...(allUseData.profile.image
          ? { profileAvatar: allUseData.profile.image }
          : {}),
      },
      createdTime: serverTimestamp(),
      val,
    };
    update(ref_database(database), updates);
    settitletext("");
    setwholeFiles([]);
    setIsloading(false);
    handleOpen();
  };
  let afterUpload = (val) => {
    messageSend(val);
  };
  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-500 bg-no-repeat bg-cover ">
        <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
        <div className="sm:max-w-lg w-full p-10 bg-white rounded-xl z-10">
          {Isloading ? (
            <Loading></Loading>
          ) : (
            <>
              <div className="text-center">
                <h2 className="mt-5 text-3xl font-bold text-gray-900">
                  File Upload!
                </h2>
                <div className=" flex justify-center">
                  <img
                    src={
                      allUseData.profile.avatar
                        ? `${allUseData.profile.avatar}`
                        : `${allUseData.profile.image}`
                    }
                    alt="userimage not able to load"
                    style={{
                      width: "40%",
                      borderRadius: "200px",
                    }}
                  />
                </div>
                <h3 className="text-center">{allUseData.profile.name}</h3>
                <p className="mt-2 text-sm text-gray-400">
                  {allUseData.profile.email}
                </p>
              </div>
              <div className="grid grid-cols-1 space-y-2">
                <label className="text-sm font-bold text-gray-500 tracking-wide">
                  Title
                </label>
                <input
                  className="text-base p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  placeholder="poster_group8"
                  value={titletext}
                  onChange={titleInput}
                />
              </div>
              <div className="grid grid-cols-1 space-y-2">
                <label className="text-sm font-bold text-gray-500 tracking-wide">
                  Attach Document
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-10 group text-center">
                    <div className="h-full w-full text-center flex flex-col items-center justify-center ">
                      {wholeFiles.length !== 0 ? (
                        <Uploader data={wholeFiles}></Uploader>
                      ) : (
                        <div className="flex flex-auto max-h-48 w-2/5 mx-auto -mt-10">
                          <img
                            className="has-mask h-36 object-center"
                            src="https://img.freepik.com/free-vector/image-upload-concept-landing-page_52683-27130.jpg?size=338&ext=jpg"
                            alt="freepik"
                          />
                        </div>
                      )}

                      <p className="pointer-none text-gray-500 ">
                        <span className="text-sm">Drag and drop</span> files
                        here <br /> or{" "}
                        <span className="text-blue-600 hover:underline">
                          select a file
                        </span>{" "}
                        from your computer
                      </p>
                    </div>
                    <input
                      type="file"
                      multiple={true}
                      className="hidden"
                      onChange={mainfilefun}
                    />
                  </label>
                </div>
              </div>
              <p className="text-sm text-gray-300">
                <span>File type: doc,pdf,types of images</span>
              </p>
              <div>
                <button
                  type="submit"
                  className="my-5 w-full flex justify-center bg-blue-500 text-gray-100 p-4  rounded-full tracking-wide font-semibold  focus:outline-none focus:shadow-outline hover:bg-blue-600 shadow-lg cursor-pointer transition ease-in duration-300"
                  onClick={UploadandClose}
                >
                  Upload
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        onEntered={handleEntered}
        onExited={() => {
          setRows(0);
        }}
      >
        <Message showIcon type="success" header="Success">
          File uploaded successfully
        </Message>
      </Modal>
    </>
  );
}

export default UploadComponent;
