import { Text, View, StyleSheet, SafeAreaView, Modal, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import {useState} from "react";
import { colors, fonts } from "../constants/constants";
import {Ionicons} from '@expo/vector-icons';

//icons for menu
const habit = <Ionicons name='repeat-outline' color={colors.blue} size={25}/>
const task = <Ionicons name='checkmark-circle-outline' color={colors.blue} size={25}/>
const document = <Ionicons name='document-outline' color={colors.blue} size={25}/>

//menu items
const menuData = [
  {id:'1', title:'Habit', icon:habit, page:'NewHabit'},
  {id:'2', title:'Task', icon:task, page:'NewTask'},
  {id:'3', title:'Document', icon:document, page:'NewDocument'}
]

const Create: React.FC<{navigation:any}> = ({navigation}) => {
  //set state of modal popup. set to true while i figure out how to connect it to button in app navigator
  const [menuVisible, setMenuVisible] = useState(true);

  const seperator = () => {
    return(
      <View style={styles.seperator} />
    )
  }

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
        }}>

          <View style={styles.popup}>
            
            <View>
              <FlatList 
                style={styles.item}
                keyExtractor={(item) => item.id} 
                data={menuData}
                renderItem={({item}) =>(
                  <TouchableOpacity
                  onPress={() =>  navigation.navigate(`${item.page}`)}
                  >
                    <Text style={styles.title}>{item.icon}{'  '}{item.title}</Text> 
                  </TouchableOpacity>
                  
                )}  
                ItemSeparatorComponent={seperator}
              />
            </View>
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
    marginVertical: 10,   
  },
  title:{
    fontSize: 26,
    color: colors.blue,
    fontFamily: fonts.regular,
  },
  popup:{
    backgroundColor: 'white',
    padding: 10,
    width: '100%',
    height: '33%',
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
  },
  seperator:{
    height:2,
    backgroundColor: '#f2f2f2', 
    marginVertical: 10,
  },
});
