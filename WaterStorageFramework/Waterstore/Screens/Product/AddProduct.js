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

function AddProduct({ navigation}) {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState(0);
    const [price, setPrice] = useState(0);
    const [imageURL, setImageURL] = useState('');
    const date = new Date();
    const [color, setColor] = useState('');

    function createProduct() {
        console.log(name, amount, price, imageURL, date.toJSON());
        axios
            .post('https://waterstorage.somee.com/api/Products', {
                name: name,
                amount: amount,
                price: price,
                imageURL: imageURL,
                createdAt: date.toJSON(),
            })
            .then(function (response) {
                Alert.alert("Thông báo", "Tạo hàng hóa thành công");
                navigation.goBack();
            })
            .catch(function (error) {
                console.log(error);
                Alert.alert("Lỗi", "Không thể tạo hàng hóa");
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
                        createProduct();
                    }}>
                    <Text style={{ color: 'white', fontSize: 20 }}>Thêm</Text>
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
                    label="Số lượng"
                    keyboardType="numeric"
                    onChangeText={text => setAmount(text)}
                    mode='outlined'
                    outlineColor='#dce9ef'
                    activeOutlineColor='#096bff'
                />
                <TextInput
                    style={styles.inputText}
                    multiline={true}
                    label="Giá"
                    keyboardType="numeric"
                    onChangeText={text => setPrice(text)}
                    mode='outlined'
                    outlineColor='#dce9ef'
                    activeOutlineColor='#096bff'
                />
                <TextInput
                    style={styles.inputText}
                    multiline={true}
                    label="Link hình ảnh"
                    onChangeText={text => setImageURL(text)}
                    mode='outlined'
                    outlineColor='#dce9ef'
                    activeOutlineColor='#096bff'
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

export default AddProduct;
