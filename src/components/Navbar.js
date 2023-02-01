import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Link } from "react-router-dom";
import { database } from "../misc/firebase";
import { getAuth, signOut } from "firebase/auth";
import { ref, serverTimestamp, onDisconnect, set } from "firebase/database";
import { Navigate } from "react-router-dom";

export default function Navbar() {
  let onsignout = () => {
    const auth = getAuth();
    let isOfflineForDatabase = {
      state: "offline",
      last_changed: serverTimestamp(),
    };
    let userStatusDatabaseRef = ref(
      database,
      `/status/${auth.currentUser.uid}`
    );
    let disconnectRef = onDisconnect(userStatusDatabaseRef);
    set(disconnectRef, isOfflineForDatabase).then(() => {
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          Navigate("/signinup", { replace: true });
        })
        .catch((error) => {
          // An error happened.
        });
    });
  };
  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-800">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-8 w-10"
                        src="https://static.wixstatic.com/media/2e9de8_65291af9f86b4fc2a8eb037447cc2c7e~mv2.png/v1/fill/w_240,h_212,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/TCET%20logo%20(1).png"
                        alt="Your Company"
                      />
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        <Link
                          className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:text-white"
                          to={"/"}
                        >
                          Dashboard
                        </Link>
                        <button
                          className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:text-white"
                          onClick={onsignout}
                        >
                          sign out
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                  <Link
                    className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:text-white"
                    to={"/"}
                  >
                    Dashboard
                  </Link>
                  <button
                    className="text-gray-300 hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:text-white"
                    onClick={onsignout}
                  >
                    sign out
                  </button>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </>
  );
}
