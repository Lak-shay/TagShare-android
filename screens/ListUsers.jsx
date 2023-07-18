import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import UserComp from '../components/UserComp';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ListUsers = ({ navigation }) => {
  const [nonAdminUsers, setNonAdminUsers] = useState([]);
  const [auth, setAuth] = useState({});

  const getTokens = async () => {
    try {
      const jsonString = await AsyncStorage.getItem('authToken');
      const jsonValue = JSON.parse(jsonString);
      setAuth(jsonValue);
    } catch (e) {
      console.log(e)
    }
  }

  const fetchNonAdminUsers = async () => {
    const user = auth.currentUser;
    const curr_email = user.email
    const usersRef = collection(db, 'users');
    // Get all the users except the current user
    const q = query(
      usersRef,
      where('emailId', '!=', curr_email),
      orderBy('emailId'),
    );

    const querySnapshot = await getDocs(q);
    const temp = [];

    querySnapshot.forEach(doc => {
      temp.push(doc.data());
    });

    console.log(temp);
    setNonAdminUsers(temp);
  };

  useEffect(() => {
    if (auth !== null) {
      fetchNonAdminUsers();
    }
  }, [auth])

  useEffect(() => {
    getTokens();
  }, []);

  return (
    <ScrollView>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}>
        <Text style={{ fontSize: 30, color: 'rgb(0,122,254)', marginLeft: 15 }}>
          &larr;
        </Text>
      </TouchableOpacity>

      <Text style={styles.heading}>Users</Text>
      <View style={styles.container}>
        {/* Reading each object of the array */}
        <View style={[styles.rows]}>
          <View
            style={{
              width: '75%',
              // borderEndWidth: StyleSheet.hairlineWidth,
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 18,
                color: 'rgb(0,122,254)',
                paddingVertical: 15,
              }}>
              Email Id
            </Text>
          </View>
          <View style={{ width: '25%' }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 18,
                color: 'rgb(0,122,254)',
                paddingVertical: 15,
              }}>
              Admin
            </Text>
          </View>
        </View>
        <View
          style={{
            borderBottomColor: 'black',
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
        <View style={styles.userContainer}>
          {nonAdminUsers.map(user => (
            <UserComp key={user.uid} uid={user.uid} email={user.emailId} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default ListUsers;

const styles = StyleSheet.create({
  heading: {
    textAlign: 'center',
    fontSize: 25,
    color: 'black',
  },
  container: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  rows: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  userContainer: {
    backgroundColor: 'white',
  },
});
