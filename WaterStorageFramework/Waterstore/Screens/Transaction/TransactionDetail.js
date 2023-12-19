import { React, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
} from 'react-native';
import {
    ActivityIndicator,
    TextInput,
} from 'react-native-paper';
import axios from 'axios';
import { Dropdown } from 'react-native-element-dropdown';
import { useIsFocused } from '@react-navigation/native';
import { formatPrice } from '../Home';
import { formatDate } from '../Home';

function TransactionDetail({ route }) {
    const [transaction, setTransaction] = useState('');
    const [idCode, setIdCode] = useState('');
    const [status, setStatus] = useState('');
    const [discount, setDiscount] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [trade, setTrade] = useState([]);
    const [customer, setCustomer] = useState('');
    const [isloading, setIsloading] = useState(true);

    const isFocused = useIsFocused();

    const statusItems = [
        { label: 'Đã hoàn thành', value: 'completed' },
        { label: 'Chưa hoàn thành', value: 'uncompleted' },
    ];

    const tradeItems = [
        { label: 'Nhập', value: 0 },
        { label: 'Xuất', value: 1 },
    ];

    function getTransaction() {
        axios
            .get(`https://waterstorage.somee.com/api/Transactions/${route.params.id}`)
            .then(function (response) {
                setTransaction(response.data);
                setIdCode(response.data.idCode);
                setStatus(response.data.status);
                setDiscount(response.data.discount);
                setTotalPrice(response.data.totalPrice);
                setTrade(response.data.trade);
                setCustomer(response.data.customer);
                setIsloading(false);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const renderProducts = ({ item }) => {
        const {  imageURL, name, price } = item;
        return (
            <TouchableOpacity
                style={styles.ViewButton}
                >
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
                <View>

                </View>
            </TouchableOpacity>
        );
    };

    useEffect(() => {
        if (isFocused) {
            getTransaction();
        }
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
                <View style={{ flex: 1 }}>
                    <TextInput
                        style={styles.inputText}
                        label="ID"
                        value={idCode}
                        mode="outlined"
                        outlineColor="#dce9ef"
                        activeOutlineColor="#096bff"
                        disabled={true}
                    />
                    <Dropdown
                        style={styles.dropdown}
                        data={statusItems}
                        value={status}
                        labelField="label"
                        valueField="value"
                        disabled={true}
                        onChange={() => { }}
                        containerStyle={{ backgroundColor: '#dce9ef' }}
                        itemContainerStyle={{
                            backgroundColor: 'white',
                            margin: 10,
                            elevation: 5,
                        }}
                    />
                    <TextInput
                        style={styles.inputText}
                        label="Giảm giá"
                        value={discount.toString()}
                        mode="outlined"
                        outlineColor="#dce9ef"
                        activeOutlineColor="#096bff"
                        disabled={true}
                    />
                    <Dropdown
                        style={styles.dropdown}
                        data={[customer]}
                        labelField="name"
                        valueField="id"
                        value={customer}
                        onChange={() => { }}
                        containerStyle={{ backgroundColor: '#dce9ef' }}
                        itemContainerStyle={{
                            backgroundColor: 'white',
                            margin: 10,
                            elevation: 5,
                        }}
                    />
                    <Dropdown
                        style={styles.dropdown}
                        data={tradeItems}
                        value={trade}
                        labelField="label"
                        valueField="value"
                        onChange={() => { }}
                        containerStyle={{ backgroundColor: '#dce9ef' }}
                        itemContainerStyle={{
                            backgroundColor: 'white',
                            margin: 10,
                            elevation: 5,
                        }}
                    />
                    <TextInput
                        style={styles.inputText}
                        label="Tổng tiền"
                        value={totalPrice.toString()}
                        mode="outlined"
                        outlineColor="#dce9ef"
                        activeOutlineColor="#096bff"
                        disabled={true}
                    />
                    <TextInput
                        style={styles.inputText}
                        label="Thời gian tạo giao dịch"
                        value={formatDate(transaction.createdAt).toString()}
                        mode="outlined"
                        outlineColor="#dce9ef"
                        activeOutlineColor="#096bff"
                        disabled={true}
                    />
                    <FlatList
                        data={transaction.products.$values}
                        renderItem={renderProducts}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        style={{ width: '100%' }}
                    />
                </View>
            </View>
        )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
    },
    text: {
        fontSize: 15,
        margin: 5,
    },
    inputText: {
        margin: 10,
        borderRadius: 10,
        backgroundColor: '#dce9ef',
        borderColor: '#096bff',
    },
    dropdown: {
        elevation: 5,
        paddingHorizontal: 15,
        margin: 10,
        marginVertical: 15,
        height: 50,
        backgroundColor: '#dce9ef',
    },
    button: {
        elevation: 5,
        height: 50,
        marginHorizontal: 50,
        margin: 10,
        borderRadius: 10,
        backgroundColor: '#dce9ef',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ViewButton: {
        marginVertical: 10,
        paddingHorizontal: 10,
        borderColor: '#096bff',
        borderWidth: 2,
        borderRadius: 10,
        height: 90,
        width: '95%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemContainer: {
        paddingBottom: 10,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#096bff',
    },
});

export default TransactionDetail;