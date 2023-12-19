import { React, useEffect } from 'react';
import { View, Image } from 'react-native';
import { SharedElement } from 'react-navigation-shared-element';

function SplashScreen({ navigation }) {
    useEffect(() => {
        setTimeout(() => {
            navigation.navigate('LoginScreen');
        }, 500);
    }, []);
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#096bff' }}>
            <SharedElement id="logo">
                <Image style={{ width: 200, height: 200 }} source={require('../imageContainer/biwase-v2-new.png')} />
            </SharedElement>
        </View>
    );
}

SplashScreen.sharedElements = () => ['logo'];

export default SplashScreen;