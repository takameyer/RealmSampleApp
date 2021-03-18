import React, {useState, useEffect, ReactElement, memo} from 'react';
import {StyleSheet, View, Modal} from 'react-native';
import {Text} from './elements/Text';
import {Icon} from './elements/Icon';
import {TodoItem, useTodoLists} from 'realms/TodoList';
import {Touchable} from './elements/Touchable';
import {EditItemModal} from './EditItemModal';

interface Props {
  todoItem: TodoItem;
}

export const TodoListItem = ({todoItem}: Props) => {
  const {toggleItemFinished} = useTodoLists();
  const [modalVisible, setModalVisible] = useState(false);

  function isItemDue(deadline: Date): boolean {
    return new Date() >= deadline;
  }

  /**
   * Of course!  after synchronization the date object comes back as a simple string
   * I have then used "new Date" to sanitize the input.  That will work with either strings
   * or Date types.
   */
  const renderDeadline = (): ReactElement | null => {
    if (todoItem?.deadline) {
      const deadline = new Date(todoItem?.deadline);
      return (
        <Text
          style={
            isItemDue(deadline) ? styles.deadlineDue : styles.deadlineNotDue
          }>
          {deadline.toDateString()}
        </Text>
      );
    }
    return null;
  };

  if (!todoItem.isValid()) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.checkIconContainer}>
        {todoItem.done ? (
          <Touchable onPress={() => toggleItemFinished(todoItem._id)}>
            <Icon name="check-square" />
          </Touchable>
        ) : (
          <Touchable onPress={() => toggleItemFinished(todoItem._id)}>
            <Icon name="square-o" />
          </Touchable>
        )}
      </View>
      <View style={styles.textContainer}>
        <Text>{todoItem.description ?? ''}</Text>
        {renderDeadline()}
      </View>
      <View style={styles.editIconContainer}>
        <Touchable onPress={() => setModalVisible(true)}>
          <Icon name="pencil" />
        </Touchable>
      </View>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <EditItemModal setModalVisible={setModalVisible} todoItem={todoItem} />
      </Modal>
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
  deadlineNotDue: {
    color: '#888',
  },
  deadlineDue: {
    color: 'red',
  },
});
