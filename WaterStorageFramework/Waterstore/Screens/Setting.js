import { React, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Setting({ navigation }) {
    const [color, setColor] = useState('white');
    const clearAll = async () => {
        try {
            await AsyncStorage.clear();
        } catch (e) {
            // clear error
        }
    };

    const getColor = async () => {
        try {
            const value = await AsyncStorage.getItem('color');
            if (value !== null) {
                setColor(value);
            }
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getColor();
    }, []);

    return (
        <View style={styles.container}>
            <TouchableOpacity style={[styles.button,{backgroundColor:color}]} onPress={() => { navigation.navigate('EditAccountScreen') }}>
                <Text style={styles.text}>Account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button,{backgroundColor:color}]} onPress={async () => {
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