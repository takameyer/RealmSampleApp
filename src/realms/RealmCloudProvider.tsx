import React, {useContext, useEffect, useState} from 'react';
import Realm, {AppConfiguration} from 'realm';

const RealmCloudContext = React.createContext<Realm.App | null>(null);

type Props = {
  children: React.ReactNode;
  config: AppConfiguration;
};

export const RealmCloudProvider = ({children, config}: Props) => {
  const [realmCloud, setRealmCloud] = useState<Realm.App | null>(null);
  useEffect(() => {
    const initRealm = async () => {
      try {
        const openRealmCloud = new Realm.App(config);
        console.log('..setting up cloud: ', openRealmCloud.id);
        setRealmCloud(openRealmCloud);
      } catch (err) {
        console.error(err);
      }
    };
    initRealm();
  }, [config]);

  if (realmCloud == null) {
    return null;
  }

  return (
    <RealmCloudContext.Provider value={realmCloud}>
      {children}
    </RealmCloudContext.Provider>
  );
};

export const useRealmCloud = () => {
  const context = useContext(RealmCloudContext);
  if (context == null) {
    throw new Error('RealmContext not found!');
  }
  return context;
};
