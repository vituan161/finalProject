import { React, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Icon, ActivityIndicator } from 'react-native-paper';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { formatPrice } from '../Home';
import AsyncStorage from '@react-native-async-storage/async-storage';

keyExtractor = ({ $id }) => $id;

function Transaction({ navigation }) {
    const [transactions, setTransactions] = useState([]);
    const [isloading, setIsloading] = useState(true);
    const isFocused = useIsFocused();
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

    function getTransactions() {
        axios
            .get('https://waterstorage.somee.com/api/Transactions')
            .then(function (response) {
                let transactions = response.data.$values.filter(
                    item => !item.hasOwnProperty('$ref'),
                );
                setTransactions(transactions);
                setIsloading(false);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const renderTransactions = ({ item }) => {
        const { idCode, status, totalPrice, customer } = item;
        return (
            <TouchableOpacity
                style={[styles.ViewButton, {borderColor: color}]}
                onPress={() => {
                    navigation.navigate('TransactionDetailScreen', { id: item.id });
                }}>
                <View style={[styles.NavigateButton, { flexDirection: 'column' }]}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.text}>ID: {idCode}</Text>
                        <Text style={styles.text}>
                            Tên: {item.customer ? item.customer.name : 'không có'}
                        </Text>
                    </View>
                    <Text style={styles.text}>
                        Tình trạng:{' '}
                        <Text
                            style={[
                                styles.text,
                                { color: status == 'completed' ? 'green' : 'orange' },
                            ]}>
                            {status == 'completed' ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
                        </Text>
                    </Text>
                    <Text style={styles.text}>Chi tiêu: {formatPrice(totalPrice)} đ</Text>
                </View>
                <Icon source={'chevron-right'} color={color} size={35} />
            </TouchableOpacity>
        );
    };

    useEffect(() => {
        if (isFocused) {
            getTransactions();
            getColor();
        }
    }, [isFocused]);

    if (isloading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={color} />
                <Text>Loading...</Text>
            </View>
        );
    } else
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={[styles.ViewButton, { borderStyle: 'dashed', borderColor: color }]}
                    onPress={() => {
                        navigation.navigate('CreateTransactionScreen');
                    }}>
                    <View style={[styles.NavigateButton, { alignItems: 'center' }]}>
                        <Icon source={'plus'} color={color} size={35} />
                        <Text style={styles.text}>Thêm giao dịch</Text>
                    </View>
                </TouchableOpacity>
                <FlatList
                    data={transactions}
                    renderItem={renderTransactions}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    text: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    ViewButton: {
        marginVertical: 10,
        paddingHorizontal: 10,
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

export default Transaction;
