import { React, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Icon, ActivityIndicator } from "react-native-paper";
import axios from "axios";
import { useIsFocused } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { formatPrice } from "../Home";

keyExtractor = ({ id }) => id;

function Customer({ navigation }) {
    const [customers, setCustomers] = useState([]);
    const [isloading, setIsloading] = useState(true);
    const isFocused = useIsFocused();

    const Stack = createNativeStackNavigator();


    function getCustomers() {
        axios.get('https://waterstorage.somee.com/api/Customers')
            .then(function (response) {
                setCustomers(response.data.$values);
                setIsloading(false);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const renderCustomers = ({ item }) => {
        const { name, address,totalSpent } = item;
        return (
            <TouchableOpacity style={styles.ViewButton} onPress={() => { navigation.navigate('EditCustomerScreen', { id:item.id }) }}>
                <View style={[styles.NavigateButton, { flexDirection: "column" }]}>
                    <Text style={styles.text}>{name}</Text>
                    <Text style={styles.text}>Chi tiêu: {formatPrice(totalSpent)}</Text>
                </View>
                <Icon source={"chevron-right"} color="#096bff" size={35} />
            </TouchableOpacity>
        );
    }

    useEffect(() => {
        if (isFocused)
            getCustomers();
    }, [isFocused]);
    if (isloading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#096bff" />
                <Text>Loading...</Text>
            </View>
        )
    } else {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={[styles.ViewButton, { borderStyle: 'dashed' }]} onPress={() => {navigation.navigate('CreateCustomerScreen')}} >
                    <View style={[styles.NavigateButton, { alignItems: 'center', }]}>
                        <Icon source={"plus"} color="black" size={35} />
                        <Text style={styles.text}>Thêm khách hàng</Text>
                    </View>
                </TouchableOpacity>
                <FlatList
                    data={customers}
                    renderItem={renderCustomers}
                    keyExtractor={keyExtractor}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
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

export default Customer;