import { React, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet, Image } from "react-native";
import { TextInput, Button, ActivityIndicator } from "react-native-paper";
import axios from "axios";
import { useIsFocused } from "@react-navigation/native";
import { formatDate } from "../Home";
import { formatPrice } from "../Home";

function EditProduct({ route, navigation }) {
    const [product, setProduct] = useState([]);
    const [name, setName] = useState('');
    const [amount, setAmount] = useState(0);
    const [price, setPrice] = useState(0);
    const [imageURL, setImageURL] = useState('');
    const [isloading, setIsloading] = useState(true);
    const { id } = route.params;
    const isFocused = useIsFocused();

    function getProduct() {
        axios.get('https://waterstorage.somee.com/api/Products/' + id)
            .then(function (response) {
                setProduct(response.data);
                setName(response.data.name);
                setAmount(response.data.amount);
                setPrice(response.data.price);
                setImageURL(response.data.imageURL);
                setIsloading(false);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function updateProduct() {
        console.log(name, amount, price, imageURL, new Date().toISOString());
        axios.put('https://waterstorage.somee.com/api/Products/' + id, {
            id: id,
            name: name,
            amount: amount,
            price: price,
            imageURL: imageURL,
            createdAt: product.createdAt,
        })
            .then(function (response) {
                Alert.alert("Thông báo", "Cập nhật thành công");
                navigation.goBack();
            })
            .catch(function (error) {
                console.log(error);
                Alert.alert("Lỗi", "Không thể cập nhật");
            });
    }

    function deleteProduct() {
        axios.delete('https://waterstorage.somee.com/api/Products/' + id)
            .then(function (response) {
                Alert.alert("Thông báo", "Xóa thành công");
                navigation.goBack();
            })
            .catch(function (error) {
                console.log(error);
                Alert.alert("Lỗi", "Không thể xóa");
            });
    }

    function AlertDelete() {
        Alert.alert(
            'Warning',
            'Are you sure you want to remove this product? This operation cannot be undone.',
            [
                {
                    text: 'DELETE',
                    onPress: () => deleteProduct(),
                },
                {
                    text: 'CANCEL',
                    onPress: () => console.log('Cancel Pressed'),
                },
            ],
        );
    }

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    style={{ marginRight: 10 }}
                    onPress={() => {
                        updateProduct();
                    }}>
                    <Text style={{ color: 'white', fontSize: 20 }}>Lưu</Text>
                </TouchableOpacity>
            ),
        })
    });

    useEffect(() => {
        if (isFocused)
            getProduct();
    }, [isFocused]);

    if (isloading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#096bff" />
                <Text>Loading...</Text>
            </View>
        )
    } else
        return (
            <View style={styles.container}>
                <View style={{alignItems:'center'}}>
                    <Image style={{ width: 200, height: 200 }} source={imageURL ? { uri: imageURL } : require('../../imageContainer/water.jpg')} />
                    <TextInput
                        style={styles.inputText}
                        label="Tên"
                        value={name}
                        onChangeText={text => setName(text)}
                        mode='outlined'
                        outlineColor='#dce9ef'
                        activeOutlineColor='#096bff'
                    />
                    <TextInput
                        style={styles.inputText}
                        label="Số lượng"
                        value={amount.toString()}
                        keyboardType="numeric"
                        onChangeText={text => setAmount(text)}
                        mode='outlined'
                        outlineColor='#dce9ef'
                        activeOutlineColor='#096bff'
                    />
                    <TextInput
                        style={styles.inputText}
                        label="Giá"
                        value={price.toString()}
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
                        value={imageURL}
                        keyboardType="numeric"
                        onChangeText={text => setImageURL(text)}
                        mode='outlined'
                        outlineColor='#dce9ef'
                        activeOutlineColor='#096bff'
                    />
                    <TextInput
                        style={styles.inputText}
                        label="Ngày tạo"
                        value={product && product.createdAt ? formatDate(product.createdAt).toString() : ''}
                        mode='outlined'
                        outlineColor='#dce9ef'
                        activeOutlineColor='#096bff'
                        disabled={true}
                    />
                    <TouchableOpacity style={styles.button} onPress={() => { AlertDelete() }}>
                        <Text>
                            <Text style={styles.text}>Delete</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 10,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 5,
        color: 'white',
    },
    inputText: {
        width:'90%',
        elevation: 5,
        margin: 10,
        borderRadius: 10,
        backgroundColor: '#dce9ef',
        borderColor: '#096bff',
    },
    button: {
        margin: 10,
        padding: 10,
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: 'red',
    },
});

export default EditProduct;