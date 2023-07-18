import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image
} from 'react-native';
import imagesPath from '../constants/imagesPath.js';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [hidePass, setHidePass] = useState(true)

  const doLogin = () => {
    setLoading(true);
    signInWithEmailAndPassword(auth, email, pass)
      .then(async () => {
        // alert('Signed in successfully');
        // GIVE ACCESS TO USER PORTAL SCREEN

        const user = auth.currentUser;
        const uid = user.uid;

        // ENTER THE TOKENS OF AUTH AND DB
        try {
          const jsonValue = JSON.stringify(auth);
          await AsyncStorage.setItem('authToken', jsonValue);
        } catch (e) {
          console.log(e);
        }

        const userRef = doc(db, 'users', uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const isAdmin = await docSnap.data().adminStatus;
          setLoading(false);
          if (isAdmin) {
            navigation.replace('Admin');
          } else {
            navigation.replace('User');
          }
        } else {
          console.log('No such document!');
        }
        // If the current user is admin then directly redirect to the admin portal else redirect to the user portal
      })
      .catch(error => {
        const errorMessage = error.message;
        setLoading(false);
        alert(errorMessage);
      });
  };

  return (
    <ScrollView>
      <Text style={styles.loginHeading}>Login</Text>
      <View style={styles.loginBox}>
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Enter email"
            placeholderTextColor="gray"
            style={styles.inputBox}
            onChangeText={newText => {
              setEmail(newText);
            }}
          />
        </View>
        <View style={styles.searchBox}>
          <TextInput
            style={[styles.inputBox, { width: '75%' }]}
            secureTextEntry={hidePass}
            placeholder="Enter password"
            placeholderTextColor="gray"
            onChangeText={newText => {
              setPass(newText);
            }}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => {
              setHidePass(!hidePass)
            }}
          >
            {
              hidePass ? (<Image
                style={{ width: 22, height: 22, alignSelf: 'center' }}
                source={imagesPath.showText}
              />) : (<Image
                style={{ width: 22, height: 22, alignSelf: 'center' }}
                source={imagesPath.hideText}
              />)
            }

          </TouchableOpacity>
        </View>
        {!isLoading ? (
          <TouchableHighlight style={styles.loginBtn} onPress={() => doLogin()}>
            <Text style={{ textAlign: 'center', fontSize: 20, color: 'white' }}>
              Login
            </Text>
          </TouchableHighlight>
        ) : (
          <View style={styles.loginBtn}>
            <ActivityIndicator size="small" color="white" />
          </View>
        )}

        <View style={styles.registerContainer}>
          <Text
            style={{
              fontSize: 15,
              height: 100,
              color: 'black',
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Register');
              }}>
              <Text
                style={{
                  textDecorationLine: 'underline',
                  fontSize: 15,
                  color: 'black',
                }}>
                If you're new, register here
              </Text>
            </TouchableOpacity>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loginHeading: {
    marginTop: 100,
    textAlign: 'center',
    fontSize: 40,
    color: 'black',
  },

  loginBox: {
    marginTop: 50,
    marginLeft: 40,
    marginRight: 40,
  },

  searchBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    marginBottom: 20,
    paddingLeft: 10,
    height: 50,
    backgroundColor: 'white',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    elevation: 10,
  },

  eyeIcon: {
    justifyContent: 'center',
    paddingHorizontal: 5,
    height: 50,
    width: 50,
  },

  loginBtn: {
    marginTop: 18,
    backgroundColor: 'rgb(0,122,254)',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    elevation: 10,
    height: 50,
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 4,
  },

  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 7,
  },

  inputBox: {
    color: 'black',
    fontSize: 15,
    marginRight: 10,
    width: '95%',
  },
});

export default Login;
