import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
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
import imagesPath from '../constants/imagesPath';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Register = ({ navigation }) => {
  const [firstname, setFirst] = useState('');
  const [lastname, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [hidePass, setHidePass] = useState(true)

  const registerUser = () => {
    if (firstname === '' || lastname === '') {
      alert('Please fill the firstname/lastname');
      return;
    }
    setLoading(true);
    createUserWithEmailAndPassword(auth, email, pass)
      .then(async userCredential => {
        // INSERT EMAIL AND PASS INTO AUTH LIST OF USERS AND
        // INSERT FIRSTNAME AND LASTNAME INTO COLLECTION OF USERS

        const user = userCredential.user;
        const uid = user.uid;
        const email = user.email;
        await setDoc(doc(db, 'users', uid), {
          FirstName: firstname,
          LastName: lastname,
          adminStatus: false,
          emailId: email,
          uid: uid,
        });

        // ENTER THE TOKENS OF AUTH AND DB
        try {
          const jsonValue = JSON.stringify(auth);
          await AsyncStorage.setItem('authToken', jsonValue);
        } catch (e) {
          console.log(e);
        }

        alert('User registered successfully');
        setLoading(false);
        navigation.replace('User');
      })
      .catch(error => {
        const errorMessage = error.message;
        setLoading(false);
        alert(errorMessage);
      });
  };

  return (
    <ScrollView>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}>
        <Text style={{ fontSize: 40, color: 'rgb(0,122,254)', marginLeft: 20 }}>
          &larr;
        </Text>
      </TouchableOpacity>
      <Text style={styles.loginHeading}>Register</Text>
      <View style={styles.loginBox}>
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Enter firstname"
            placeholderTextColor="gray"
            style={styles.inputBox}
            onChangeText={newText => {
              setFirst(newText);
            }}
          />
        </View>
        <View style={styles.searchBox}>
          <TextInput
            style={styles.inputBox}
            placeholder="Enter lastname"
            placeholderTextColor="gray"
            onChangeText={newText => {
              setLast(newText);
            }}
          />
        </View>
        <View style={styles.searchBox}>
          <TextInput
            style={styles.inputBox}
            placeholder="Enter email"
            placeholderTextColor="gray"
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
          <TouchableHighlight
            style={styles.regBtn}
            onPress={() => {
              registerUser();
            }}>
            <Text style={{ textAlign: 'center', fontSize: 20, color: 'white' }}>
              Register
            </Text>
          </TouchableHighlight>
        ) : (
          <View style={styles.regBtn}>
            <ActivityIndicator size="small" color="white" />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loginHeading: {
    marginTop: 50,
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

  regBtn: {
    marginTop: 20,
    backgroundColor: 'rgb(230,85,50)',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    elevation: 10,
    height: 50,
    justifyContent: 'center',
    borderRadius: 10,
  },

  inputBox: {
    color: 'black',
    fontSize: 15,
    marginRight: 10,
    width: '95%'
  },
});

export default Register;
