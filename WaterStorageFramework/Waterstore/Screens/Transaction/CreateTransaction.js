import { React, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
    Alert,
} from 'react-native';
import {
    TextInput,
    Modal,
    Portal,
    PaperProvider,
    Button,
} from 'react-native-paper';
import axios from 'axios';
import { Dropdown } from 'react-native-element-dropdown';
import { useIsFocused } from '@react-navigation/native';
import { formatPrice } from '../Home';

function CreateTransaction({ navigation }) {
    const [customers, setCustomers] = useState([]);
    const [customer, setCustomer] = useState([]);
    const [idCode, setIdCode] = useState('BW00000');
    const [status, setStatus] = useState('');
    const [discount, setDiscount] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [trade, setTrade] = useState([]);
    const [productPost, setProductPost] = useState([]);
    const [products, setProducts] = useState([]);
    const [isloading, setIsloading] = useState(true);
    const [isloadingdata, setIsloadingdata] = useState(true);
    const date = new Date();
    const [tempNumber, setTempNumber] = useState([]);

    const isFocused = useIsFocused();

    function createTransaction() {
        console.log(idCode, status.value, discount, totalPrice, trade.value, customer, productPost)
        axios
            .post('https://waterstorage.somee.com/api/Transactions', {
                idCode: idCode,
                status: status.value,
                discount: discount,
                totalPrice: totalPrice,
                trade: trade.value,
                createAt: date.toJSON(),
                customer: customer,
                products: productPost,
            })
            .then(function (response) {
                console.log(response);
                Alert.alert('Thông báo', 'Tạo giao dịch thành công');
                navigation.goBack();
            })
            .catch(function (error) {
                console.log(error);
                Alert.alert('Lỗi', 'Không thể tạo giao dịch\nLỗi ' + error);
            });
    }

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

    function getCustomer() {
        axios
            .get('https://waterstorage.somee.com/api/Customers')
            .then(function (response) {
                setCustomers(response.data.$values);
                setIsloading(false);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const statusItems = [
        { label: 'Đã hoàn thành', value: 'completed' },
        { label: 'Chưa hoàn thành', value: 'uncompleted' },
    ];

    const tradeItems = [
        { label: 'Nhập', value: 0 },
        { label: 'Xuất', value: 1 },
    ];

    const [visible, setVisible] = useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    style={{ marginRight: 10 }}
                    onPress={() => {
                        createTransaction();
                    }}>
                    <Text style={{ color: 'white', fontSize: 20 }}>Tạo</Text>
                </TouchableOpacity>
            ),
        });
    });

    useEffect(() => {
        if (products) setTempNumber(new Array(products.length).fill(0));
    }, [products]);

    useEffect(() => {
        const fetchData = async () => {
            setIsloadingdata(true);
            if (tempNumber) {
                const newProductPost = [];
                let newtotalPrice = 0;
                products.forEach((item, index) => {
                    if (tempNumber[index] > 0) {
                        newProductPost.push(products[index]);
                        newtotalPrice += products[index].price * tempNumber[index];
                    }
                });
                setProductPost(newProductPost);
                setTotalPrice(newtotalPrice);
                setIsloadingdata(false);
            } else {
                setProductPost([]);
            }
        }
        fetchData();
    }, [tempNumber]);

    renderItem = ({ item, index }) => {
        const { amount, imageURL, name, price } = item;
        return (
            <View style={styles.itemContainer}>
                <View style={styles.ViewButton}>
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
                    </View>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            marginVertical: 15,
                        }}>
                        <Button
                            style={styles.amountButton}
                            onPress={() => {
                                if (tempNumber[index] > 0) {
                                    const newTempNumber = [...tempNumber];
                                    newTempNumber[index] = tempNumber[index] - 1;
                                    setTempNumber(newTempNumber);
                                }
                            }}>
                            -
                        </Button>
                        <Button style={styles.amountButton}>{tempNumber[index]}</Button>
                        <Button
                            style={styles.amountButton}
                            onPress={() => {
                                const newTempNumber = [...tempNumber];
                                newTempNumber[index] = tempNumber[index] + 1;
                                setTempNumber(newTempNumber);
                            }}>
                            +
                        </Button>
                    </View>
                    <Text>
                        {' '}
                        {formatPrice(item.price * tempNumber[index])}{' '}
                        <Text style={{ textDecorationLine: 'underline' }}>đ</Text>
                    </Text>
                </View>
            </View>
        );
    };

    useEffect(() => {
        if (isFocused) {
            getCustomer();
            getProducts();
        }
    }, [isFocused]);

    return (
        <View style={styles.container}>
            <PaperProvider>
                <View style={{ flex: 1 }}>
                    <TextInput
                        style={styles.inputText}
                        label="ID"
                        value={idCode}
                        onChangeText={text => setIdCode(text)}
                        mode="outlined"
                        outlineColor="#dce9ef"
                        activeOutlineColor="#096bff"
                    />
                    <Dropdown
                        style={styles.dropdown}
                        data={statusItems}
                        value={status}
                        labelField="label"
                        valueField="value"
                        placeholder="Chọn tình trạng"
                        onChange={value => setStatus(value)}
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
                        value='0'
                        onChangeText={text => setDiscount(text)}
                        mode="outlined"
                        outlineColor="#dce9ef"
                        activeOutlineColor="#096bff"
                    />
                    <Dropdown
                        style={styles.dropdown}
                        data={customers}
                        labelField="name"
                        valueField="id"
                        value={customer}
                        placeholder="Chọn khách hàng"
                        onChange={value => setCustomer(value)}
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
                        placeholder="Chọn loại giao dịch"
                        onChange={value => setTrade(value)}
                        containerStyle={{ backgroundColor: '#dce9ef' }}
                        itemContainerStyle={{
                            backgroundColor: 'white',
                            margin: 10,
                            elevation: 5,
                        }}
                    />
                    <TouchableOpacity style={styles.button} onPress={showModal}>
                        <Text style={styles.text}>Thêm sản phẩm</Text>
                    </TouchableOpacity>
                    <Portal>
                        <Modal
                            visible={visible}
                            onDismiss={hideModal}
                            contentContainerStyle={styles.modalContainer}>
                            <FlatList
                                data={products}
                                renderItem={renderItem}
                                keyExtractor={item => item.id}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                style={{ width: '100%' }}
                            />
                        </Modal>
                    </Portal>
                    <FlatList
                        data={productPost}
                        renderItem={({item}) => {
                            const index = products.findIndex(products => products.id === item.id);
                            if (!isloadingdata) {
                                return (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            width: '90%',
                                            marginVertical: 10,
                                        }}>
                                        <Text>{item.name}</Text>
                                        <Text>x{tempNumber[index]}</Text>
                                        <Text>
                                            {formatPrice(item.price * tempNumber[index])}{' '}
                                            <Text style={{ textDecorationLine: 'underline' }}>đ</Text>
                                        </Text>
                                    </View>
                                );
                            };
                        }}
                        keyExtractor={item => item.$id}
                        showsVerticalScrollIndicator={true}
                        contentContainerStyle={{
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        style={{ width: '100%' }}
                    />
                    <View>
                        <Button>
                            <Text style={[styles.text, { color: 'red', fontSize:20 }]}>
                                Tổng số tiền: {formatPrice(totalPrice ? totalPrice : 0)}{' '}
                                <Text style={{ textDecorationLine: 'underline' }}>đ</Text>
                            </Text>
                        </Button>
                    </View>
                </View>
            </PaperProvider>
        </View>
    );
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
    modalContainer: {
        backgroundColor: 'white',
        width: '85%',
        alignSelf: 'center',
        marginTop: 10,
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
    amountButton: {
        borderWidth: 1,
        borderColor: '#096bff',
        borderRadius: 0,
    },
});

export default CreateTransaction;
