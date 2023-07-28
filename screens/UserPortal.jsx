import { React, useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';
import Card from '../components/Card';
import imagesPath from '../constants/imagesPath';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TagComp from '../components/TagComp';

import {
    View,
    Text,
    Image,
    StyleSheet,
    TextInput,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Keyboard,
} from 'react-native';

const UserPortal = ({ navigation }) => {
    const [check, setCheck] = useState(false);
    const [search, setSearch] = useState('');
    const [videoData, setVideoData] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [userName, setUserName] = useState(userName);
    const [stored_auth, setAuth] = useState(null);
    const [checkTags, setSearchTags] = useState([]);
    // GOT TO KNOW THAT USE STATE IS ALSO ASYNCHRONOUS IN NATURE SO HAVE TO CALL CHECK ADMIN ONLY AFTER AUTH HAS BEEN UPDATED. THIS HAS BEEN ACHIEVED BY USING USEEFFECT WITH AUTH AS DEPENDENCY.

    const getTokens = async () => {
        try {
            const jsonString1 = await AsyncStorage.getItem('authToken');
            const authTok = await JSON.parse(jsonString1);
            setAuth(authTok);

        } catch (e) {
            console.log(e)
        }
    }

    const checkAdminStatus = async () => {

        const user = stored_auth.currentUser;
        if (user) {
            const uid = user.uid;
            const userRef = doc(db, 'users', uid);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                const adminStatus = docSnap.data().adminStatus;
                setCheck(adminStatus);
                const username = docSnap.data().FirstName;
                setUserName(username);
            } else {
                console.log('No such document!');
            }
        } else {
            console.log('User not found');
        }
    };

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

    const addTags = async () => {
        Keyboard.dismiss();

        setLoading(true);

        if (search === '') {
            alert('Please enter something to search');
            setLoading(false)
            return;
        }

        if (checkTags.includes(search)) {
            alert('Tag already present');
            setLoading(false);
            return;
        }

        const newTags = [...checkTags, search];
        console.log(newTags)
        setSearchTags(newTags);
        setSearch('');
    };

    // WILL FETCH FROM THE DB
    const fetchData = async () => {
        // get the tags to be checked

        try {
            // check if the first tag only is present for any video. If not then no point in searching any other video.
            if (checkTags.length === 0) {
                setVideoData([]);
                setLoading(false)
                return;
            }
            const docRef = doc(db, 'taggedVideos', checkTags[0]);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                const videos = data.videos || [];

                // videos contains the word matching the first tag in the checkTags
                // Now we only have to search all the video objects in the videos that match all the check Tags

                // wait for all videos to be checked
                const matchingVideos = await Promise.all(
                    videos.map(async (video) => {
                        let include = true;
                        const videoId = video.videoId;

                        try {
                            const docRef = doc(db, 'VideoTags', videoId);
                            const docSnap = await getDoc(docRef);

                            if (docSnap.exists()) {
                                const data = docSnap.data();
                                const videoTags = data.tags || [];

                                // Check if each tag of checkTags is within videoTags
                                for (const tag of checkTags) {
                                    if (!videoTags.includes(tag)) {
                                        include = false;
                                        break; // Break out of the loop if any tag is missing
                                    }
                                }
                            } else {
                                console.log('Document not found');
                            }
                        } catch (error) {
                            console.log(error);
                        }

                        if (include) {
                            return video;
                        }
                    })
                );
                const filteredVideos = matchingVideos.filter((video) => video !== undefined);

                console.log(filteredVideos)
                setVideoData(filteredVideos);
            } else {
                setVideoData([]);
            }

        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const removeSearchTags = (tag) => {
        setLoading(true);
        const updatedTags = checkTags.filter((t) => t !== tag);
        setSearchTags(updatedTags);
    }

    useEffect(() => {
        fetchData();
    }, [checkTags])

    useEffect(() => {
        if (auth !== null) {
            checkAdminStatus();
        }
    }, [stored_auth])

    // UPON RENDERING THE COMPONENT FOR THE FIRST TIME, USE EFFECT IS CALLED.
    useEffect(() => {
        getTokens();
    }, []);

    return (
        // <ScrollView>
        <>
            {/* {console.log("Printed User")} */}
            <View style={styles.navbar}>
                {check && (
                    <TouchableOpacity
                        style={[styles.icons, { marginRight: 10 }]}
                        onPress={() => {
                            navigation.navigate('Admin');
                        }}>
                        <Image
                            style={{ width: 30, height: 30, alignSelf: 'center' }}
                            source={imagesPath.adminIcon}
                        />
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    style={[styles.icons]}
                    onPress={() => {
                        navigation.navigate('TaggedListUser');
                    }}>
                    <Image
                        style={{ width: 30, height: 30, alignSelf: 'center' }}
                        source={imagesPath.taggedList}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.icons, { position: 'absolute', right: 0 }]}
                    onPress={() => {
                        logout();
                    }}>
                    <Image
                        style={{ width: 27, height: 27, alignSelf: 'center' }}
                        source={imagesPath.logoutIcon}
                    />
                </TouchableOpacity>
            </View>
            <Text style={styles.heading}>Seach Tagged Videos</Text>
            <View style={styles.searchBox}>
                <TextInput
                    value={search}
                    placeholder="What are you looking for ?"
                    placeholderTextColor="gray"
                    style={styles.inputBox}
                    onChangeText={newText => {
                        setSearch(newText);
                    }}
                />
                <TouchableOpacity
                    style={styles.searchIcon}
                    onPress={() => {
                        addTags();
                    }}>
                    <Image
                        style={{ width: 35, height: 35, alignSelf: 'center' }}
                        source={imagesPath.search}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.searchTagBox}>
                {
                    checkTags.map(tag => {
                        return <TagComp tag={tag} key={tag} removeTag={removeSearchTags} />;
                    })
                }
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
                                videoId={item.videoId}
                                videoTitle={item.videoTitle}
                                channel={item.channel}
                                thumbnail={item.thumbnail}
                                check={false}
                                navigation={navigation}
                            />
                        );
                    }}
                    keyExtractor={item => item.videoId}
                />
            )}
        </>
    );
};

const styles = StyleSheet.create({
    heading: {
        fontSize: 26,
        textAlign: 'center',
        marginBottom: 15,
        color: 'black',
    },
    searchBox: {
        borderRadius: 15,
        marginBottom: 10,
        paddingLeft: 15,
        height: 50,
        marginLeft: 30,
        marginRight: 30,
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'white',
        justifyContent: 'space-between',
    },

    searchTagBox: {
        marginHorizontal: 30,
        marginBottom: 5,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5,
    },

    inputBox: {

        color: 'black',
        fontSize: 17,
        width: '80%'

    },

    searchIcon: {
        justifyContent: 'center',
        paddingHorizontal: 5,
        height: 50,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        width: 50,
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
    },

    icons: {
        backgroundColor: 'white',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        elevation: 10,
    },
});

export default UserPortal;
