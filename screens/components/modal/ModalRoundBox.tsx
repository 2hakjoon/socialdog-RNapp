import React, {ReactNode} from 'react';
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import {colors} from '../../../utils/colors';
import AntDesignIcon from '../Icons/AntDesign';
import TextComp from '../TextComp';

interface IModalRoundBox {
  title: string;
  children: ReactNode;
  closeModal: () => void;
}

function ModalRoundBox({title, children, closeModal}: IModalRoundBox) {
  return (
    <TouchableOpacity style={styles.wrapper} activeOpacity={1}>
      <View style={styles.topBar}>
        <View style={styles.empty} />
        <TextComp text={title} size={20} weight={'500'} />
        <TouchableOpacity onPress={closeModal}>
          <AntDesignIcon name="close" size={30} />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>{children}</View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 2,
    width: '90%',
    height: '80%',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowOpacity: 0.4,
        shadowRadius: 20,
        shadowOffset: {
          height: 10,
          width: 0,
        },
      },
      //android
      android: {
        elevation: 20,
      },
    }),
  },
  topBar: {
    flex: 1,
    width: '100%',
    borderBottomColor: colors.PLightGray,
    borderBottomWidth: 2,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  empty: {
    width: 30,
    height: 30,
  },
  content: {
    width: '100%',
    flex: 10,
  },
});

export default ModalRoundBox;
