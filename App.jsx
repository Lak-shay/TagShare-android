import React, { useState, useEffect } from 'react';
import Login from './screens/Login';
import Register from './screens/Register';
import Admin from './screens/Admin';
import UserPortal from './screens/UserPortal';
import VideoScreen from './screens/VideoScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListUsers from './screens/ListUsers';
import { View, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import TaggedList from './screens/TaggedList';
import TaggedListUser from './screens/TaggedListUser'

const Stack = createNativeStackNavigator();
const App = () => {
  // USED TO CHECK IF A USER IS ALREADY SIGNED IN
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const getToken = async () => {
    try {
      const jsonString1 = await AsyncStorage.getItem('authToken');
      const authTok = JSON.parse(jsonString1);
      if (authTok !== null) {
        // auth token exists
        setAuthenticated(true);
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false)
  }

  useEffect(() => {
    getToken();
  }, []);

  if (loading) {
    // Show a loading screen or spinner while authentication state is being determined
    return (
      // Replace this with your loading screen component
      <View style={{ height: '100%', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="rgb(0,122,254)" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}>
        {authenticated ? (
          <Stack.Screen name="Home" component={UserPortal} />
        ) : (
          <Stack.Screen name="Home" component={Login} />
        )}
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Admin" component={Admin} />
        <Stack.Screen name="User" component={UserPortal} />
        <Stack.Screen name="VideoScreen" component={VideoScreen} />
        <Stack.Screen name="ListUsers" component={ListUsers} />
        <Stack.Screen name="TaggedList" component={TaggedList} />
        <Stack.Screen name="TaggedListUser" component={TaggedListUser} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
