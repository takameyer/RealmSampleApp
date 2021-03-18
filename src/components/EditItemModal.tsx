import React, {useState} from 'react';
import {View, Alert, StyleSheet, FlatList, Platform} from 'react-native';
import {Text} from './elements/Text';
import {Touchable} from './elements/Touchable';
import {TodoItem, useTodoLists, TodoList} from 'realms/TodoList';
import {ModalBody} from './elements/ModalBody';
import {TextInput} from './elements/TextInput';
import {Icon} from './elements/Icon';
import {MoveListItem} from './MoveListItem';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useSelectedList} from 'store/SelectedListProvider';
import {ObjectId} from 'bson';
import { COLORS } from 'helpers/colors';

interface Props {
  setModalVisible: (visible: boolean) => void;
  todoItem: TodoItem;
}

export const EditItemModal = ({setModalVisible, todoItem}: Props) => {
  const {
    store,
    removeItem,
    editItemDescription,
    moveItemToList,
    setItemDeadline,
  } = useTodoLists();
  const {selectedList} = useSelectedList();
  const [description, setDescription] = useState(todoItem.description);
  //TODO: this is not good (new ObjectId())
  const [todoItemListId, setTodoItemListId] = useState(
    selectedList || new ObjectId(),
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [deadline, setDeadline] = useState<Date | null | undefined>(
    todoItem.deadline,
  );

  return (
    <>
      <ModalBody>
        <View style={styles.headerContainer}>
          <Touchable
            onPress={() => {
              setShowDatePicker(true);
            }}>
            <Text>Set Deadline</Text>
            <Icon name="calendar" />
          </Touchable>
          <Touchable
            onPress={() => {
              removeItem(todoItem._id);
              setModalVisible(false);
            }}>
            <Text>Delete</Text>
            <Icon name="trash-o" />
          </Touchable>
        </View>
        {deadline && (
          <Text label>Deadline: {new Date(deadline).toDateString()}</Text>
        )}
        <Text label>Description:</Text>
        <TextInput
          value={description}
          placeholder={'Set a description'}
          onChangeText={setDescription}
        />
        {/**
         * This should probably belong in a separate modal. Things get pretty packed in iOS with the
         * date picker.  If I had time for UI/UX this would be refactored.
         */}
        <Text label>Move to List:</Text>
        <FlatList<TodoList>
          data={store.todoLists}
          style={{maxHeight: 150}}
          renderItem={({item}) => {
            return (
              <MoveListItem
                todoList={item}
                todoItemListId={todoItemListId}
                setTodoItemListId={setTodoItemListId}
              />
            );
          }}
          keyExtractor={item => `${item._id}`}
        />
        <View style={styles.buttonContainer}>
          <Touchable
            onPress={() => {
              if (description != null && description !== '') {
                editItemDescription(todoItem._id, description);
                moveItemToList(todoItem._id, todoItemListId);
                if (deadline != null) {
                  setItemDeadline(todoItem._id, deadline);
                }
                setModalVisible(false);
              } else {
                Alert.alert('You must set a valid description');
              }
            }}>
            <Icon name="save" />
            <Text>Save Changes</Text>
          </Touchable>
          <Touchable
            onPress={() => {
              setModalVisible(false);
            }}>
            <Text>Close</Text>
            <Icon name="close" size={26} color={COLORS.primaryDark} />
          </Touchable>
        </View>
        {showDatePicker && (
          <DateTimePicker
            value={deadline != null ? new Date(deadline) : new Date()}
            mode={'date'}
            display={'calendar'}
            onChange={(_: any, selectedDate?: Date) => {
              if (Platform.OS === 'android') {
                setShowDatePicker(false);
              }
              if (selectedDate != null) {
                setDeadline(selectedDate);
              }
            }}
          />
        )}
      </ModalBody>
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerContainer: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spacer: {
    flex: 1,
  },
});
