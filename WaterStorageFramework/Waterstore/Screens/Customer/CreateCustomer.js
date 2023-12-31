import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Alert,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

function CreateCustomer({ navigation }) {
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const date = new Date();
    const [color, setColor] = useState('');

    function createCustomer() {
        console.log(name, phone, address, date.toJSON(), date.toJSON());
        axios
            .post('https://waterstorage.somee.com/api/Customers', {
                name: name,
                phone: phone,
                address: address,
                createdAt: date.toJSON(),
                UpdatedAt: date.toJSON(),
            })
            .then(function (response) {
                Alert.alert("Thông báo", "Tạo khách hàng thành công");
                navigation.goBack();
            })
            .catch(function (error) {
                console.log(error);
                Alert.alert("Lỗi", "Không thể tạo khách hàng");
            });
    }

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
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    style={{ marginRight: 10 }}
                    onPress={() => {
                        createCustomer();
                    }}>
                    <Text style={{ color: 'white', fontSize: 20 }}>Tạo</Text>
                </TouchableOpacity>
            ),
        });
        getColor();
    });

    return (
        <View style={styles.container}>
            <View>
                <TextInput
                    style={styles.inputText}
                    label="Tên"
                    onChangeText={text => setName(text)}
                    mode='outlined'
                    outlineColor='#dce9ef'
                    activeOutlineColor={color}
                />
                <TextInput
                    style={styles.inputText}
                    label="Số điện thoại"
                    keyboardType="numeric"
                    onChangeText={text => setPhone(text)}
                    mode='outlined'
                    outlineColor='#dce9ef'
                    activeOutlineColor={color}
                />
                <TextInput
                    style={styles.inputText}
                    multiline={true}
                    label="Địa chỉ"
                    onChangeText={text => setAddress(text)}
                    mode='outlined'
                    outlineColor='#dce9ef'
                    activeOutlineColor={color}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 5,
    },
    inputText: {
        elevation: 5,
        margin: 10,
        borderRadius: 10,
        backgroundColor: '#dce9ef',
        borderColor: '#096bff',
    },
});

export default CreateCustomer;
