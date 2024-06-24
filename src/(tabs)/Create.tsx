import {Text, View, StyleSheet} from 'react-native'
import React from 'react'

const Create = () =>{
    return(
        <View style={styles.container}>
            <Text style={styles.heading}>Create</Text>
        </View>
    )
}

export default Create

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    heading:{
        fontSize:25,
        color: 'blue'
    }
})