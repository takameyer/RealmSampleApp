import {ObjectId} from 'bson';
import React, {useState, useContext, useEffect} from 'react';
import {useTodoLists} from 'realms/TodoList';

export type SelectedListProviderContext = {
  /**
   * id of the selected todo list
   */
  selectedList?: ObjectId;
  /**
   * manipulates the state of the selected todo list to the given listId
   */
  setSelectedList: (listId: ObjectId) => void;
};

const SelectedListContext = React.createContext<SelectedListProviderContext | null>(
  null,
);

interface Props {
  children: React.ReactNode;
}

/**
 * The provider component should wrap the entire app.  This will provide all child components access
 * to the selectedList id.
 * This also needs to be wrapped in the TodoListProvider in order ot properly initialize the selected list
 *
 * NOTE: I have made this separate from the store, was I did not want to persist this or sync it.
 *
 * Example:
 * <TodoListProvider>
 *   <SelectedListProvider>
 *     <App/>
 *   </SelectedListProvider>
 * </TodoListProvider>
 */
export const SelectedListProvider = ({children}: Props) => {
  const {store} = useTodoLists();
  const [selectedList, setSelectedList] = useState<ObjectId | undefined>();

  useEffect(() => {
    if (selectedList == null && store?.todoLists[0] != null) {
      setSelectedList(store?.todoLists[0]?._id);
    }
  }, [store]);

  return (
    <SelectedListContext.Provider
      value={{
        selectedList,
        setSelectedList,
      }}>
      {children}
    </SelectedListContext.Provider>
  );
};

/**
 * Hook to access and manipulate the selected list state
 *
 * @returns SelectedListContext
 */
export const useSelectedList = () => {
  const context = useContext(SelectedListContext);
  if (context == null) {
    throw new Error('SelectedListContext not found!');
  }
  return context;
};
