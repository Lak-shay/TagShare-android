import {
    View,
    Text,
    StyleSheet,

} from 'react-native';
import React from 'react';

const TagComp = props => {
    const { tag } = props;

    return (
        <View style={styles.tagBox}>
            <Text style={{ color: 'black', alignSelf: 'center' }}>{tag}</Text>
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
        marginBottom: 10
    },
});

export default TagComp;
