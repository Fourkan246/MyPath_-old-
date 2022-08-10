import React, { useCallback, useState, useEffect, useRef} from 'react';
import {
 StyleSheet,
 Text,
 PermissionsAndroid,
 ToastAndroid,
 View,
 Platform,
 Linking,
 Alert,
 AppRegistry,
 StatusBar,
 Button,
 ActivityIndicator,
 TouchableWithoutFeedback
} from 'react-native';
import {
 accelerometer,
 magnetometer,
 gyroscope,
 barometer,
} from 'react-native-sensors';
 
 
import BackgroundTimer from 'react-native-background-timer';
import Geolocation from 'react-native-geolocation-service';
import VIForegroundService from 'react-native-foreground-service';
 
 
import GetLocation from 'react-native-get-location';
import CustomButton from '../components/CustomButton';
import BackgroundJob from 'react-native-background-actions';
import {setUpdateIntervalForType, SensorTypes} from 'react-native-sensors';
import 'intl';
import 'intl/locale-data/jsonp/en-US';
import {name as appName} from './app.json';
import Card from './Card';
const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));
 
import {setJSExceptionHandler, getJSExceptionHandler, setNativeExceptionHandler} from 'react-native-exception-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
 
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
 //===============================================
 //===============================================
  const [forceLocation, setForceLocation] = useState(true);
 const [highAccuracy, setHighAccuracy] = useState(true);
 const [locationDialog, setLocationDialog] = useState(true);
 const [significantChanges, setSignificantChanges] = useState(false);
 const [observing, setObserving] = useState(false);
 const [foregroundService, setForegroundService] = useState(false);
 const [useLocationManager, setUseLocationManager] = useState(false);
 const [location_new, setLocation_new] = useState(null);
 const watchId = useRef(null);
 const [backgroundTimerId, setBackgroundTimerId] = useState(0)
 
 
 
 //===============================================
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
 
 useEffect(() => {
   return () => {
     removeLocationUpdates();
   };
 }, [removeLocationUpdates]);

  useEffect(() => {
      DataRestore();
  }, []);


 
 
 
 const onBackTest = async () => {
   setUpdateIntervalForType(SensorTypes.accelerometer, 20);
   setUpdateIntervalForType(SensorTypes.magnetometer, 20);
   setUpdateIntervalForType(SensorTypes.gyroscope, 20);
   setUpdateIntervalForType(SensorTypes.barometer, 20);
 
   // Start a timer that runs continuous after X milliseconds
   const intervalId = BackgroundTimer.setInterval(() => {
     // this will be executed every 20 ms
     // even when app is the the background
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
 
     //console.log('tic');
     StoreData();
   }, 20);
 
   setBackgroundTimerId(intervalId);
 };
 
 const StopBackgroundTimer = () =>
 {
     BackgroundTimer.stop();
     BackgroundTimer.clearInterval(backgroundTimerId);
 }
 
 const hasPermissionIOS = async () => {
   const openSetting = () => {
     Linking.openSettings().catch(() => {
       Alert.alert('Unable to open settings');
     });
   };
   const status = await Geolocation.requestAuthorization('whenInUse');
 
   if (status === 'granted') {
     return true;
   }
 
   if (status === 'denied') {
     Alert.alert('Location permission denied');
   }
 
   if (status === 'disabled') {
     Alert.alert(
       `Turn on Location Services to allow "${appConfig.displayName}" to determine your location.`,
       '',
       [
         { text: 'Go to Settings', onPress: openSetting },
         { text: "Don't Use Location", onPress: () => {} },
       ],
     );
   }
 
   return false;
 };
 
 const hasLocationPermission = async () => {
   if (Platform.OS === 'ios') {
     const hasPermission = await hasPermissionIOS();
     return hasPermission;
   }
 
   if (Platform.OS === 'android' && Platform.Version < 23) {
     return true;
   }
 
   const hasPermission = await PermissionsAndroid.check(
     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
   );
 
   if (hasPermission) {
     return true;
   }
 
   const status = await PermissionsAndroid.request(
     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
   );
 
   if (status === PermissionsAndroid.RESULTS.GRANTED) {
     return true;
   }
 
   if (status === PermissionsAndroid.RESULTS.DENIED) {
     ToastAndroid.show(
       'Location permission denied by user.',
       ToastAndroid.LONG,
     );
   } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
     ToastAndroid.show(
       'Location permission revoked by user.',
       ToastAndroid.LONG,
     );
   }
 
   return false;
 };
 
 // const getLocation = async () => {
 //   const hasPermission = await hasLocationPermission();
 //   console.log("check perm");
 //   if (!hasPermission) {
 //     return;
 //   }
 
 //   Geolocation.getCurrentPosition(
 //     (position) => {
 //       setLocation_new(position);
 //       console.log(position);
 //     },
 //     (error) => {
 //       Alert.alert(`Code ${error.code}`, error.message);
 //       setLocation_new(null);
 //       console.log(error);
 //     },
 //     {
 //       accuracy: {
 //         android: 'high',
 //         ios: 'best',
 //       },
 //       enableHighAccuracy: highAccuracy,
 //       timeout: 15000,
 //       maximumAge: 10000,
 //       distanceFilter: 0,
 //       forceRequestLocation: forceLocation,
 //       forceLocationManager: useLocationManager,
 //       showLocationDialog: locationDialog,
 //     },
 //   );
 // };
 
 const getLocationUpdates = async () => {
   const hasPermission = await hasLocationPermission();
   if (!hasPermission) {
     return;
   }
 
   if (Platform.OS === 'android' && foregroundService) {
     await startForegroundService();
   }
 
   setObserving(true);
 
   watchId.current = Geolocation.watchPosition(
     (position) => {
       setLocation_new(position);
       console.log(position);
       lat.current = position.coords.latitude;
       lng.current = position.coords.longitude;
     },
     (error) => {
       setLocation_new(null);
       console.log(error);
     },
     {
       accuracy: {
         android: 'high',
         ios: 'best',
       },
       enableHighAccuracy: highAccuracy,
       distanceFilter: 0,
       interval: 7000,
       fastestInterval: 3500,
       forceRequestLocation: forceLocation,
       forceLocationManager: useLocationManager,
       showLocationDialog: locationDialog,
       useSignificantChanges: significantChanges,
     },
   );
 };
 
 const removeLocationUpdates = useCallback(() => {
   if (watchId.current !== null) {
     Geolocation.clearWatch(watchId.current);
     watchId.current = null;
     setObserving(false);
     stopForegroundService();
   }
 }, [stopForegroundService]);
 
 const startForegroundService = async () => {
   if (Platform.Version >= 26) {
     await VIForegroundService.createNotificationChannel({
       id: 'locationChannel',
       name: 'Location Tracking Channel',
       description: 'Tracks location of user',
       enableVibration: false,
     });
   }
 
   return VIForegroundService.startService({
     channelId: 'locationChannel',
     id: 420,
     title: appConfig.displayName,
     text: 'Tracking location updates',
     icon: 'ic_launcher',
   });
 };
 
 const stopForegroundService = useCallback(() => {
   VIForegroundService.stopService().catch((err) => err);
 }, []);
 
 BackgroundJob.on('expiration', () => {
   console.log('iOS: I am being closed!');
 });
 
const taskRandom = async (taskData) => {
     if (Platform.OS === 'ios') {
         console.warn(
             'This task will not keep your app alive in the background by itself, use other library like react-native-track-player that use audio,',
             'geolocalization, etc. to keep your app alive in the background while you excute the JS from this library.'
         );
     }
 
     await new Promise(async (resolve) => {
         const { delay } = taskData;
         console.log(BackgroundJob.isRunning(), 20)
        
         setUpdateIntervalForType(SensorTypes.accelerometer, 20);
         setUpdateIntervalForType(SensorTypes.magnetometer, 20);
         setUpdateIntervalForType(SensorTypes.gyroscope, 20);
         setUpdateIntervalForType(SensorTypes.barometer, 20);
 
         try {
           const subscription_acc = accelerometer.subscribe(({x, y, z, timestamp}) => {
             ax.current = x;
             ay.current = y;
             az.current = z;
             // let date = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(timestamp);
           });
         } catch (error) {
          
         }
        
         try {
           const subscription_mag = magnetometer.subscribe(({x, y, z, timestamp}) => {
             mx.current = x;
             my.current = y;
             mz.current = z;
           });
         } catch (error) {
          
         }
 
         try {
           const subscription_gyr = gyroscope.subscribe(({x, y, z, timestamp}) => {
             gx.current = x;
             gy.current = y;
             gz.current = z;
             //console.log({gx, gy, gz, timestamp});
             //storeData(timestamp.toString(), 0, 0, 0, 0, 0, 0, x.toString(), y.toString(), z.toString(), 0, 0, 0);
           });
         } catch (error) {
          
         }
 
         // try {
         //    const subscription_bar = barometer.subscribe(({pressure, timestamp}) => {
         //    p.current = pressure;
         //    //console.log({pressure, timestamp});
         //    //storeData(timestamp.toString(), 0, 0, 0, 0, 0, 0, 0, 0, 0, pressure, 0, 0, 0);
         //  });
         // } catch (error) {
         // }
 
         for (let i = 0; BackgroundJob.isRunning(); i++) {
           //await BackgroundJob.updateNotification({ taskDesc: 'Runned -> ' + i });
           if(i%200 == 0){
             _requestLocation();
           }
           StoreData();
           await sleep(20);
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
     //console.log(Error);
   }
   const tasks = realm.objects('senData');
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
 
     // subscription_acc.unsubscribe();
     // subscription_mag.unsubscribe();
     // subscription_gyr.unsubscribe();
   }
 };
 
 //const allObjs = realm.objects("sendata");
 const [text, setText] = useState('');
 const onPressHandler = event => {
   const tasks = realm.objects('senData');
   //console.log(`The lists of tasks are: ${tasks.map((task) => task.lng)}`);
   setText('(Total entry : ' + tasks.length + ')');
 };
 
 //=======================
 //const [realm, setRealm] = React.useState(null);
 const [loading, setLoading] = useState(false);
 const [location, setLocation] = React.useState(null);
 
 _requestLocation = (teste = '') => {
   setLoading(true);
   setLocation(null);
   console.log("inside back 2");
 
   GetLocation.getCurrentPosition({
     enableHighAccuracy: true,
     timeout: 5000,
   })
     .then(location => {
       console.log("set loc");
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
 
  const setStatus = async (runningStatus) => {
    try {
      if(runningStatus == true)
      {
        await AsyncStorage.setItem("isRunning", "true");
        console.log("Save status ---- true");
      }else{
        await AsyncStorage.setItem("isRunning", "false");
        console.log("Save status ---- false");
      }
        //alert('Data successfully saved')
    } catch (e) {
        alert('Failed to save the data to the storage')
    }
  }

  const DataRestore = async () => {
    try {
        const statusRun = await AsyncStorage.getItem("isRunning");
        if (statusRun !== null) {
            let res = JSON.parse(statusRun);
            setIsRunning(res);
            console.log("status run: " + statusRun);
        }else{
            console.log("else status run: " + statusRun);
        }
    }catch (e) {
        //alert('Failed to sync user name');
        console.log("catch status: ");
    }
  };

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
 
 
 
     {!isRunning?
       <Card style={{ height: 75, width: '100%' ,backgroundColor: '#5fdba7', justifyContent: 'center', alignItems: 'center',position: 'absolute', top: 0}} >
         <Text style={{fontSize: 20}}>Running</Text>
       </Card> : <Card style={{ height: 75, width: '100%' ,backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center',position: 'absolute', top: 0}} >
         <Text style={{fontSize: 20}}>Stopped</Text>
       </Card>
     }
 
     <Text />
     <Text />
     <Text/>
 
 
     <Card style={{ height: 70, width: '40%' ,backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center'}} >
         {/* {isRunning ?
           <Text style={{ fontSize: 30 }}>START</Text>
           : <Text style={{ fontSize: 30 }}>STOP</Text>
         } */}
       <TouchableWithoutFeedback
         onPress={() => {
           //getLocationUpdates();
           //onPressHandler();
 
           setIsRunning(!isRunning);

           if (Platform.OS === 'ios'){
             if(!observing)
             {
               getLocationUpdates();
               onBackTest();
             }else{
               removeLocationUpdates();
               StopBackgroundTimer();
 
               // subscription_acc.unsubscribe();
               // subscription_mag.unsubscribe();
               // subscription_gyr.unsubscribe();
               //BackgroundTimer.clearInterval(backgroundTimerId);
             }
           }else{
            
             toggleBackground(isRunning);
             setStatus(!isRunning);
           }
       }}
         title={isRunning ? 'Start' : 'Stop'}
       >
         {isRunning ?
           <Text style={{ fontSize: 30 }}>START</Text>
           : <Text style={{ fontSize: 30 }}>STOP</Text>
         }
       </TouchableWithoutFeedback>
     </Card>
     <Text/>
     <Text>{text}</Text>
 
 
     {/* <TouchableWithoutFeedback
       onPress={() => {
         onPressHandler();
     }}
     >
     <Text style={{ fontSize: 20 }}>Report Barrier</Text>
     </TouchableWithoutFeedback>
     <Text/>
     <TouchableWithoutFeedback
       onPress={() => {
         onPressHandler();
     }}
     >
       <Text style={{ fontSize: 20 }}>Report Facility</Text>
     </TouchableWithoutFeedback> */}
 
     {/* <Button
       title="Total entry (Click to update)"
       type="Success"
       onPress={() => {
         onPressHandler();
       }}
     /> */}
 
     <Text />
     <View style={{position:'absolute', bottom: 0}}>
       <Text style={styles.red}>
         To log location data you must have to set location access permission to
         == "Allow all the time"==.
       </Text>
       <Button
         title="Change Location Access Permission"
         type="Error"
         color="#FAA27F"
         onPress={() => Linking.openSettings()}
       />
       <StatusBar barStyle="dark-content" />
       <Text/>
     </View>
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
 card: {
   height: 100, width: '100%' ,backgroundColor: '#5fdba7', justifyContent: 'center', alignItems: 'center',position: 'absolute', top: 0
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
 

