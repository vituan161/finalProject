import { React, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
} from 'react-native';
import { Icon, ActivityIndicator } from 'react-native-paper';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { formatPrice } from '../Home';

keyExtractor = ({ id }) => id;

function Product({ navigation }) {
    const [Products, setProducts] = useState([]);
    const [isloading, setIsloading] = useState(true);
    const isFocused = useIsFocused();

    const Stack = createNativeStackNavigator();

    function getProducts() {
        axios
            .get('https://waterstorage.somee.com/api/Products')
            .then(function (response) {
                setProducts(response.data.$values);
                setIsloading(false);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const renderProducts = ({ item }) => {
        const { amount, imageURL, name, price } = item;
        return (
            <TouchableOpacity
                style={styles.ViewButton}
                onPress={() => {
                    navigation.navigate('EditProductScreen', { id: item.id });
                }}>
                <Image
                    style={{ width: 70, height: 70 }}
                    source={
                        imageURL
                            ? { uri: imageURL }
                            : require('../../imageContainer/water.jpg')
                    }
                />
                <View style={[styles.NavigateButton, { flexDirection: 'column' }]}>
                    <Text style={styles.text}>{name}</Text>
                    <Text style={styles.text}>Giá: {formatPrice(price)} đ</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.text}>x{amount}</Text>
                    <Icon source={'chevron-right'} color="#096bff" size={35} />
                </View>
            </TouchableOpacity>
        );
    };

    useEffect(() => {
        if (isFocused) getProducts();
    }, [isFocused]);
    if (isloading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#096bff" />
                <Text>Loading...</Text>
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={[styles.ViewButton, { borderStyle: 'dashed' }]}
                    onPress={() => {
                        navigation.navigate('AddProductScreen');
                    }}>
                    <View style={[styles.NavigateButton, { alignItems: 'center' }]}>
                        <Icon source={'plus'} color="black" size={35} />
                        <Text style={styles.text}>Thêm hàng hóa</Text>
                    </View>
                </TouchableOpacity>
                <FlatList
                    data={Products}
                    renderItem={renderProducts}
                    keyExtractor={keyExtractor}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    style={{ width: '100%' }}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    text: {
        color: 'black',
        fontSize: 17,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    ViewButton: {
        marginVertical: 10,
        paddingHorizontal: 10,
        borderColor: '#096bff',
        borderWidth: 2,
        borderRadius: 10,
        height: 90,
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    NavigateButton: {
        flexDirection: 'row',
    },
});

export default Product;
