import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Linking,
  Alert,
  AppRegistry,
  StatusBar,
  Button,
  ActivityIndicator,
} from 'react-native';
import {
  accelerometer,
  magnetometer,
  gyroscope,
  barometer,
} from 'react-native-sensors';
import GetLocation from 'react-native-get-location';
import CustomButton from '../components/CustomButton';
import BackgroundJob from 'react-native-background-actions';
import {setUpdateIntervalForType, SensorTypes} from 'react-native-sensors';
import 'intl';
import 'intl/locale-data/jsonp/en-US';
import {name as appName} from './app.json';

const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));

import Realm from 'realm';
const TaskSchema = {
  name: 'senData',
  properties: {
    time_stamp: 'int',
    ax: 'string',
    ay: 'string',
    az: 'string',
    gx: 'string',
    gy: 'string',
    gz: 'string',
    mx: 'string',
    my: 'string',
    mz: 'string',
    lat: 'string',
    lng: 'string',
    p: 'string',
    s: 'string',
  },
  primaryKey: 'time_stamp',
};

const HomeScreen = () => {
  const [realm, setRealm] = React.useState(null);
  const [tasks, setTasks] = React.useState([]);

  const ax = useRef(0.0);
  const ay = useRef(0.0);
  const az = useRef(0.0);
  const gx = useRef(0.0);
  const gy = useRef(0.0);
  const gz = useRef(0.0);
  const mx = useRef(0.0);
  const my = useRef(0.0);
  const mz = useRef(0.0);

  const p = useRef(0.0);
  const lat = useRef(0.0);
  const lng = useRef(0.0);

  useEffect(() => {
    (async () => {
      const realm = await Realm.open({
        path: 'myrealm',
        schema: [TaskSchema],
      }).then(realm => {
        const tasks = realm.objects('senData');
        setRealm(realm);
      });
    })();
  }, []);

  BackgroundJob.on('expiration', () => {
    console.log('iOS: I am being closed!');
  });

  const StoreData = () => {
    try {
      //console.log(Date.now() + "");
      realm.write(() => {
        var task1 = realm.create('senData', {
          time_stamp: Date.now(),
          ax: ax.current + '',
          ay: ay.current + '',
          az: az.current + '',
          gx: gx.current + '',
          gy: gy.current + '',
          gz: gz.current + '',
          mx: mx.current + '',
          my: my.current + '',
          mz: mz.current + '',
          lat: lat.current + '',
          lng: lng.current + '',
          p: p.current + '',
          s: '0',
        });
        //console.log(task1);
      });
    } catch (Error) {
      console.log(Error);
    }
    const tasks = realm.objects('senData');
  };

  const taskRandom = async taskData => {
    if (Platform.OS === 'ios') {
      console.warn(
        'This task will not keep your app alive in the background by itself, use other library like react-native-track-player that use audio,',
        'geolocalization, etc. to keep your app alive in the background while you excute the JS from this library.',
      );
    }
    await new Promise(async resolve => {
      const {delay} = taskData;
      console.log(BackgroundJob.isRunning(), delay);

      setUpdateIntervalForType(SensorTypes.accelerometer, delay);
      setUpdateIntervalForType(SensorTypes.magnetometer, delay);
      setUpdateIntervalForType(SensorTypes.gyroscope, delay);
      setUpdateIntervalForType(SensorTypes.barometer, delay);

      try {
        const subscription_acc = accelerometer.subscribe(
          ({x, y, z, timestamp}) => {
            ax.current = x;
            ay.current = y;
            az.current = z;
            // let date = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(timestamp);
          },
        );
      } catch (error) {}

      try {
        const subscription_mag = magnetometer.subscribe(
          ({x, y, z, timestamp}) => {
            mx.current = x;
            my.current = y;
            mz.current = z;
          },
        );
      } catch (error) {}

      try {
        const subscription_gyr = gyroscope.subscribe(({x, y, z, timestamp}) => {
          gx.current = x;
          gy.current = y;
          gz.current = z;
          //console.log({x, y, z, timestamp});
          //storeData(timestamp.toString(), 0, 0, 0, 0, 0, 0, x.toString(), y.toString(), z.toString(), 0, 0, 0);
        });
      } catch (error) {}

      // try {
      //    const subscription_bar = barometer.subscribe(({pressure, timestamp}) => {
      //    p.current = pressure;
      //    //console.log({pressure, timestamp});
      //    //storeData(timestamp.toString(), 0, 0, 0, 0, 0, 0, 0, 0, 0, pressure, 0, 0, 0);
      //  });
      // } catch (error) {
      // }

      for (let i = 0; BackgroundJob.isRunning(); i++) {
        await BackgroundJob.updateNotification({taskDesc: 'Runned -> ' + i});
        if (i % 50 == 0) {
          console.log('Before req loc');
          _requestLocation();
          console.log('After req loc');
        }
        console.log('Before store data');
        StoreData();
        console.log('After store loc');
        await sleep(delay);
      }
    });
  };

  const options = {
    taskName: 'MyPath',
    taskTitle: 'MyPath',
    taskDesc: 'MyPath background service is running',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: 'exampleScheme://chat/jane',
    parameters: {
      delay: 20,
    },
  };

  const toggleBackground = async state => {
    if (state) {
      try {
        console.log('Trying to start background service');
        await BackgroundJob.start(taskRandom, options);
        console.log('Successful start!');
      } catch (e) {
        console.log('Error', e);
      }
    } else {
      console.log('Stop background service');
      await BackgroundJob.stop();
    }
  };

  //const allObjs = realm.objects("sendata");
  const [text, setText] = useState('Initial text');
  const onPressHandler = event => {
    const tasks = realm.objects('senData');
    //console.log(`The lists of tasks are: ${tasks.map((task) => task.lng)}`);
    setText('Total entry : ' + tasks.length);
  };

  //=======================
  //const [realm, setRealm] = React.useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = React.useState(null);

  _requestLocation = (teste = '') => {
    setLoading(true);
    setLocation(null);

    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 5000,
    })
      .then(location => {
        setLocation(location);
        //var loc = JSON.stringify(location, 0, 2);
        lat.current = location.latitude;
        lng.current = location.longitude;
        //console.log(location.latitude + "    " + location.longitude);
        setLoading(false);
      })
      .catch(ex => {
        const {code, message} = ex;
        console.warn(code, message);
        if (code === 'CANCELLED') {
          //Alert.alert('Location cancelled by user or by another request');
        }
        if (code === 'UNAVAILABLE') {
          //Alert.alert('Location service is disabled or unavailable');
        }
        if (code === 'TIMEOUT') {
          //Alert.alert('Location request timed out');
        }
        if (code === 'UNAUTHORIZED') {
          //Alert.alert('Authorization denied');
        }

        setLocation(null);
        setLoading(false);
      });
  };

  //=======================

  //<CurrentLocation state={state} dispatch={dispatch} />
  const [isRunning, setIsRunning] = useState(true);
  return (
    <View style={styles.container}>
      {/* <Text>
        {' '}
        Acc x:
        {ax.current.toFixed(5) +
          ' y:' +
          ay.current.toFixed(5) +
          ' z:' +
          az.current.toFixed(5)}{' '}
      </Text>
      <Text>
        {' '}
        Mag x:
        {mx.current.toFixed(5) +
          ' y:' +
          my.current.toFixed(5) +
          ' z:' +
          mz.current.toFixed(5)}{' '}
      </Text>
      <Text>
        {' '}
        Gyr x:
        {gx.current.toFixed(5) +
          ' y:' +
          gy.current.toFixed(5) +
          ' z:' +
          gz.current.toFixed(5)}{' '}
      </Text>
      <Text>
        {' '}
        Location Lat:{' '}
        {lat.current.toFixed(9) + ' lng: ' + lng.current.toFixed(9)}{' '}
      </Text> */}

      <Text>{text}</Text>

      <Button
        title={isRunning ? 'Start Logging' : 'Stop Logging'}
        type="Success"
        onPress={() => {
          toggleBackground(isRunning);
          setIsRunning(!isRunning);
          onPressHandler();
        }}
      />

      <Text />
      {/* <Button
        disabled={loading}
        title="Get Location"
        onPress={_requestLocation}
      />

      {loading ? <ActivityIndicator /> : null}
        {location ? (
          <Text style={styles.location}>{JSON.stringify(location, 0, 2)}</Text>
        ) : null} */}

      <Button
        title="Total entry (Click to update)"
        type="Success"
        onPress={() => {
          onPressHandler();
        }}
      />

      <Text />
      <Text style={styles.red}>
        To log location data you must have to set location access permission to
        == "Allow all the time"==.
      </Text>
      <Button
        title="Change Location Access Permission"
        type="Error"
        onPress={() => Linking.openSettings()}
      />
      <StatusBar barStyle="dark-content" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    marginTop: 50,
  },
  headline: {
    fontSize: 30,
    textAlign: 'left',
    margin: 10,
  },
  valueContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  valueValue: {
    width: 200,
    fontSize: 20,
  },
  valueName: {
    width: 50,
    fontSize: 20,
    fontWeight: 'bold',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  location: {
    color: '#333333',
    marginBottom: 5,
  },
  steelblue: {
    color: 'steelblue',
  },
  red: {
    color: 'red',
  },
});
export default HomeScreen;

// import React from 'react';
// import {View, Text, Button, StyleSheet, StatusBar} from 'react-native';
// import {useTheme} from '@react-navigation/native';

// const HomeScreen = ({navigation}) => {
//   const {colors} = useTheme();
//   const theme = useTheme();

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
//       <Text style={{color: colors.text}}>Home Screen</Text>
//       <Button
//         title="Go to details screen"
//         onPress={() => navigation.navigate('Details')}
//       />
//     </View>
//   );
// };

// export default HomeScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
