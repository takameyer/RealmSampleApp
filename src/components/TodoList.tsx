import React, {useMemo} from 'react';
import {View, Text, FlatList} from 'react-native';
import {useTodoLists, TodoItem} from 'realms/TodoList';
import {TodoListItem} from './TodoListItem';
import {useSelectedList} from 'store/SelectedListProvider';

export const TodoList = () => {
  const {selectedList} = useSelectedList();
  const {store} = useTodoLists();

  const list = useMemo(() => {
    return store?.todoLists?.find(list => selectedList?.equals(list._id));
  }, [selectedList]);

  if (store?.todoLists == null && selectedList == undefined) {
    return null;
  }

  if (list == null) {
    return null;
  }

  return (
    <FlatList<TodoItem>
      data={list.items}
      renderItem={({item}) => {
        return <TodoListItem todoItem={item} />;
      }}
      keyExtractor={item => `${item._id}`}
    />
  );
};
