import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

import BackgroundTimer from 'react-native-background-timer';


const ProfileScreen = () => {

    const onPressHandler = () => {
      // Start a timer that runs continuous after X milliseconds
      BackgroundTimer.setInterval(() => {
        // this will be executed every 200 ms
        // even when app is the the background
        console.log('tic');
      }, 200);
    };



    return (
      <View style={styles.container}>
        <Text>Profile Screen</Text>
        <Button
          title="Click Here"
          onPress={() => alert('Button Clicked!')}
        />
        <Button
          title={'test'}
          type="Success"
          onPress={() => {
            onPressHandler();
        }}
        />
      </View>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
});
