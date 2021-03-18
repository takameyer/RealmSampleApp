import React, {useState} from 'react';
import {View, StyleSheet, Modal} from 'react-native';
import {Icon} from './elements/Icon';
import {COLORS} from 'helpers/colors';
import {AddItemModal} from './AddItemModal';
import {Touchable} from './elements/Touchable';

export const Footer = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Touchable
        style={styles.addItemContainer}
        onPress={() => {
          setModalVisible(true);
        }}>
        <Icon name={'plus'} size={26} color={COLORS.primaryText} />
      </Touchable>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <AddItemModal setModalVisible={setModalVisible} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addItemContainer: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: COLORS.primaryLight,
  },
});
