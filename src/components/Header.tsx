import React, {useState} from 'react';
import {View, StyleSheet, Modal} from 'react-native';
import {Text} from './elements/Text';
import {Icon} from './elements/Icon';
import {useTodoLists} from 'realms/TodoList';
import {COLORS} from 'helpers/colors';
import {Touchable} from './elements/Touchable';
import {useSelectedList} from 'store/SelectedListProvider';
import {ListConfigModal} from './ListConfigModal';

export const Header = () => {
  const {store} = useTodoLists();
  const {selectedList} = useSelectedList();
  const [modalVisible, setModalVisible] = useState(false);

  const list = store?.todoLists?.find(list => selectedList?.equals(list._id));

  return (
    <View style={styles.container}>
      <Touchable
        onPress={() => {
          setModalVisible(true);
        }}>
        <Icon name={'list'} size={26} color={COLORS.primaryText} />
      </Touchable>
      <Text style={styles.headerText}>{list?.name ?? ''}</Text>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <ListConfigModal setModalVisible={setModalVisible} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: 18,
    color: COLORS.primaryText,
    flex: 1,
    textAlign: 'center',
  },
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
});
