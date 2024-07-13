import { Text, View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import { colors, fonts } from "../constants/constants";

const settingsData = [
    {id:'1', title:'Profile', page:'Profile'},
    {id:'2', title:'Account', page:'Account'},
    {id:'3', title:'Privacy', page:'Privacy'},
    {id:'4', title:'Notification', page:'Notification'},
    {id:'5', title:'RequestInfo', page:'RequestInfo'},
    {id:'6', title:'Deactivate', page:'Deactivate'}
]

const Settings: React.FC<{navigation:any}> = ({navigation}) => {
    return (
        <View style={styles.container}>
            {/* <Text style={styles.heading}>S T A Y W E L L</Text> */}
                <FlatList
                    data={settingsData}
                    keyExtractor={item => item.id}
                    renderItem={({item}) =>(
                        <View style={styles.item}>
                            <TouchableOpacity onPress={() =>  navigation.navigate(`${item.page}`)}>
                                <Text style={styles.title}>{item.title}</Text> 
                            </TouchableOpacity>
                        </View>)}     
                />
        </View>
    );
};

export default Settings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",  
    },
    heading: {
        fontSize: 30,
        color: colors.blue,
        fontFamily: fonts.regular,
    },
    item:{
        backgroundColor: 'white',
        padding: 26,
        margin: 12, 
        borderRadius: 20,
    },
    title:{
        fontSize: 20,
        color: colors.black,
        fontFamily: fonts.regular,
      },
});
