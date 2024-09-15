import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const FriendProfileScreen: React.FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const { friend } = route.params;

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>

            <Text style={styles.header}>Patient Profile</Text>
            <Image source={{ uri: friend.imageUrl }} style={styles.profileImage} />
            <Text style={styles.name}>{friend.name}</Text>
            <Text style={styles.detail}>Birthday: {friend.birthday}</Text>
            <Text style={styles.detail}>Phone Number: {friend.phone}</Text>
            <Text style={styles.detail}>Email Address: {friend.email}</Text>
            <Text style={styles.detail}>Pronouns: {friend.pronouns}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 8,
    },
    closeButtonText: {
        fontSize: 24,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginVertical: 20,
    },
    profileImage: {
        width: 140,
        height: 140,
        borderRadius: 70,
        marginVertical: 20,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    detail: {
        fontSize: 16,
        marginVertical: 5,
    },
});

export default FriendProfileScreen;
