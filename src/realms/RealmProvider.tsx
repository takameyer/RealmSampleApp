import {ObjectId} from 'bson';
import React, {useContext, useEffect, useState} from 'react';
import Realm, {Configuration} from 'realm';
import {useRealmCloud} from './RealmCloudProvider';

const RealmContext = React.createContext<Realm | null>(null);

type Props = {
  children: React.ReactNode;
  config: Configuration;
};

export const RealmProvider = ({children, config}: Props) => {
  const [realm, setRealm] = useState<Realm | null>(null);
  const cloud = useRealmCloud();
  useEffect(() => {
    if (!realm?.isClosed) {
      realm?.close();
    }
    const initRealm = async () => {
      try {
        //This is not the proper place to do this
        const user =
          cloud.currentUser ??
          (await loginEmailPassword(
            'andrew.meyer@mongodb.com',
            'test123!',
            cloud,
          ));

        //const user = await cloud.logIn( await Realm.Credentials.anonymous())
        console.log('logging in user: ', user.id);
        const realmConfig = {
          ...config,
          sync: {
            user,
            partitionValue: new ObjectId(user.id),
          },
        };
        console.log('myconfig: ', realmConfig);
        const openRealm = await Realm.open(realmConfig);
        //console.log("Realm path: ", Realm.defaultPath)
        setRealm(openRealm);
      } catch (err) {
        console.error(err);
      }
    };
    initRealm();
    return () => {
      console.log('closing realm');
      realm?.close();
    };
  }, [config]);

  if (realm == null) {
    return null;
  }

  return (
    <RealmContext.Provider value={realm}>{children}</RealmContext.Provider>
  );
};

export const useRealm = () => {
  const context = useContext(RealmContext);
  if (context == null) {
    throw new Error('RealmContext not found!');
  }
  return context;
};

async function loginEmailPassword(email, password, cloud) {
  // Create an anonymous credential
  const credentials = Realm.Credentials.emailPassword(email, password);
  try {
    // Authenticate the user
    const user = await cloud.logIn(credentials);
    return user;
  } catch (err) {
    console.error('Failed to log in', err);
  }
}
