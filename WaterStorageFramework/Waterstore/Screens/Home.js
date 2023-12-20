import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, StyleSheet, Alert, Image, TouchableOpacity } from "react-native";
import { Icon, ActivityIndicator, Drawer } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import Transaction from "./Transaction/Transaction";



function Home({ navigation, setColorTrigger }) {
    const [detail, setDetail] = useState('');
    const [enter, setEnter] = useState(0);
    const [exit, setExit] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [isloading, setIsloading] = useState(true);
    const date = new Date();

    const [color, setColor] = useState('');

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const isFocused = useIsFocused();

    const storeColor = async (color) => {
        try {
            await AsyncStorage.setItem('color', color);
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

    useEffect(() => {
        storeColor(color);
    }, [color]);

    useEffect(() => {
        const task = () => {
            getTransactions();
            getSimplisticatedTransactions();
        }
        task();
    });



    useEffect(() => {
        if (color === '')
            setColor('#096bff')
        getdetail().then((data) => {
            setDetail(data);
            //AsyncStorage.clear();
        });
    }, []);


    const getSimplisticatedTransactions = () => {
        const month = date.getMonth();
        let filteredtransactions = transactions.filter(Transaction => {
            const transactionDate = new Date(Transaction.createdAt);
            return transactionDate.getMonth() === month
        });
        let enterCount = 0;
        let exitCount = 0;
        filteredtransactions.forEach((item) => {
            if (item.trade == 0) {
                enterCount++;
            } else {
                exitCount++;
            }
        });

        setEnter(enterCount);
        setExit(exitCount);
    }

    const getdetail = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('user')
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            console.log(e);
        }
    }

    setTimeout(() => {
        setIsloading(false);
    }, 500);

    if (isloading) {
        return (
            <View style={{ paddingTop: 150, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={90} color={color} />
                <Text>Loading...</Text>
            </View>
        );
    } else
        return (
            <View style={{ flex: 1, backgroundColor: color, }}>
                {isDrawerOpen && (
                    <View style={[styles.drawer, { alignItems: 'center' }]}>
                        <Drawer.Section title="Đổi Màu">
                            <Drawer.CollapsedItem
                                style={[styles.drawerItem, { backgroundColor: 'red' }]}
                                onPress={() => { setColor('red'); setColorTrigger('red') }}
                            />
                            <Drawer.CollapsedItem
                                style={{ backgroundColor: '#096bff' }}
                                onPress={() => { setColor('#096bff'); setColorTrigger('#096bff') }}
                            />
                            <Drawer.CollapsedItem
                                style={{ backgroundColor: 'black' }}
                                onPress={() => { setColor('black');setColorTrigger('black') }}
                            />
                        </Drawer.Section>
                        <TouchableOpacity onPress={() => { setIsDrawerOpen(false) }}>
                            <Icon source={"close"} color="black" size={35} />
                        </TouchableOpacity>
                    </View>
                )}
                <View style={styles.topBar}>
                    <TouchableOpacity onPress={() => { setIsDrawerOpen(true) }}>
                        <Icon source={"format-list-bulleted"} color="white" size={35} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { navigation.navigate('SettingScreen') }}>
                        <Icon source={"cog-outline"} color="white" size={35} />
                    </TouchableOpacity>
                </View>
                <View style={styles.topcontainer}>
                    <Image
                        style={styles.image}
                        source={{ uri: detail.imageUrl ? detail.imageUrl : 'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg' }}
                    />
                    <Text style={styles.textTitle}>Xin chào {detail.name}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: "space-evenly", alignItems: 'center' }}>
                        <Text style={[styles.whiteText, { fontSize: 18 }]}>Tháng {date.getMonth() + 1}  </Text>
                        <View style={styles.button}>
                            <Text style={styles.whiteText}>Xuất</Text>
                            <Icon source={"package-up"} color="white" size={30} />
                            <Text style={styles.whiteText}>: {exit}</Text>
                        </View>
                        <View style={styles.button}>
                            <Text style={styles.whiteText}>Nhập</Text>
                            <Icon source={"package-down"} color="white" size={30} />
                            <Text style={styles.whiteText}>: {enter}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.bottomcontainer}>
                    <TouchableOpacity style={[styles.ViewButton, { borderColor: color }]} onPress={() => { navigation.navigate('CustomerScreen') }}>
                        <View style={styles.NavigateButton}>
                            <Icon source={"account-circle"} color="#096bff" size={35} />
                            <Text style={styles.text}>Khách hàng</Text>
                        </View>
                        <Icon source={"chevron-right"} color="#096bff" size={35} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.ViewButton, { borderColor: color }]} onPress={() => { navigation.navigate('ProductScreen') }}>
                        <View style={styles.NavigateButton} >
                            <Icon source={"package"} color="#FFCB00" size={35} />
                            <Text style={styles.text}>Sản Phẩm</Text>
                        </View>
                        <Icon source={"chevron-right"} color="#FFCB00" size={35} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.ViewButton, { borderColor: color }]} onPress={() => { navigation.navigate('TransactionScreen') }}>
                        <View style={styles.NavigateButton}>
                            <Icon source={"cash-multiple"} color="#54da62" size={35} />
                            <Text style={styles.text}>Giao dịch</Text>
                        </View>
                        <Icon source={"chevron-right"} color="#54da62" size={35} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.ViewButton, { borderColor: color }]} onPress={() => { navigation.navigate('StatisticScreen') }}>
                        <View style={styles.NavigateButton}>
                            <Icon source={"chart-bar"} color="#3dcf3d" size={35} />
                            <Text style={styles.text}>Thống kê</Text>
                        </View>
                        <Icon source={"chevron-right"} color="#3dcf3d" size={35} />
                    </TouchableOpacity>
                </View>
            </View>
        );
}

const styles = StyleSheet.create({
    drawer: {
        zIndex: 9999999,
        elevation: 2,
        position: 'absolute',
        backgroundColor: 'white',
        borderBlockEndColor: 'black',
        borderWidth: 1,
        height: '100%',
    },
    drawerItem: {
        height: 50,
        width: 50,
    },
    topBar: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    topcontainer: {
        alignItems: 'center',
        paddingBottom: 20,
    },
    bottomcontainer: {
        elevation: 2,
        flex: 1,
        backgroundColor: '#f6f6f6',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'space-around',
        borderTopLeftRadius: 20,
        borderTopEndRadius: 20,

    },
    whiteText: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
    },
    text: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    image: {
        width: 150,
        height: 150,
        alignSelf: 'center',
        borderRadius: 100,
    },
    textTitle: {
        color: '#f6f6f6',
        fontSize: 20,
        fontWeight: 'bold',
        margin: 14,
    },
    button: {
        margin: 8,
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    ViewButton: {
        paddingHorizontal: 10,
        borderWidth: 2,
        borderRadius: 10,
        height: "18%",
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    NavigateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});

export function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}
export function formatPrice(price) {
    let formattedPrice = parseInt(price);
    if (price > 1000000000) {
        formattedPrice = (price / 1000000000).toFixed(2).toLocaleString('de-DE') + 'B';
    } else {
        formattedPrice = price.toLocaleString('de-DE');
    }
    return formattedPrice;
}

export default Home;