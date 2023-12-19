import { React, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Icon, ActivityIndicator } from 'react-native-paper';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { formatPrice } from '../Home';

keyExtractor = ({ $id }) => $id;

function Transaction({ navigation }) {
    const [transactions, setTransactions] = useState([]);
    const [isloading, setIsloading] = useState(true);
    const isFocused = useIsFocused();

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
                style={styles.ViewButton}
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
                                { color: status == 'completed' ? 'green' : 'yellow' },
                            ]}>
                            {status == 'completed' ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
                        </Text>
                    </Text>
                    <Text style={styles.text}>Chi tiêu: {formatPrice(totalPrice)} đ</Text>
                </View>
                <Icon source={'chevron-right'} color="#096bff" size={35} />
            </TouchableOpacity>
        );
    };

    useEffect(() => {
        if (isFocused) getTransactions();
    }, [isFocused]);

    if (isloading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#096bff" />
                <Text>Loading...</Text>
            </View>
        );
    } else
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={[styles.ViewButton, { borderStyle: 'dashed' }]}
                    onPress={() => {
                        navigation.navigate('CreateTransactionScreen');
                    }}>
                    <View style={[styles.NavigateButton, { alignItems: 'center' }]}>
                        <Icon source={'plus'} color="black" size={35} />
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

export default Transaction;
