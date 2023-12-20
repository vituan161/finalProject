import { React, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BarChart, Grid, YAxis, XAxis } from 'react-native-svg-charts';
import axios from 'axios';
import { Button, Icon, DataTable } from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import { formatPrice } from '../Home';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Statistic({ navigation }) {
    const [transactions, setTransactions] = useState([]);
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [openFrom, setOpenFrom] = useState(false);
    const [openTo, setOpenTo] = useState(false);
    const [isloading, setIsloading] = useState(true);
    const [color, setColor] = useState('');

    const [data, setData] = useState([]);

    function getTransactions() {
        axios
            .get('https://waterstorage.somee.com/api/Transactions')
            .then(function (response) {
                let transactions = response.data.$values.filter(
                    item => !item.hasOwnProperty('$ref'),
                );
                transactions = transactions.filter(transaction => {
                    const transactionDate = new Date(transaction.createdAt);
                    return transactionDate >= fromDate && transactionDate <= toDate;
                });
                setTransactions(transactions);
                setIsloading(false);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function getTransactionsByTrade() {
        setData([]);
        let tempData = [];
        transactions.forEach(transaction => {
            if (transaction.trade == 0) {
                tempData.push(-transaction.totalPrice);
            } else {
                tempData.push(transaction.totalPrice);
            }
        });
        setData(tempData);
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
        getColor();
        getTransactionsByTrade();
    }, [transactions]);

    useEffect(() => {
        const task = () => {
            getTransactions();
        };
        task();
    }, [fromDate, toDate]);

    return (
        <View style={styles.container}>
            <View style={styles.datePicker}>
                <Button
                    style={[styles.buttonDate,{borderColor:color}]}
                    onPress={() => {
                        setOpenFrom(true);
                    }}>
                    <Text style={styles.buttonText}>
                        Từ:{' '}
                        {fromDate.toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                        })}
                        {' '}
                    </Text>
                    <Icon source={'calendar'} color="black" size={20} />
                </Button>
                <DatePicker
                    modal
                    mode='date'
                    open={openFrom}
                    date={fromDate}
                    onConfirm={date => {
                        setFromDate(date);
                        setOpenFrom(false);
                    }}
                    onCancel={() => {
                        setOpenFrom(false);
                    }}
                />
                <Button
                    style={[styles.buttonDate,{borderColor:color}]}
                    onPress={() => {
                        setOpenTo(true);
                    }}>
                    <Text style={styles.buttonText}>
                        Tới:{' '}
                        {toDate.toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                        })}
                        {' '}
                    </Text>
                    <Icon source={'calendar'} color="black" size={20} />
                </Button>
                <DatePicker
                    modal
                    mode='date'
                    open={openTo}
                    date={toDate}
                    onConfirm={date => {
                        setToDate(date);
                        setOpenTo(false);
                    }}
                    onCancel={() => {
                        setOpenTo(false);
                    }}
                />
            </View>
            {transactions.length == 0 ? (
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <Text style={[styles.text,{fontSize:25,textAlign:'center'}]}>
                        Không có giao dịch nào trong khoảng thời gian này
                    </Text>
                </View>
            ) : (
                <View>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', alignSelf: 'center', color: 'black' }}>BIỂU ĐÒ</Text>
                    <View>
                        <View style={styles.graphContainer}>
                            <YAxis
                                data={data}
                                contentInset={{ top: 20, bottom: 20 }}
                                svg={{
                                    fill: 'black',
                                    fontSize: 13,
                                }}
                                numberOfTicks={10}
                                formatLabel={value => `${formatPrice(value) + ' đ'}`}
                            />
                            <View style={{ flex: 1 }}>
                                <BarChart
                                    style={{ height: 300, flex: 1 }}
                                    data={data}
                                    animated={true}
                                    numberOfTicks={10}
                                    contentInset={{ top: 20, bottom: 20 }}
                                    svg={{ fill: color }}>
                                    <Grid />
                                </BarChart>
                            </View>
                        </View>
                    </View>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', alignSelf: 'center', color: 'black' }}>Thống kê chung</Text>
                    <View>
                        <DataTable>
                            <DataTable.Header>
                                <DataTable.Title textStyle={styles.text}>Ngày</DataTable.Title>
                                <DataTable.Title textStyle={styles.text} numeric>ID</DataTable.Title>
                                <DataTable.Title textStyle={styles.text} numeric>Thu/Chi</DataTable.Title>
                                <DataTable.Title textStyle={styles.text} numeric>Số tiền</DataTable.Title>
                            </DataTable.Header>
                            {transactions.map(transaction => {
                                const date = new Date(transaction.createdAt);
                                return (
                                    <DataTable.Row key={transaction.id}>
                                        <DataTable.Cell>{date.toLocaleDateString()}</DataTable.Cell>
                                        <DataTable.Cell numeric>{transaction.id}</DataTable.Cell>
                                        <DataTable.Cell numeric>{transaction.trade == 0 ? 'Chi' : 'Thu'}</DataTable.Cell>
                                        <DataTable.Cell numeric>{formatPrice(transaction.totalPrice)} đ</DataTable.Cell>
                                    </DataTable.Row>
                                );
                            })
                            }
                        </DataTable>
                    </View>
                </View>
            )}
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
        fontWeight: 'bold',
        color: 'black',
    },
    datePicker: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        margin: 10,
    },
    buttonDate: {
        width: "45%",
        margin: 10,
        borderRadius: 10,
        backgroundColor: '#dce9ef',
        borderWidth: 1,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 15,
        margin: 5,
        color: 'black',
    },
    graphContainer: {
        height: 300,
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
    },
});

export default Statistic;
