import { StyleSheet, Text, View, Switch, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const UserComp = props => {
  // get email and uid from props
  const uid = props.uid;
  const email = props.email;
  const [isAdmin, setAdmin] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const makeAdmin = async () => {
    setLoading(true);
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        adminStatus: true,
      });
      setAdmin(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert(error);
    }
  };

  const removeAdmin = async () => {
    setLoading(true);
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        adminStatus: false,
      });
      setAdmin(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const checkAdminStatus = async () => {
    const userRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const adminStatus = docSnap.data().adminStatus;
      setAdmin(adminStatus);
    } else {
      console.log('No such document!');
    }
  };

  useEffect(() => {
    checkAdminStatus();
  }, []);

  return (
    <View>
      <View style={styles.container}>
        <Text
          style={{
            textAlign: 'center',
            width: '75%',
            fontSize: 18,
            color: 'black',
          }}>
          {email}
        </Text>
        <View style={{ width: '25%' }}>
          {isLoading ? (
            <ActivityIndicator size="small" color="black" />
          ) : (
            <Switch
              style={{
                alignSelf: 'center',
              }}
              value={isAdmin}
              onValueChange={value => {
                if (value == true) {
                  // made admin now
                  makeAdmin();
                } else {
                  // remove admin now
                  removeAdmin();
                }
              }}
              trackColor={{ false: '#EAEAEA', true: '#3BCB5F' }}
              thumbColor="white"
            />
          )}
        </View>
      </View>
      <View
        style={{
          borderBottomColor: 'black',
          borderBottomWidth: StyleSheet.hairlineWidth,
        }}
      />
    </View>
  );
};

export default UserComp;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 15,
  },
});
