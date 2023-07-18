import { StyleSheet, Text, View, ScrollView, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import Card from '../components/Card';
import imagesPath from '../constants/imagesPath';

const TaggedList = ({ navigation }) => {
    const [tagArr, setTags] = useState([])
    const [tagVideos, setTagVideos] = useState({});
    const [isLoading, setLoading] = useState(true);
    const [tagToggle, setTagToggle] = useState({});

    // Function to fetch all tags
    const getAllTags = async () => {
        try {
            const taggedVideosRef = collection(db, 'taggedVideos');
            const querySnapshot = await getDocs(taggedVideosRef);

            const tags = querySnapshot.docs.map(doc => doc.id);
            setTags(tags)

            const tagToggleTemp = {};
            for (const tag of tags) {
                tagToggleTemp[tag] = false;
            }
            setTagToggle(tagToggleTemp);
        } catch (error) {
            console.log('Error retrieving tags:', error);
        }
    };

    const toggleTag = async tag => {

        if (tagToggle[tag] == false) {
            const videosByTag = {};
            const docRef = doc(db, 'taggedVideos', tag);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                const videos = data.videos || [];
                console.log(`Videos under tag ${tag}:`, videos);
                videosByTag[tag] = videos;
            } else {
                videosByTag[tag] = [];
            }

            setTagVideos(videosByTag);
        }

        setTagToggle(prevTagToggle => ({
            ...prevTagToggle,
            [tag]: !prevTagToggle[tag],
        }));
    };

    useEffect(() => {
        if (tagArr.length != 0) {
            setLoading(false)
        }
    }, [tagArr])

    useEffect(() => {
        getAllTags()
    }, [])

    if (isLoading) {
        return <View style={{ height: '100%', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="rgb(0,122,254)" />
            <Text style={{ color: 'black', size: 20, textAlign: 'center' }}>Fetching Tagged Videos</Text>
        </View>
    }

    return (
        <ScrollView>

            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}>
                    <Text style={{ fontSize: 30, color: 'rgb(0,122,254)', marginLeft: 15 }}>
                        &larr;
                    </Text>
                </TouchableOpacity>
                <Text style={styles.heading}>Tag List</Text>
                {tagArr.map(tag => (
                    <View style={styles.tagContainer} key={tag}>
                        <TouchableOpacity onPress={() => {
                            toggleTag(tag);
                        }}>
                            <View style={styles.tagHeadingContainer}>
                                <Text style={styles.tagHeading}>{tag}</Text>
                                {tagToggle[tag] ? (
                                    <Image
                                        style={{ width: 30, height: 30, position: 'absolute', right: 8 }}
                                        source={imagesPath.dropUp}
                                    />
                                ) : (
                                    <Image
                                        style={{ width: 30, height: 30, position: 'absolute', right: 8 }}
                                        source={imagesPath.dropDown}
                                    />
                                )}
                            </View>

                        </TouchableOpacity>
                        {tagVideos[tag] && (

                            tagToggle[tag] && (<View style={styles.videoList}>
                                {tagVideos[tag].map(item => (
                                    <Card
                                        key={item.videoId}
                                        videoId={item.videoId}
                                        videoTitle={item.videoTitle}
                                        channel={item.channel}
                                        thumbnail={item.thumbnail}
                                        check={true}
                                        navigation={navigation}
                                    />
                                ))}
                            </View>)

                        )}
                    </View>
                ))}
            </View>
        </ScrollView>
    )
}

export default TaggedList

const styles = StyleSheet.create({
    heading: {
        textAlign: 'center',
        fontSize: 25,
        marginBottom: 30,
        color: 'black',
    },

    tagHeadingContainer: {
        marginHorizontal: 30,
        backgroundColor: 'rgb(0,122,254)',
        justifyContent: 'center',
        paddingLeft: 15,
        paddingVertical: 5,
        borderRadius: 8,
        marginBottom: 10
    },

    tagHeading: {
        fontSize: 18,
        color: 'white',
    },
})