import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import React from 'react';

const VideoScreen = ({route}) => {
  const {videoId} = route.params;
  const {videoTitle} = route.params;
  const {channel} = route.params;
  const {navigation} = route.params;

  return (
    <View>
      <TouchableOpacity
        style={{justifyContent: 'center'}}
        onPress={() => {
          navigation.goBack();
        }}>
        <Text
          style={{
            fontSize: 30,
            marginBottom: 10,
            color: 'rgb(0,122,254)',
            marginHorizontal: 10,
          }}>
          &larr;
        </Text>
      </TouchableOpacity>
      <YoutubePlayer
        height={250}
        width={'100%'}
        videoId={videoId}
        webViewStyle={{
          opacity: 0.99,
          minHeight: 1,
        }}
        style={styles.player}
      />
      <Text style={styles.title}>{videoTitle}</Text>
      <Text style={styles.channel}>{channel}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  player: {
    // marginVertical: 50,
  },
  title: {
    color: 'black',
    marginHorizontal: 10,
    marginVertical: 5,
    fontSize: 18,
  },

  channel: {
    marginHorizontal: 10,
    fontSize: 16,
    color: 'gray',
  },
});

export default VideoScreen;
