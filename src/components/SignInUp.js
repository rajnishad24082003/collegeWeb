import React, { useState } from "react";
import "../assets/signup.css";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { serverTimestamp, ref, set } from "firebase/database";
import { auth, database } from "../misc/firebase";
import { Modal, Button } from "rsuite";

function SignInUp() {
  let [errorCode, seterrorCode] = useState("");
  let [errorMessage, seterrorMessage] = useState("");
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  let onproviderlogin = async (provider) => {
    try {
      let result = await signInWithPopup(auth, provider);
        await set(ref(database, `/profile/${result.user.uid}`), {
        name: result.user.displayName,
        email: result.user.email,
        createdAt: serverTimestamp(),
        image: result.user.photoURL,
      });
    } catch (error) {
      console.log(error);
      const errorCode = error.code;
      const errorMessage = error.message;
      seterrorCode(errorCode);
      seterrorMessage(errorMessage);
      setOpen(true);
      
    }
  };

  let ongooglelogin = (e) => {
    e.preventDefault();
    onproviderlogin(new GoogleAuthProvider());
  };

  let [hideShow, setHideShow] = useState("");

  let signinpage = () => {
    setHideShow("");
  };
  let signuppage = () => {
    setHideShow("right-panel-active");
  };
  let [name, setName] = useState("");
  let funForName = (e) => {
    setName(e.target.value);
  };
  let [password, setpassword] = useState("");
  let funForPassword = (e) => {
    setpassword(e.target.value);
  };
  let [email, setEmail] = useState("");
  let funForEmail = (e) => {
    setEmail(e.target.value);
  };

  let signUpfun = async (ev) => {
    ev.preventDefault();
    let data = {
      name: name,
      email: email,
      password: password,
    };
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await set(ref(database, `/profile/${user.uid}`), {
          name: name,
          email: email,
          createdAt: serverTimestamp(),
          image: user.photoURL,
        });
      })
      .catch((error) => {
        seterrorCode(error.code);
        seterrorMessage(error.message);
        setOpen(true);
      });
  };
  let [email2, setemail2] = useState("");
  let [password2, setpassword2] = useState("");
  let signUpEmailFun = (ev) => {
    setemail2(ev.target.value);
  };
  let signUpPasswordFun = (ev) => {
    setpassword2(ev.target.value);
  };
  let signInFun = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email2, password2)
      .then(async (userCredential) => {})
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        seterrorCode(errorCode);
        seterrorMessage(errorMessage);
        setOpen(true);
      });
  };
  return (
    <div className="signInUpmainCont">
      <div className={`containersignup ${hideShow}`} id="containersignup">
        {/* actual form sign up*/}
        <div className="form-container sign-up-container">
          <form action="#" className="formsignup">
            <h1 className="h1signup">Create Account</h1>

            <div className="social-container">
              <button onClick={ongooglelogin} className="social asignup">
                <i className="bi bi-google"></i>
              </button>
            </div>
            <span className="spansignup">
              or use your email for registration
            </span>
            <input
              className="inputsignup"
              type="text"
              placeholder="name"
              onChange={funForName}
            />
            <input
              className="inputsignup"
              type="email"
              placeholder="Email"
              onChange={funForEmail}
            />
            <input
              className="inputsignup"
              type="text"
              placeholder="Password"
              onChange={funForPassword}
            />
            <button className="buttonsignup" onClick={signUpfun}>
              Sign Up
            </button>
            <button
              className="orsignin"
              onClick={() => {
                signinpage();
              }}
            >
              sign in
            </button>
          </form>
        </div>
        {/* actual form sign up*/}

        {/* actual form sign in*/}
        <div className="form-container sign-in-container">
          <form action="#" className="formsignup">
            <h1 className="h1signup">Sign in</h1>
            <div className="social-container">
              <button onClick={ongooglelogin} className="social asignup">
                <i className="bi bi-google"></i>
              </button>
            </div>
            <span className="spansignup">or use your account</span>
            <input
              className="inputsignup"
              type="email"
              placeholder="Email"
              onChange={signUpEmailFun}
            />
            <input
              className="inputsignup"
              type="password"
              placeholder="Password"
              onChange={signUpPasswordFun}
            />
            <a href="*" className="asignup">
              Forgot your password?
            </a>
            <button className="buttonsignup" onClick={signInFun}>
              Sign In
            </button>
            <button
              className="orsignup"
              onClick={() => {
                signuppage();
              }}
            >
              sign up
            </button>
          </form>
        </div>
        {/* actual form sign in*/}

        {/* transition form sign in/up */}
        <div className="overlay-container">
          <div className="overlaysignup">
            <div className="overlay-panel overlay-right">
              <h1>Welcome Back!</h1>
              <p>
                To keep connected with us please login with your personal info
              </p>
              <button
                className="ghost buttonsignup"
                id="signIn"
                onClick={() => {
                  signuppage();
                }}
              >
                Sign Up
              </button>
            </div>
            <div className="overlay-panel overlay-left">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button
                className="ghost buttonsignup"
                id="signUp"
                onClick={() => {
                  signinpage();
                }}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
        {/* transition form sign in/up */}
      </div>
      <Modal keyboard={false} open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>{errorCode}</Modal.Title>
          <Modal.Body>{errorMessage}</Modal.Body>
          <Modal.Footer>
            <Button onClick={handleClose} appearance="subtle">
              Cancel
            </Button>
          </Modal.Footer>
        </Modal.Header>
      </Modal>
    </div>
  );
}

export default SignInUp;
