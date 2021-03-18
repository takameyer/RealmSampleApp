import React, {useState} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {Text} from './elements/Text';
import {TextInput} from './elements/TextInput';
import {useSelectedList} from 'store/SelectedListProvider';
import {Touchable} from './elements/Touchable';
import {COLORS} from 'helpers/colors';
import {useTodoLists} from 'realms/TodoList';
import {ModalBody} from './elements/ModalBody';
import {Icon} from './elements/Icon';
import {ObjectId} from 'bson';

interface Props {
  setModalVisible: (visible: boolean) => void;
}

export const AddItemModal = ({setModalVisible}: Props) => {
  const {selectedList} = useSelectedList();
  const {addItemToList} = useTodoLists();
  const [description, setDescription] = useState('');

  return (
    <ModalBody>
      <TextInput
        value={description}
        placeholder={'Provide a description'}
        onChangeText={setDescription}
      />
      <View style={styles.buttonContainer}>
        <Touchable
          onPress={() => {
            if (description != null && description !== '') {
              addItemToList(selectedList || new ObjectId(), description);
              setModalVisible(false);
            } else {
              Alert.alert('You must set a valid description');
            }
          }}>
          <Icon name="plus" />
          <Text>Add Item</Text>
        </Touchable>
        <Touchable
          onPress={() => {
            setModalVisible(false);
          }}>
          <Text>Close</Text>
          <Icon name="close" />
        </Touchable>
      </View>
    </ModalBody>
  );
};

const styles = StyleSheet.create({
  modalBody: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    padding: 12,
  },
  container: {
    backgroundColor: 'white',
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 10,
    shadowRadius: 10,
  },
  textInputStyle: {
    height: 40,
    borderColor: COLORS.primaryLight,
    borderWidth: 1,
    margin: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  buttonContainer: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
