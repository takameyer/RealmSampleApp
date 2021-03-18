import React, {useContext, useEffect, useState} from 'react';
import Realm, {ObjectSchema, BSON } from 'realm';
import {ObjectId} from 'bson'
import {useRealm} from './RealmProvider';

export interface TodoItemInterface {
  _id: ObjectId;
  description: string;
  done: boolean;
  deadline?: Date;
}
export class TodoItem extends Realm.Object {
  declare _id: ObjectId;
  declare description: string;
  declare done: boolean;
  declare deadline?: Date;
  declare lists: TodoList[];

  static generateNewObject(description: string) {
    return {
      _id: new BSON.ObjectId(),
      description,
      done: false,
    };
  }

  static schema: ObjectSchema = {
    name: 'TodoItem',
    properties: {
      _id: 'objectId',
      description: 'string',
      done: {type: 'bool', default: false},
      lists: {
        type: 'linkingObjects',
        objectType: 'TodoList',
        property: 'items',
      },
      deadline: 'date?',
    },
    primaryKey: '_id',
  };
}

export interface TodoListInterface {
  _id: ObjectId;
  name: string;
  items: Realm.List<TodoItemInterface>;
}

export class TodoList extends Realm.Object {
  declare _id: ObjectId;
  declare name: string;
  declare items: Realm.List<TodoItem>;

  static generateNewObject(name: string) {
    return {
      _id: new BSON.ObjectId(),
      name,
    };
  }

  getItemCount() {
    return this.items.length;
  }

  static schema: ObjectSchema = {
    name: 'TodoList',
    properties: {
      _id: 'objectId',
      name: 'string',
      items: 'TodoItem[]',
    },
    primaryKey: '_id',
  };
}

interface Store {
  todoLists: Realm.Collection<TodoList>;
}

type Props = {
  children: React.ReactNode;
};

export type TodoListProviderContext = {
  /**
   * contains all of the todo list data
   */
  store?: Store;
  /**
   * adds an item to the given todo list
   *
   * @param listId id of the todo list that the item is being added to
   * @param description short description for the todo item
   */
  addItemToList: (listId: ObjectId, description: string) => void;
  /**
   * toggles the done value of an item
   *
   * @param todoId id of the todo item being toggled
   */
  toggleItemFinished: (todoId: ObjectId) => void;
  /**
   * updates the todo item's description
   *
   * @param todoId id of the todo item being changed
   * @param description short description for the todo item
   */
  editItemDescription: (todoId: ObjectId, description: string) => void;
  /**
   * removes the todo item from the store
   *
   * @param todoId id of the todo item being removed
   */
  removeItem: (todoId: ObjectId) => void;
  /**
   * creates a new todo list
   *
   * @param name name of the new list
   */
  createNewList: (name: string) => void;
  /**
   * updates an items todoList id
   *
   * @param todoId  id of the item being moved
   * @param listId  id of the list the item will be moved to
   */
  moveItemToList: (todoId: ObjectId, listId: ObjectId) => void;
  /**
   * adds a deadline to a todo item
   *
   * @param todoId id of the todo item
   * @param deadline date the item is due
   */
  setItemDeadline: (todoId: ObjectId, deadline: Date) => void;
};

/**
 * This provides the context of the todoList store
 */
const TodoListsContext = React.createContext<TodoListProviderContext | null>(
  null,
);

/**
 * The provider component should wrap the entire app.  This will provide all child components access
 * to the store and its methods.
 *
 * Example:
 * <TodoListProvider>
 *   <App/>
 * </TodoListProvider>
 */

export const TodoListProvider = ({children}: Props) => {
  const realm = useRealm();
  const [store, setStore] = useState<Store>();

  useEffect(() => {
    const initializeRealm = async () => {
      try {
        const todoLists = realm.objects(TodoList);
        if (todoLists.length === 0) {
          realm?.write(() => {
            const list = realm?.create<TodoList>('TodoList', {
              ...TodoList.generateNewObject('My Todo List'),
            });
            const item = realm?.create<TodoItem>('TodoItem', {
              _id: new BSON.ObjectId(),
              description: 'make a realm app',
            });
            list.items.push(item);
          });
        }
        todoLists.addListener(onTodoListChange);
      } catch (err) {
        console.error(err);
      }
    };
    initializeRealm();
  }, [realm]);

  function onTodoListChange(
    collection: Realm.Collection<TodoList>,
    changes: Realm.CollectionChangeSet,
  ) {
    try {
      setStore({
        todoLists: collection,
      });
    } catch (err) {
      console.error(err);
    }
  }

  function addItemToList(listId: ObjectId, description: string) {
    const parentList = realm?.objectForPrimaryKey(TodoList, listId);
    if (parentList != null) {
      realm?.write(() => {
        const item = realm?.create(TodoItem, {
          ...TodoItem.generateNewObject(description),
          list: parentList,
        });
        parentList.items.push(item);
      });
    }
  }

  function toggleItemFinished(todoId: ObjectId) {
    const todoItem = realm?.objectForPrimaryKey(TodoItem, todoId);
    if (todoItem != null) {
      realm?.write(() => {
        todoItem.done = !todoItem.done;
      });
    }
  }

  function editItemDescription(todoId: ObjectId, description: string) {
    const todoItem = realm?.objectForPrimaryKey(TodoItem, todoId);
    if (todoItem != null) {
      realm?.write(() => {
        todoItem.description = description;
      });
    }
  }

  function removeItem(todoId: ObjectId) {
    const todoItem = realm?.objectForPrimaryKey(TodoItem, todoId);
    if (todoItem != null) {
      realm?.write(() => {
        realm?.delete(todoItem);
      });
    }
  }

  function createNewList(name: string) {
    realm?.write(() => {
      const list = realm?.create(TodoList, TodoList.generateNewObject(name));
    });
  }

  function moveItemToList(todoId: ObjectId, listId: ObjectId) {
    const todoItem = realm?.objectForPrimaryKey(TodoItem, todoId);
    const todoList = realm?.objectForPrimaryKey(TodoList, listId);
    if (todoItem != null && todoList != null) {
      const parentList = todoItem.lists[0];
      if (parentList !== todoList) {
        const todoIndex = parentList.items.indexOf(todoItem);
        realm.write(() => {
          parentList.items.splice(todoIndex, 1);
          todoList.items.push(todoItem);
        });
      }
    }
  }

  function setItemDeadline(todoId: ObjectId, deadline: Date) {
    const todoItem = realm?.objectForPrimaryKey(TodoItem, todoId);
    if (todoItem != null) {
      realm?.write(() => {
        todoItem.deadline = deadline;
      });
    }
  }

  console.log("store: ", store)

  return (
    <TodoListsContext.Provider
      value={{
        store,
        addItemToList,
        toggleItemFinished,
        editItemDescription,
        removeItem,
        createNewList,
        moveItemToList,
        setItemDeadline,
      }}>
      {children}
    </TodoListsContext.Provider>
  );
};

/**
 * hook that provides getters and setters to the todo list store
 *
 * @returns TodoListsContext
 */
export const useTodoLists = () => {
  const context = useContext(TodoListsContext);
  if (context == null) {
    throw new Error('TodoListContext not found!');
  }
  return context;
};
