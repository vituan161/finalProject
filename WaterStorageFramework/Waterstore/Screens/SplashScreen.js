import { React, useEffect, useState } from 'react';
import { View, Image } from 'react-native';
import { SharedElement } from 'react-navigation-shared-element';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

function SplashScreen({ navigation }) {
    const [color, setColor] = useState('');

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
        if(color === ''){
            setColor('#096bff');
        }
        setTimeout(() => {
            navigation.navigate('LoginScreen');
        }, 500);
    }, []);
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: color }}>
            <SharedElement id="logo">
                <Image style={{ width: 200, height: 200 }} source={require('../imageContainer/biwase-v2-new.png')} />
            </SharedElement>
        </View>
    );
}

SplashScreen.sharedElements = () => ['logo'];

export default SplashScreen;