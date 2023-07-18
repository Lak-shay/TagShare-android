import { React, useEffect, useState } from 'react';
import { db } from '../firebase/firebaseConfig.js';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayRemove,
  deleteDoc
} from 'firebase/firestore';

import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import imgPath from '../constants/imagesPath.js';
import TagComp from './TagComp';
import TagCompUser from './TagCompUser.jsx'

const Card = props => {
  const [optionStatus, setOptionStatus] = useState(false);
  const [tagShow, setTagShow] = useState(false);
  const [tagVal, setTagVal] = useState('');
  const [blockShow, setBlockShow] = useState(false);
  const [tagArr, setTagArr] = useState([]);
  const [isSaving, setSaving] = useState(false);
  const [isBlocking, setBlocking] = useState(false);
  const { navigation } = props;


  const addTagToVideo = async () => {
    setSaving(true);
    if (tagVal === '') {
      alert('Please enter the tag');
      setSaving(false);
      return;
    }
    const videoId = props.videoId;
    const docRef = doc(db, 'VideoTags', videoId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const existingData = docSnap.data();
      const tagExists =
        existingData.tags && existingData.tags.some(tag => tag === tagVal);

      if (!tagExists) {
        const updatedData = {
          ...existingData,
          tags: existingData.tags ? [...existingData.tags, tagVal] : [tagVal],
        };

        await setDoc(docRef, updatedData);
        await setTags();
        console.log('Tag added to video');
        addVideoToTag();
      } else {
        console.log('Tag already tagged to video');
        setSaving(false);
        alert('Already present');
      }
    } else {
      const newData = {
        tags: [tagVal],
      };

      await setDoc(docRef, newData);
      await setTags();
      console.log('Tag added to video');
      addVideoToTag();
    }

    setTagVal('')
  };

  const addVideoToTag = async () => {
    const vidData = {
      videoId: props.videoId,
      videoTitle: props.videoTitle,
      channel: props.channel,
      thumbnail: props.thumbnail,
      check: 0,
    };

    // Fetch existing data from the document
    const docRef = doc(db, 'taggedVideos', tagVal);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Update the existing data by appending the new video data to the array
      const existingData = docSnap.data();

      // CHECK IF THE CURRENT VIDEO ID MATCHES WITH SOME VIDEO ID IN THE VIDEOS ARRAY UNDER THE TAG
      const videoExists =
        existingData.videos &&
        existingData.videos.some(video => video.videoId === vidData.videoId);

      if (!videoExists) {
        // Don't push duplicate object of videos
        const updatedData = {
          ...existingData,
          videos: existingData.videos
            ? [...existingData.videos, vidData]
            : [vidData],
        };

        await setDoc(docRef, updatedData);
        setSaving(false);
        console.log('Video added to tag');
      } else {
        setSaving(false);
        console.log('Video already under tag');
      }
    } else {
      // If the document doesn't exist, create a new document with the video data as an array
      const newData = {
        videos: [vidData],
      };

      await setDoc(docRef, newData);
      setSaving(false);
      console.log('Video added to tag');
    }
  };

  const removeTag = async tag => {
    try {
      // Remove the tag from videoTags of the specific videoId
      const videoId = props.videoId;
      const docRef = doc(db, 'VideoTags', videoId);
      await updateDoc(docRef, {
        tags: arrayRemove(tag),
      });

      // Check if the tags array becomes empty
      const videoTagsRef = doc(db, 'VideoTags', videoId);
      const videoTagsDoc = await getDoc(videoTagsRef);

      if (videoTagsDoc.exists()) {
        const videoTagsData = videoTagsDoc.data();
        const tags = videoTagsData.tags || [];

        if (tags.length === 0) {
          // Remove the video id if the tags array is empty
          await deleteDoc(videoTagsRef);
        }
      }

      // Remove the video from taggedVideos of the specific tag
      // Remove the video object from taggedVideos of the specific tag
      const taggedVideosRef = doc(db, 'taggedVideos', tag);
      const taggedVideosDoc = await getDoc(taggedVideosRef);

      if (taggedVideosDoc.exists()) {
        const taggedVideosData = taggedVideosDoc.data();
        const videos = taggedVideosData.videos || [];

        const updatedVideos = videos.filter(video => video.videoId !== videoId);

        await setDoc(taggedVideosRef, {
          videos: updatedVideos,
        });

        // Check if the videos array becomes empty
        if (updatedVideos.length === 0) {
          // Remove the tag if the videos array is empty
          await deleteDoc(taggedVideosRef);
        }

        // set tags again
        await setTags();
        console.log('Deleted tag and video');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const blockVideo = async () => {
    setBlocking(true);

    const vidData = {
      videoId: props.videoId,
      videoTitle: props.videoTitle,
      channel: props.channel,
      thumbnail: props.thumbnail,
      check: false,
    };

    await setDoc(doc(db, 'blocked', vidData.videoId), vidData);
    setBlocking(false);
    alert('Added to block list');
  };

  const setTags = async () => {
    const videoId = props.videoId;
    try {
      const docRef = doc(db, 'VideoTags', videoId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const tags = data.tags || [];
        // SET THE VIDEO DATA WITH WHAT IS PRESENT IN THE DB
        const sortedTags = tags.sort((a, b) => a.localeCompare(b));
        // SET THE VIDEO DATA WITH THE SORTED TAGS
        setTagArr(sortedTags);
      } else {
        setTagArr([])
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // call the setTags function after rendering
    setTags();
  }, []);

  return (
    <View style={[styles.videoCard, styles.shadowEff]}>
      <View style={styles.cardBox}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('VideoScreen', {
              videoId: props.videoId,
              videoTitle: props.videoTitle,
              channel: props.channel,
              navigation: navigation,
            });
          }}>
          <Image
            style={styles.videoImg}
            source={{
              uri: `${props.thumbnail}`,
            }}
          />
        </TouchableOpacity>

        <View style={styles.detailBox}>
          <Text style={styles.title}>{props.videoTitle}</Text>
          <Text style={styles.channelName}>{props.channel}</Text>


        </View>
      </View>

      <View>
        <View style={styles.tagShowBox}>
          {props.check && tagArr.map(tag => {
            return <TagComp tag={tag} key={tag} removeTag={removeTag} />;
          })}

          {
            !props.check && tagArr.map(tag => {
              return <TagCompUser tag={tag} key={tag} />
            })
          }
        </View>
        <View>
          {
            // SHOW ONLY IF THE USER HAS ADMIN STATUS
            props.check && (
              <TouchableOpacity
                style={styles.tagBtn}
                onPress={() => {
                  setOptionStatus(!optionStatus);
                }}>
                <Image
                  style={{ height: 30, width: 10 }}
                  source={imgPath.moreVert}
                />
              </TouchableOpacity>
            )
          }
        </View>
        {optionStatus && (
          <View style={styles.optionBox}>

            <TouchableOpacity
              style={[
                styles.optionList,
                tagShow
                  ? { backgroundColor: 'rgb(0,122,254)' }
                  : {
                    backgroundColor: 'white',
                    borderColor: 'rgb(0,122,254)',
                    borderWidth: 1,
                  },
              ]}
              onPress={() => {
                setTagShow(!tagShow);
              }}>
              <Text
                style={
                  tagShow
                    ? { textAlign: 'center', fontSize: 15, color: 'white' }
                    : {
                      textAlign: 'center',
                      fontSize: 15,
                      color: 'rgb(0,122,254)',
                    }
                }>
                Tag
              </Text>
            </TouchableOpacity>
            {tagShow && (
              <View style={styles.tagBox}>
                <TextInput
                  style={styles.inputTagBox}
                  placeholder="Enter tags"
                  placeholderTextColor="gray"
                  value={tagVal}
                  onChangeText={newText => {
                    setTagVal(newText);
                  }}
                />

                {!isSaving ? (
                  <TouchableOpacity
                    style={styles.tagSaveBtn}
                    onPress={() => {
                      console.log(tagVal + ' is added');
                      addTagToVideo();
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 15,
                        color: 'darkgreen',
                      }}>
                      Save
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.tagSaveBtn}>
                    <ActivityIndicator size="small" color="darkgreen" />
                  </View>
                )}
              </View>
            )}
            <TouchableOpacity
              style={[
                styles.optionList,
                blockShow
                  ? { backgroundColor: 'rgb(0,122,254)' }
                  : {
                    backgroundColor: 'white',
                    borderColor: 'rgb(0,122,254)',
                    borderWidth: 1,
                  },
              ]}
              onPress={() => {
                setBlockShow(!blockShow);
              }}>
              <Text
                style={
                  blockShow
                    ? { textAlign: 'center', fontSize: 15, color: 'white' }
                    : {
                      textAlign: 'center',
                      fontSize: 15,
                      color: 'rgb(0,122,254)',
                    }
                }>
                Block
              </Text>
            </TouchableOpacity>
            {blockShow && (
              <View style={styles.tagBox}>
                {!isBlocking ? (
                  <TouchableOpacity
                    style={styles.blockConfirm}
                    onPress={() => {
                      blockVideo();
                      console.log('Added to block list');
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 15,
                        color: 'rgb(187,47,24)',
                      }}>
                      Confirm
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.blockConfirm}>
                    <ActivityIndicator size="small" color="rgb(187,47,24)" />
                  </View>
                )}
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  videoCard: {
    // borderWidth: 1,
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 20,
    borderRadius: 16,
    padding: 12,
    backgroundColor: 'white',
  },

  shadowEff: {
    shadowColor: 'rgba(0, 0, 0, 0.4)',
    elevation: 20,
  },

  cardBox: {
    flexDirection: 'row',
  },

  videoImg: {
    width: 110,
    height: 110,
    borderRadius: 10,
  },

  detailBox: {
    marginLeft: 15,
    flex: 1, // Add flex: 1 to allow the detailBox to expand
    flexWrap: 'wrap',
  },

  title: {
    fontSize: 15,
    color: 'black',
    marginBottom: 7,
    flexWrap: 'wrap',
    width: '100%',
  },

  channelName: {
    fontSize: 13,
    color: 'grey',
    flexWrap: 'wrap',
    width: '100%',
  },

  tagBtn: {
    alignSelf: 'flex-end',
    height: 30,
    width: 28,
    zIndex: 10,
    alignItems: 'center',
    // backgroundColor: 'yellow'
  },

  optionBox: {
    marginTop: 20,
  },

  optionList: {
    marginHorizontal: 7,
    paddingTop: 4,
    paddingBottom: 6,
    borderRadius: 7,
    marginBottom: 8,
  },

  tagBox: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },

  inputTagBox: {
    paddingVertical: 3,
    color: 'black',
  },

  tagSaveBtn: {
    width: 50,
    alignSelf: 'flex-end',
    borderRadius: 8,
    paddingTop: 3,
    paddingBottom: 5,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'darkgreen',
  },

  blockConfirm: {
    borderRadius: 8,
    width: 100,
    paddingTop: 3,
    paddingBottom: 5,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgb(187,47,24)',
    alignSelf: 'flex-end',
  },

  tagShowBox: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    marginBottom: 0
  },
});

export default Card;
