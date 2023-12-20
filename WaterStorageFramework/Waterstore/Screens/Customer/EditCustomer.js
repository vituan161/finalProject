import { React, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { TextInput, Button, ActivityIndicator } from "react-native-paper";
import axios from "axios";
import { useIsFocused } from "@react-navigation/native";
import { formatDate } from "../Home";
import AsyncStorage from "@react-native-async-storage/async-storage";

function EditCustomer({ route, navigation }) {
    const [customer, setCustomer] = useState([]);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [totalSpent, setTotalSpent] = useState('');
    const [unclaimed, setUnclaimed] = useState('');
    const [isloading, setIsloading] = useState(true);
    const { id } = route.params;
    const isFocused = useIsFocused();
    const [color, setColor] = useState('');

    function getCustomer() {
        axios.get('https://waterstorage.somee.com/api/Customers/' + id)
            .then(function (response) {
                setCustomer(response.data);
                setName(response.data.name);
                setPhone(response.data.phone);
                setAddress(response.data.address);
                setTotalSpent(response.data.totalSpent);
                setUnclaimed(response.data.unclaimedB);
                setIsloading(false);
            })
            .catch(function (error) {
                console.log(error);
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

    function updateCustomer() {
        console.log(name, phone, address, totalSpent, unclaimed, new Date().toISOString());
        axios.put('https://waterstorage.somee.com/api/Customers/' + id, {
            id: id,
            name: name,
            phone: phone,
            address: address,
            totalSpent: totalSpent,
            unclaimedB: unclaimed,
            createdAt: customer.createdAt,
            updatedAt: new Date().toJSON(),
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

    function deleteCustomer() {
        axios.delete('https://waterstorage.somee.com/api/Customers/' + id)
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
            'Bạn có chắc là muốn xóa khách hàng này không? dữ liệu của khách hàng này sẽ bị xóa vĩnh viễn.',
            [
                {
                    text: 'Xóa',
                    onPress: () => deleteCustomer(),
                },
                {
                    text: 'Không xóa',
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
                        updateCustomer();
                    }}>
                    <Text style={{ color: 'white', fontSize: 20 }}>Lưu</Text>
                </TouchableOpacity>
            ),
        })
        getColor();
    });

    useEffect(() => {
        if (isFocused)
            getCustomer();
    }, [isFocused]);

    if (isloading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={color} />
                <Text>Loading...</Text>
            </View>
        )
    } else
        return (
            <View style={styles.container}>
                <View>
                    <TextInput
                        style={styles.inputText}
                        label="Tên"
                        value={name}
                        onChangeText={text => setName(text)}
                        mode='outlined'
                        outlineColor='#dce9ef'
                        activeOutlineColor={color}
                    />
                    <TextInput
                        style={styles.inputText}
                        label="Số điện thoại"
                        value={phone}
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
                        value={address}
                        onChangeText={text => setAddress(text)}
                        mode='outlined'
                        outlineColor='#dce9ef'
                        activeOutlineColor={color}
                    />
                    <TextInput
                        style={styles.inputText}
                        label="Tổng chi tiêu"
                        value={totalSpent.toString()}
                        keyboardType="numeric"
                        onChangeText={text => setTotalSpent(text)}
                        mode='outlined'
                        outlineColor='#dce9ef'
                        activeOutlineColor={color}
                    />
                    <TextInput
                        style={styles.inputText}
                        label="nợ bình"
                        value={unclaimed ? unclaimed.toString() : '0'}
                        keyboardType="numeric"
                        onChangeText={text => setUnclaimed(text)}
                        mode='outlined'
                        outlineColor='#dce9ef'
                        activeOutlineColor={color}
                    />
                    <TextInput
                        style={styles.inputText}
                        label="Ngày tạo"
                        value={customer && customer.createdAt ? formatDate(customer.createdAt).toString() : ''}
                        mode='outlined'
                        outlineColor='#dce9ef'
                        activeOutlineColor={color}
                        disabled={true}
                    />
                    <TextInput
                        style={styles.inputText}
                        label="Ngày cập nhật"
                        value={customer && customer.updatedAt ? formatDate(customer.updatedAt).toString() : ''}
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
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 5,
        color: 'white',
    },
    inputText: {
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

export default EditCustomer;