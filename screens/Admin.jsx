import { React, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import axios from 'axios';
import Card from '../components/Card';
import imagesPath from '../constants/imagesPath';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { YOUTUBE_API } from "@env"
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard
} from 'react-native';

const Admin = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [videoData, setVideoData] = useState([]);
  const [blockedVideos, setBlockedVideos] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const logout = async () => {

    // if the token exists or gets erased from the firebase/config file, the signOut(auth) will work

    signOut(auth).then(async () => {
      console.log('User logged out');
      try {
        await AsyncStorage.removeItem('authToken');
      }
      catch (e) {
        console.log(e);
      }

      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }).catch(error => {
      console.log(error.message);
    });

  };

  const fetchData = async () => {
    Keyboard.dismiss()
    if (search === '') {
      alert('Please enter something to search');
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(
        `https://youtube.googleapis.com/youtube/v3/search`,
        {
          params: {
            part: 'snippet',
            maxResults: 50,
            q: search, // Update the 'q' parameter with the 'search' state value
            type: 'video',
            key: YOUTUBE_API,
          },
        },
      );

      const result = response.data;
      // Process the API response here

      // FIRST FETCH THE BLOCKED VIDEOS. THEN FILTER THEM BY THEIR IDS.
      // IF YOU'VE BLOCKED A VIDEO, IT'LL WILL START TO NOT APPEAR ONLY AFTER SOME OTHER SEARCH. AFTER THAT IT'LL NOT BE LISTED.
      await fetchBlockedVideos();
      const filteredResults = result.items.filter(
        video => !blockedVideos.includes(video.id.videoId),
      );

      setVideoData(filteredResults);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBlockedVideos = async () => {
    const blockedVideosRef = collection(db, 'blocked');
    const querySnapshot = await getDocs(blockedVideosRef);
    const blockedVideoIds = querySnapshot.docs.map(doc => doc.id);
    setBlockedVideos(blockedVideoIds);
  };

  return (
    // <ScrollView>
    <View style={{ height: '100%', backgroundColor: '#444654' }}>
      {/* {console.log("Printed Admin")} */}
      <View style={styles.navbar}>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <TouchableOpacity
            style={styles.icons}
            onPress={() => {
              navigation.navigate('User');
            }}>
            <Image
              style={{ width: 30, height: 30, alignSelf: 'center' }}
              source={imagesPath.userIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.icons, { marginLeft: 10 }]}
            onPress={() => {
              navigation.navigate('ListUsers');
            }}>
            <Image
              style={{ width: 30, height: 30, alignSelf: 'center' }}
              source={imagesPath.usersIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.icons, { marginLeft: 10 }]}
            onPress={() => {
              navigation.navigate('TaggedList');
            }}>
            <Image
              style={{ width: 30, height: 30, alignSelf: 'center' }}
              source={imagesPath.taggedList}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.icons}
          onPress={() => {
            logout();
          }}>
          <Image
            style={{ width: 27, height: 27, alignSelf: 'center' }}
            source={imagesPath.logoutIcon}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.heading}>Tag Youtube Videos</Text>
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search on Youtube"
          placeholderTextColor="gray"
          style={styles.inputBox}
          onChangeText={newText => {
            setSearch(newText);
          }}
        />
        <TouchableOpacity
          style={styles.searchIcon}
          onPress={() => {
            // Fetch the youtube api here
            // console.log('Hello world');
            fetchData();
          }}>
          <Image
            style={{ width: 35, height: 35, alignSelf: 'center' }}
            source={imagesPath.search}
          />
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color="red" />
      ) : (
        <FlatList
          data={videoData}
          initialNumToRender={100}
          renderItem={({ item }) => {
            return (
              <Card
                videoId={item.id.videoId}
                videoTitle={item.snippet.title}
                channel={item.snippet.channelTitle}
                thumbnail={item.snippet.thumbnails.default.url}
                check={true}
                navigation={navigation}
              />
            );
          }}
          keyExtractor={item => item.id.videoId}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 26,
    textAlign: 'center',
    marginBottom: 15,
    color: 'white',
  },
  searchBox: {
    borderRadius: 15,
    marginBottom: 30,
    paddingLeft: 15,
    height: 50,
    marginLeft: 30,
    marginRight: 30,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    shadowColor: 'rgba(0, 0, 0)',

  },

  inputBox: {
    // borderWidth: 1,
    color: 'black',
    width: '80%',
    fontSize: 17,
  },

  searchIcon: {
    justifyContent: 'center',
    paddingHorizontal: 5,
    height: 50,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    width: 50,
    // borderWidth: 1,
    backgroundColor: 'rgb(0,122,254)',
  },
  tinyLogo: {
    width: 40,
    height: 40,
  },

  navbar: {
    marginTop: 20,
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  icons: {
    backgroundColor: 'white',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0)',
    elevation: 10,
  },
});

export default Admin;
