import {Text, View, StyleSheet} from 'react-native'
import React from 'react'

const Habits = () =>{
    return(
        <View style={styles.container}>
            <Text style={styles.heading}>Habits</Text>
        </View>
    )
}

export default Habits

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