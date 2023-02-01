import { auth, database } from "../misc/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import {
  ref,
  onValue,
  serverTimestamp,
  onDisconnect,
  set,
} from "firebase/database";
const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const authunsubscribfun = onAuthStateChanged(auth, (authobj) => {
      if (authobj) {
        let userStatusDatabaseRef = ref(database, `/status/${authobj.uid}`);
        const starCountRef = ref(database, `/profile/${authobj.uid}`);
        onValue(starCountRef, (snapshot) => {
          const name = snapshot.val() ? snapshot.val().name : "no name";
          const createdAt = snapshot.val()
            ? snapshot.val().createdAt
            : "no date";
          const image = snapshot.val()
            ? snapshot.val().image
            : "no image";
          const avatar = snapshot.val()
            ? snapshot.val().avatar
            : "no avatar";
          const data = {
            name,
            createdAt,
            uid: authobj.uid,
            email: authobj.email,
            image,
            avatar,
          };
          setProfile(data);
          setIsLoading(false);
        });
        let isOfflineForDatabase = {
          state: "offline",
          last_changed: serverTimestamp(),
        };

        let isOnlineForDatabase = {
          state: "online",
          last_changed: serverTimestamp(),
        };
        let presenceRef = ref(database, ".info/connected");
        onValue(presenceRef, (snapshot) => {
          if (!!snapshot.val() === false) {
            return;
          }

          let disconnectRef = onDisconnect(userStatusDatabaseRef);
          set(disconnectRef, isOfflineForDatabase).then(() => {
            set(userStatusDatabaseRef, isOnlineForDatabase);
          });
        });
      } else {
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => {
      authunsubscribfun();
    };
  }, []);
  return (
    <ProfileContext.Provider value={{ profile, isLoading }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  return useContext(ProfileContext);
};
