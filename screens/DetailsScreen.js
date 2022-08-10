import React, {useState, useEffect, useRef} from 'react';
import { Alert, Button, Text, StyleSheet, View, Platform, SafeAreaView, PermissionsAndroid, StatusBar, Linking} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import TimePicker from 'react-native-simple-time-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomButton from '../components/CustomButton';
import * as RNFS from 'react-native-fs';
import Card from './Card';
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob'
import * as ScopedStorage from 'react-native-scoped-storage';

import Realm from 'realm';
const TaskSchema = {
  name: 'senData',
  properties: {
    time_stamp : 'int',
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


const DetailsScreen = () => {

  const navigation = useNavigation();

  const [dateStart, setDateStart] = useState(new Date(Date.now()-10000000));
  const [dateEnd, setDateEnd] = useState(new Date(Date.now()));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [startTimeMode, setStartTimeMode] = useState(true);
  const [enableExportBtn, setEnableExportBtn] = useState(false);


  const [realm, setRealm] = React.useState(null);
  const [tasks, setTasks] = React.useState([]);


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



  const [text, setText] = useState("Select a date/time interval");
  const CheckDataAvailibility = event => {
     const availableData = realm.objects("senData").filtered(
       dateStart.getTime() + " <= time_stamp && time_stamp <= " + dateEnd.getTime()
     );

     if(availableData.length > 0)
     {
      setText("Total available " + availableData.length + " entry to export");
      setEnableExportBtn(true);
     }else{
      setText("No data available");
      setEnableExportBtn(false);
     }
  }


  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    if(startTimeMode)
    {
      setDateStart(currentDate);
    }else{
      setDateEnd(currentDate);
    }
  };


  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };


  //=============================================================================



  const ViewData = async () => {

    const availableData = realm.objects("senData").filtered(
      dateStart.getTime() + " <= time_stamp && time_stamp <= " + dateEnd.getTime()
    );
    console.log(`The lists of tasks are: ${availableData.map((availableD) => availableD.time_stamp)}`);
      console.log(typeof availableData);
    //var path = '/storage/emulated/0/Android/data/com.mypath/files' + '/';
    var textData = "time_stamp, ax, ay, az, gx, gy, gz, mx, my, mz, lat, lng, p" + '\n';

    for (var i = 0;  i < availableData.length ; i++) {
      //console.log(availableData[i].time_stamp);
       textData += availableData[i].time_stamp +"," + availableData[i].ax + "," + availableData[i].ay + "," +  availableData[i].az + ","
               + availableData[i].gx + "," + availableData[i].gy + "," +  availableData[i].gz + "," + availableData[i].mx + "," + availableData[i].my + "," 
               +  availableData[i].mz + "," + availableData[i].lat + "," + availableData[i].lng + "," + availableData[i].p + "\n";
    }

    var path = '/storage/emulated/0/Android/data/com.mypath/files' + '/';
    if (Platform.OS === 'ios') {
      path = RNFS.DocumentDirectoryPath + '/';

      var fileLoc = path + "MyPath_"+ Date.now() +".csv";
      RNFS.writeFile(fileLoc, textData, 'utf8')
        .then((success) => {
          console.log('FILE WRITTEN!');
          Alert.alert("Done!",
            "Location : " + fileLoc,
            [
            {style: 'destructive'},
            {text: 'Ok'},
            ],
            {cancelable: false}
          )
        })
        .catch((err) => {
          console.log(err.message);
          Alert.alert("Failed for version or permission...!",
            "Location : " + fileLoc,
            [
            {style: 'destructive'},
            {text: 'Ok'},
            ],
            {cancelable: false}
          );
        });
    }else{
      try {
            const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: "MyPath needs permnission to save file",
              message:
                "MyPath App needs access to your file system " +
                "so you can export data",
              // buttonNeutral: "Ask Me Later",
              // buttonNegative: "Cancel",
              buttonPositive: "Allow"
            });
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              // Your Save flow
            }

            path = RNFS.ExternalStorageDirectoryPath + '/';



            await ScopedStorage.createDirectory("/storage/emulated/0/", "MyPath").then((success) => {
            console.log("successful directory creation!")
            createFile(textData)
            }).catch((err) => {
              console.log(err.message);
            });

        } catch (e) {
          console.log(e);
        }
    }
    

    // var fileLoc = path + "MyPath_"+ Date.now() +".csv";
    // RNFS.writeFile(fileLoc, textData, 'utf8')
    //   .then((success) => {
    //     console.log('FILE WRITTEN!');
    //     Alert.alert("Done!",
    //       "Location : " + fileLoc,
    //       [
    //       {style: 'destructive'},
    //       {text: 'Ok'},
    //       ],
    //       {cancelable: false}
    //     )
    //   })
    //   .catch((err) => {
    //     console.log(err.message);
    //     Alert.alert("Failed for android version or permission...!",
    //       "Location : " + fileLoc,
    //       [
    //       {style: 'destructive'},
    //       {text: 'Ok'},
    //       ],
    //       {cancelable: false}
    //     );
    //   });
  };

  async function createFile(textData){
    //console.log(textData)
    await ScopedStorage.writeFile("/storage/emulated/0/MyPath/", textData, Date.now() + ".csv", "text/csv", "utf8").then((success) => {
      var fileLoc = "/storage/emulated/0/MyPath/" + Date.now() + ".csv"
      Alert.alert("Done!",
        "Location : " + fileLoc,
        [
          { style: 'destructive' },
          { text: 'Cancel' },
        ],
        { cancelable: false }
      )
    })
      .catch((err) => {
        console.log(err.message);
      });
  }

  return (
    <View style={styles.container}>
      <Card style={{ height: 160, width: '100%' ,backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center',position: 'absolute', top: 10}} >
        <View>
          <CustomButton
          text="Select Start Date!"
          onPress={() => {
            setStartTimeMode(true);
            showDatepicker();
          }}
          type="SECONDARY"
          />
        </View>
        <View>
          <CustomButton
          text="Select Start Time!"
          onPress={() => {
            setStartTimeMode(true);
            showTimepicker();}
          }
          type="SECONDARY"
          />
        </View>
        <Text>selected: {dateStart.toLocaleString()}</Text>
      </Card>

      <View style={styles.space} />
      
      <Card style={{ height: 160, width: '100%' ,backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center',position: 'absolute', top: 180}} >
        <View>
          <CustomButton
          text="Select End Date!"
          onPress={() => 
            {
              setStartTimeMode(false);
              showDatepicker();
            }}
          type="SECONDARY"
          />
        </View>
        <View>
          <CustomButton
          text="Select End Time!"
          onPress={() => 
            {
              setStartTimeMode(false);
              showTimepicker();
            }}
          type="SECONDARY"
          />
        </View>
        <Text>selected: {dateEnd.toLocaleString()}</Text>
      </Card>

      <View style={{position: 'absolute', bottom: 70}}>
        <Text>{text}</Text>
        <View>
          <Button onPress={CheckDataAvailibility} title="Check data availability" />
        </View>
        <View>
          <Button
          disabled = {!enableExportBtn}
          onPress={ViewData}
          title="Export data" />
        </View>
      </View>

        <View style={{position:'absolute', bottom: 0}}>
          <Text style={styles.red}>
            To export data you must have to files and media access permission to
            == "Allow management of all files"==.
          </Text>
          <Button
            title="Change Files and media Access Permission"
            type="Error"
            color="#FAA27F"
            onPress={() => Linking.openSettings()}
          />
        </View>



      <View style={styles.space} />
      <View style={styles.space} />
      <View style={styles.space} />
      <View style={styles.space} />
      <View style={styles.space} />
      <View style={styles.space} />
      {show && (
      <DateTimePicker 
          style={{width:'100%'}}
          value={dateStart}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
           />
      )}
    </View>
    
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 30,
  },
  space: {
    width: 20,
    height: 20,
  },
  displaytext: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 60,
    width: '100%',
  },
  colmDisplay: {
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'space-evenly',
  },
});




// import React from 'react';
// import { View, Text, Button, StyleSheet } from 'react-native';

// const DetailsScreen = ({navigation}) => {
//     return (
//       <View style={styles.container}>
//         <Text>Details Screen</Text>
//         <Button
//             title="Go to details screen...again"
//             onPress={() => navigation.push("Details")}
//         />
//         <Button
//             title="Go to home"
//             onPress={() => navigation.navigate("Home")}
//         />
//         <Button
//             title="Go back"
//             onPress={() => navigation.goBack()}
//         />
//       </View>
//     );
// };

// export default DetailsScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1, 
//     alignItems: 'center', 
//     justifyContent: 'center'
//   },
// });
