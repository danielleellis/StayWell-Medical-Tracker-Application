import {Text, View, StyleSheet} from 'react-native'
import React from 'react'

const Documents = () =>{
    return(
        <View style={styles.container}>
            <Text style={styles.heading}>Documents</Text>
        </View>
    )
}

export default Documents

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    heading:{
        fontSize:25,
        color: '#45a6ff'
    }
})