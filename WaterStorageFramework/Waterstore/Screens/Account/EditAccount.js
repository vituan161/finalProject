import { React, useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { TextInput, ActivityIndicator } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";



function EditAccount({ navigation }) {
  const [user, setUser] = useState({});
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [email, setEmail] = useState('');
  const [isloading, setIsloading] = useState(true);
  const isFocused = useIsFocused();
  const [color, setColor] = useState('');

  useEffect(() => {
    getData().then((data) => {
      setId(data.id);
    });
  }, []);

  useEffect(() => {

    if (isFocused) {
      getUser();
    }
  }, [id && isFocused]);

  function getUser() {
    axios.get('https://waterstorage.somee.com/api/Users/' + id)
      .then(function (response) {
        setUser(response.data);
        setName(response.data.name);
        setEmail(response.data.email);
        setImageURL(response.data.imageUrl);
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

  function updateAccount() {
    axios.put('https://waterstorage.somee.com/api/Users/' + user.id, {
      id: user.id,
      name: name,
      email: email,
      password: user.password,
      imageUrl: imageURL,
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

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('UserData');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 10 }}
          onPress={() => {
            updateAccount();
          }}>
          <Text style={{ color: 'white', fontSize: 20 }}>Lưu</Text>
        </TouchableOpacity>
      ),
    })
    getColor();
  });

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
          label="Email"
          value={email}
          keyboardType="numeric"
          onChangeText={text => setEmail(text)}
          mode='outlined'
          outlineColor='#dce9ef'
          activeOutlineColor={color}
        />
        <TextInput
          style={styles.inputText}
          label="imageURL"
          value={imageURL}
          onChangeText={text => setImageURL(text)}
          mode='outlined'
          outlineColor='#dce9ef'
          activeOutlineColor={color}
        />
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  inputText: {
    width: '90%',
    elevation: 5,
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#dce9ef',
    borderColor: '#096bff',
  },
});

export default EditAccount;