import { React, useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, Image } from "react-native";
import { TextInput, Button } from "react-native-paper";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SharedElement } from 'react-navigation-shared-element';
import LinearGradient from "react-native-linear-gradient";

function Login({ navigation }) {
    const [username, setUsername] = useState("tuan");
    const [password, setPassword] = useState("tuan");
    const [hidePass, setHidePass] = useState(true);
    const [userdata, setUserdata] = useState([]);

    function authentication() {
        let state = false;
        if (Array.isArray(userdata)) {
            userdata.forEach(element => {
                if (element.name === username && element.password === password) {
                    storeUserData(element);
                    storeauser(JSON.stringify(element));
                    state = true;
                    navigation.navigate('HomeScreen');
                }
            });
        }
        if (!state) {
            Alert.alert("Thông báo", "Tài khoản hoặc mật khẩu không đúng! Hoặc mạng yếu");
        }
    }

    const storeauser = async (value) => {
        try {
            await AsyncStorage.setItem('user', value);
        } catch (e) {
            // saving error
        }
    };

    const storeUserData = async (value) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem('UserData', jsonValue);
        } catch (e) {
            // saving error
        }
    };

    useEffect(() => {
        axios.get('https://waterstorage.somee.com/api/Users')
            .then(function (response) {
                setUserdata(response.data.$values);
            })
            .catch(function (error) {
                console.log(error);
            });
    });

    return (
        <View
            style={{ backgroundColor: '#096bff', flex: 1, justifyContent: 'center' }}>
            <View style={styles.container}>
                <SharedElement id="logo">
                    <Image style={styles.image} source={require('../imageContainer/biwase-v2-new.png')} />
                </SharedElement>
                <TextInput
                    label={'Username'}
                    value={username}
                    onChangeText={text => setUsername(text)}
                    style={styles.textInput}
                    mode="outlined"
                    theme={{ colors: { primary: 'blue', underlineColor: 'transparent', background: 'transparent' } }}
                />
                <TextInput
                    label={'Password'}
                    value={password}
                    onChangeText={password => setPassword(password)}
                    style={styles.textInput}
                    mode="outlined"
                    secureTextEntry={hidePass ? true : false}
                    right={
                        <TextInput.Icon icon={hidePass ? "eye-off-outline" : "eye-outline"} onPress={() => setHidePass(!hidePass)} />
                    }
                />
                <LinearGradient colors={['#48b6e7', '#096bff']}>
                    <Button
                        mode="contained"
                        onPress={() => authentication()}
                        style={styles.button}>

                        <Text style={{ color: 'white', fontSize: 18 }}> Login </Text>
                    </Button>
                </LinearGradient>
            </View>
        </View>
    )
}

Login.sharedElements = () => ['logo'];

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 40,
    },
    image: {
        width: 200,
        height: 200,
        alignSelf: 'center',
        marginBottom: 20,
    },
    textInput: {
        marginBottom: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        borderColor: 'silver',
    },
    button: {
        height: 50,
        justifyContent: 'center',
        margin:0,
        backgroundColor: 'transparent',
    },
    gradient: {
        flex: 1,
        borderRadius: 10,
    },
});

export default Login;