import { React, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

function Setting({ navigation }) {
    const clearAll = async () => {
        try {
            await AsyncStorage.clear();
        } catch (e) {
            // clear error
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('EditAccountScreen') }}>
                <Text style={styles.text}>Account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={async () => {
                clearAll();
                navigation.navigate('LoginScreen');
            }}>
                <Text style={styles.text}>Log Out</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: 'flex-start',
    },
    button: {
        width: "70%",
        alignItems: "center",
        backgroundColor: "#096bff",
        borderRadius: 5,
        padding: 10,
        margin: 10,
    },
    text: {
        color: "white",
        fontSize: 20,
        fontWeight: 'bold',
    }
});

export default Setting;