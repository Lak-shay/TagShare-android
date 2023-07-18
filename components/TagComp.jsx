import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import React, { useState } from 'react';
import imagesPath from '../constants/imagesPath';

const TagComp = props => {
  const { tag, removeTag } = props;
  const [isDeleting, setDeleting] = useState(false);

  const handleRemoveTag = async () => {
    Alert.alert(
      'Confirmation',
      `Are you sure you want to remove the tag "${tag}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              setDeleting(true);
              await removeTag(tag);
              setDeleting(false);

            } catch (error) {
              console.log(error);
            }
          },
        },
      ],
    );

  };

  return (
    <View style={styles.tagBox}>
      <Text style={{ color: 'black', alignSelf: 'center' }}>{tag}</Text>
      {isDeleting ? (
        <ActivityIndicator size={17} color="black" style={{ marginLeft: 5 }} />
      ) : (
        <TouchableOpacity
          style={{ marginLeft: 4 }}
          onPress={() => {
            handleRemoveTag();
          }}>
          <Image
            style={{ width: 20, height: 20 }}
            source={imagesPath.closeIcon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tagBox: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'rgb(190,233,243)',
    marginRight: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
    color: 'darkblue',
    marginBottom: 10,
  },
});

export default TagComp;
