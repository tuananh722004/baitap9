import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Login Screen
const LoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [isValid, setIsValid] = useState(true);

  // Function to validate phone number
  const validatePhone = (text) => {
    const phoneRegex = /^[0-9]{10}$/; // Exactly 10 digits
    return phoneRegex.test(text);
  };

  // Handle "Continue" button click
  const handleContinue = async () => {
    const plainPhone = phone.replace(/\s/g, ''); // Remove spaces for validation
    if (validatePhone(plainPhone)) {
      setIsValid(true);
      // Lưu số điện thoại vào AsyncStorage
      try {
        await AsyncStorage.setItem('userPhone', plainPhone);
        // Navigate to HomeScreen if valid phone
        navigation.navigate('HomeScreen');
      } catch (e) {
        Alert.alert('Error', 'Có lỗi xảy ra khi lưu số điện thoại.');
      }
    } else {
      Alert.alert('Lỗi', 'Số điện thoại không hợp lệ. Hãy nhập đúng 10 chữ số.');
      setIsValid(false);
    }
  };

  // Handle phone number input
  const handlePhoneChange = (text) => {
    const formattedText = text.replace(/\D/g, '') // Remove non-digit characters
                              .replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3'); // Format as 090 123 4567
    setPhone(formattedText);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.title}>Đăng nhập</Text>
      <Text style={styles.subtitle}>Nhập số điện thoại</Text>
      <Text style={styles.description}>
        Dùng số điện thoại để đăng nhập hoặc đăng ký tài khoản
      </Text>
      <TextInput
        style={[styles.input, !isValid && styles.inputError]}
        placeholder="Nhập số điện thoại của bạn"
        keyboardType="numeric"
        value={phone}
        onChangeText={handlePhoneChange}  // Automatically format phone input
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: phone.length === 0 ? '#ccc' : '#007BFF' }]}
        disabled={phone.length === 0}  // Disable button if no input
        onPress={handleContinue}
      >
        <Text style={styles.buttonText}>Tiếp tục</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

// Home Screen
const HomeScreen = () => {
  const [phone, setPhone] = useState('');

  // Lấy số điện thoại từ AsyncStorage khi HomeScreen được load
  useEffect(() => {
    const fetchPhone = async () => {
      try {
        const savedPhone = await AsyncStorage.getItem('userPhone');
        if (savedPhone !== null) {
          setPhone(savedPhone);
        }
      } catch (e) {
        Alert.alert('Error', 'Không thể lấy thông tin số điện thoại.');
      }
    };
    fetchPhone();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chào mừng đến Trang Chủ!</Text>
      <Text style={styles.phoneText}>Số điện thoại của bạn: {phone}</Text>
    </View>
  );
};

// Stack Navigator
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ title: 'Đăng nhập' }} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Trang Chủ' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#888',
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  inputError: {
    borderColor: 'red',
  },
  button: {
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  phoneText: {
    fontSize: 18,
    marginTop: 20,
    color: '#333',
  },
});

export default App;
