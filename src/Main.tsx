import React from 'react';
import {TodoListProvider} from 'realms/TodoList';
import {App} from 'App';
import {SelectedListProvider} from 'store/SelectedListProvider';
import {RealmProvider} from 'realms/RealmProvider';
import {AppConfiguration, Configuration, ObjectSchema} from 'realm';
import {TodoItem, TodoList} from 'realms/TodoList';
import {RealmCloudProvider} from 'realms/RealmCloudProvider';

const cloudConfig: AppConfiguration = {
  id: 'code-challenge-juedd',
  timeout: 10000,
  app: {
    name: 'default',
    version: '0',
  },
};

const config: Configuration = {
  schema: [TodoList, TodoItem],
};

export const Main = () => {
  return (
    <RealmCloudProvider config={cloudConfig}>
      <RealmProvider config={config}>
        <TodoListProvider>
          <SelectedListProvider>
            <App />
          </SelectedListProvider>
        </TodoListProvider>
      </RealmProvider>
    </RealmCloudProvider>
  );
};

export default Main;
