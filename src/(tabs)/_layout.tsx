import {Text, View, StyleSheet} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import Habits from './Habits';
import Calendar from './Calendar';
import Create from './Create';
import Documents from './Documents';
import Profile from './Profile';

const Tab = createBottomTabNavigator();

const _layout = () =>{
    return(
        
        // just have option as blue, will change to brand colors later
        <Tab.Navigator initialRouteName='Calendar' screenOptions={{tabBarActiveTintColor: 'blue', tabBarInactiveBackgroundColor:'white'}}>
            <Tab.Screen name="Habits" component={Habits} />
            <Tab.Screen name="Calendar" component={Calendar} />
            <Tab.Screen name="Create" component={Create} />
            <Tab.Screen name="Documents" component={Documents} />
            <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    )
}

export default _layout

