/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {useState, useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import SplashScreen from './Screens/SplashScreen';
import Login from './Screens/Login';
import Home from './Screens/Home';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PaperProvider, ActivityIndicator} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import Setting from './Screens/Setting';
import Customer from './Screens/Customer/Customer';
import EditAccount from './Screens/Account/EditAccount';
import EditCustomer from './Screens/Customer/EditCustomer';
import CreateCustomer from './Screens/Customer/CreateCustomer';
import Product from './Screens/Product/Product';
import AddProduct from './Screens/Product/AddProduct';
import EditProduct from './Screens/Product/EditProduct';
import Transaction from './Screens/Transaction/Transaction';
import CreateTransaction from './Screens/Transaction/CreateTransaction';
import TransactionDetail from './Screens/Transaction/TransactionDetail';
import Statistic from './Screens/Statistic/Statistic';


function App() {
  const [islogin, setIslogin] = useState('');
  const [trigger, setTrigger] = useState(false);
  const [color, setColor] = useState('');

  const getislogin = async () => {
    try {
      const value = await AsyncStorage.getItem('islogin');
      if (value !== null) {
        setIslogin(value);
      }
    } catch (e) {
      console.log(e);
    }
  };

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
  })

  useEffect(() => {
    getislogin();
  }, [trigger]);

  const Stack = createSharedElementStackNavigator();

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="SplashScreen"
          screenOptions={{
            headerStyle: {
              backgroundColor: color,
            },
            headerTintColor: 'white',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}>
          <Stack.Screen
            name="HomeScreen"
            options={{headerShown: false}}
            component={Home}
          />
          <Stack.Screen
            name="SettingScreen"
            options={{
              title: 'Cài đặt',
            }}
            component={Setting}
          />
          <Stack.Screen
            name="CustomerScreen"
            component={Customer}
            options={{
              title: 'Danh sách khách hàng',
            }}
          />
          <Stack.Screen
            name="EditCustomerScreen"
            component={EditCustomer}
            options={{
              title: 'Chỉnh sửa thông tin khách hàng',
            }}
          />
          <Stack.Screen
            name="CreateCustomerScreen"
            component={CreateCustomer}
            options={{
              title: 'Tạo khách hàng mới',
            }}
          />
          <Stack.Screen
            name="ProductScreen"
            component={Product}
            options={{
              title: 'Danh sách sản phẩm',
            }}
          />
          <Stack.Screen
            name="AddProductScreen"
            component={AddProduct}
            options={{
              title: 'Thêm sản phẩm mới',
            }}
          />
          <Stack.Screen
            name="EditProductScreen"
            component={EditProduct}
            options={{
              title: 'Chỉnh sửa thông tin sản phẩm',
            }}
          />
          <Stack.Screen
            name="EditAccountScreen"
            component={EditAccount}
            options={{
              title: 'Thông tin tài khoản',
            }}
          />
          <Stack.Screen
            name="LoginScreen"
            options={{headerShown: false}}
            component={Login}
          />
          <Stack.Screen
            name="SplashScreen"
            options={{headerShown: false}}
            component={SplashScreen}
          />
          <Stack.Screen
            name="TransactionScreen"
            options={{
              title: 'Danh sách giao dịch',
            }}
            component={Transaction}
          />
          <Stack.Screen
            name="CreateTransactionScreen"
            options={{
              title: 'Tạo giao dịch mới',
            }}
            component={CreateTransaction}
          />
          <Stack.Screen
            name="TransactionDetailScreen"
            options={{
              title: 'Chi tiết giao dịch',
            }}
            component={TransactionDetail}
          />
          <Stack.Screen
            name="StatisticScreen"
            options={{
              title: 'Thống kê',
            }}
            component={Statistic}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
