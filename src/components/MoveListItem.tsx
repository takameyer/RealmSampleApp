import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from './elements/Text';
import {Icon} from './elements/Icon';
import {TodoList} from 'realms/TodoList';
import {Touchable} from './elements/Touchable';
import {ObjectId} from 'bson';
import { COLORS } from 'helpers/colors';

interface Props {
  todoList: TodoList;
  setTodoItemListId: (listId: ObjectId) => void;
  todoItemListId: ObjectId;
}

export const MoveListItem = ({
  todoList,
  todoItemListId,
  setTodoItemListId,
}: Props) => {
  return (
    <View style={styles.container}>
      <Touchable
        onPress={() => {
          setTodoItemListId(todoList._id);
        }}>
        <View style={styles.checkIconContainer}>
          {todoItemListId.equals(todoList._id) ? (
            <Icon name="circle" size={26} color={COLORS.primaryDark} />
          ) : (
            <Icon name="circle-thin" size={26} color={COLORS.primaryDark} />
          )}
        </View>
      </Touchable>
      <View style={styles.textContainer}>
        <Text>{todoList.name ?? ''}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  checkIconContainer: {
    padding: 12,
  },
  textContainer: {
    flex: 1,
  },
  editIconContainer: {
    padding: 12,
  },
});
