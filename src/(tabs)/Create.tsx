import { Text, View, StyleSheet, SafeAreaView, Modal, FlatList } from "react-native";
import React from "react";
import {useState} from "react";
import { colors, fonts } from "../constants/constants";
import {Ionicons} from '@expo/vector-icons'

const habit = <Ionicons name='repeat-outline' color={colors.blue} size={25}/>
const task = <Ionicons name='checkmark-circle-outline' color={colors.blue} size={25}/>
const document = <Ionicons name='document-outline' color={colors.blue} size={25}/>

const menuData = [
  {id:'1', title:'Habit', icon:habit},
  {id:'2', title:'Task', icon:task},
  {id:'3', title:'Document', icon:document}
]

const Create = () => {
  const [menuVisible, setMenuVisible] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>S T A Y W E L L</Text>

    <SafeAreaView>
      <Modal 
        visible={menuVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setMenuVisible(!menuVisible);
        }} >

        <View style={{
          flex:1,
          justifyContent:'flex-end',
          alignItems: 'center',
        }}>

          <View style={styles.popup}>
          
            <FlatList 
              style={styles.item}
              keyExtractor={(item) => item.id} 
              data={menuData}
              renderItem={({item}) =>(
                <Text style={styles.title}>{item.icon}{'  '}{item.title}</Text>
              )}  
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
    </View>
  );
};

export default Create;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 50,
  },
  heading: {
    fontSize: 30,
    color: colors.blue,
    fontFamily: fonts.regular,
  },
  item:{
    padding: 10,
    marginVertical: 20, 
  },
  title:{
    fontSize: 30,
    color: colors.blue,
  },
  popup:{
    backgroundColor: 'white',
    padding: 20,
    width: '100%',
    height: '30%',
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
  }
});
