import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from './elements/Text';
import {Icon} from './elements/Icon';
import {TodoList} from 'realms/TodoList';
import {useSelectedList} from 'store/SelectedListProvider';
import {Touchable} from './elements/Touchable';
import { COLORS } from 'helpers/colors';

interface Props {
  item: TodoList;
}

export const ListItem = ({item}: Props) => {
  const {selectedList, setSelectedList} = useSelectedList();
  return (
    <View style={styles.container}>
      <Touchable
        onPress={() => {
          setSelectedList(item._id);
        }}>
        <View style={styles.checkIconContainer}>
          {selectedList?.equals(item._id) ? (
            <Icon name="circle" size={26} color={COLORS.primaryDark} />
          ) : (
            <Icon name="circle-thin" size={26} color={COLORS.primaryDark} />
          )}
        </View>
      </Touchable>
      <View style={styles.textContainer}>
        <Text>{item.name ?? ''}</Text>
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
