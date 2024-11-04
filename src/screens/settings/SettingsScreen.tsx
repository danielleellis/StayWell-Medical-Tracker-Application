import { Text, View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import { colors, fonts } from "../../constants/constants";

const settingsData = [
    {id:'2', title:'Account', page:'Account'},
    {id:'3', title:'Privacy', page:'Privacy'},
    {id:'4', title:'Notification', page:'Notification'},
    {id:'5', title:'Request Information', page:'RequestInfo'},
    {id:'6', title:'Deactivate', page:'Deactivate'}
]

const Settings: React.FC<{navigation:any}> = ({navigation}) => {
    return (
        <View style={styles.container}>
            <View style={styles.headingContainer}> 
                <Text style={styles.heading}>Settings</Text>
            </View>
            

            <TouchableOpacity
                onPress={() => navigation.navigate("Profile")}
                style={styles.backButton} >
                    <Text style={styles.backButtonText}>{"BACK"}</Text>
            </TouchableOpacity>

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
        backgroundColor: colors.white,
    },
    heading: {
        fontSize: 30,
        color: colors.blue,
        fontFamily: fonts.regular,
        padding: '5%',
      },
    headingContainer:{
        alignItems: 'center',
        paddingTop: '10%'
    },  
    item:{
        backgroundColor: colors.blue,
        padding: '6%',
        margin: '4%', 
        borderRadius: 20,
    },
    title:{
        fontSize: 20,
        color: colors.white,
        fontFamily: fonts.regular,
    },
    backButton: {
        position: "absolute",
        top: '2%',
        left: '5%',
        paddingTop: '8%'
      },
      backButtonText: {
        fontSize: 18,
        color: colors.blue,
        fontFamily: fonts.regular,
      },
});
