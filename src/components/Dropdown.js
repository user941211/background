import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, StyleSheet } from 'react-native';

const Dropdown = ({ devices, onSelect }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => { onSelect(item); setModalVisible(false); }}>
      <Text style={styles.item}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.button}>
        <Text>기기 선택</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={styles.centeredView} onPress={() => setModalVisible(false)}>
          <View style={styles.modalView}>
            <FlatList
              data={devices}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.text}>닫기</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    backgroundColor: "#4ECDC4",
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    margin: 10,
    verticalAlign: 'middle',
  },
  closeButton: {
    backgroundColor: "#2196F3",
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  text: {
    color: "white",
    textAlign: "center"
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

export default Dropdown;
