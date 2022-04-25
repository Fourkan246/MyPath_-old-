import React, {useState, useEffect, useRef} from 'react';
import { Alert, Button, Text, StyleSheet, View, SafeAreaView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import TimePicker from 'react-native-simple-time-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomButton from '../components/CustomButton';
import * as RNFS from 'react-native-fs';
import Card from './Card';


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

  const [dateStart, setDateStart] = useState(new Date(1647408851080));
  const [dateEnd, setDateEnd] = useState(new Date(1647401188529));
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

  const ViewData = () => {

    // require the module
   

    // create a path you want to write to
    // :warning: on iOS, you cannot write into `RNFS.MainBundlePath`,
    // but `RNFS.DocumentDirectoryPath` exists on both platforms and is writable
    var path = RNFS.LibraryDirectoryPath + '/test.txt';

    // write the file
    RNFS.writeFile(path, 'Lorem ipsum dolor sit amet', 'utf8')
      .then((success) => {
        console.log('FILE WRITTEN!' + path);
        Alert.alert("Done!",
          "Location : " + path,
          [
          {style: 'destructive'},
          {text: 'Cancel'},
          ],
          {cancelable: false}
        )
      })
      .catch((err) => {
        console.log(err.message);
      });






    const availableData = realm.objects("senData").filtered(
      dateStart.getTime() + " <= time_stamp && time_stamp <= " + dateEnd.getTime()
    );
    console.log(`The lists of tasks are: ${availableData.map((availableD) => availableD.time_stamp)}`);
      console.log(typeof availableData);
    var path = '/storage/emulated/0/Android/data/com.mypath/files' + '/';
    var textData = "time_stamp, ax, ay, az, gx, gy, gz, mx, my, mz, lat, lng, p" + '\n';

    for (var i = 0;  i < availableData.length ; i++) {
      //console.log(availableData[i].time_stamp);
       textData += availableData[i].time_stamp +"," + availableData[i].ax + "," + availableData[i].ay + "," +  availableData[i].az + ","
               + availableData[i].gx + "," + availableData[i].gy + "," +  availableData[i].gz + "," + availableData[i].mx + "," + availableData[i].my + "," 
               +  availableData[i].mz + "," + availableData[i].lat + "," + availableData[i].lng + "," + availableData[i].p + "\n";
    }


    var fileLoc = path + Date.now() +".csv";
    RNFS.appendFile(fileLoc, textData, 'utf8')
        .then((success) => {
        console.log('FILE WRITTEN!');
        Alert.alert("Done!",
          "Location : " + fileLoc,
          [
          {style: 'destructive'},
          {text: 'Cancel'},
          ],
          {cancelable: false}
        )
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  


  return (
    <View style={styles.container}>
      <Card style={{ height: 180, width: '100%' ,backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center',position: 'absolute', top: 10}} >
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
      
      <Card style={{ height: 180, width: '100%' ,backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center',position: 'absolute', top: 200}} >
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

      <View style={{position: 'absolute', bottom: 15}}>
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

      {/* <View>
        <Button
        disabled = {!enableExportBtn}
        onPress={() => navigation.navigate('MapViewScene')}
        title="View path on map" />
      </View> */}
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


        // <View>
        //   <DateTimePicker
        //     styke={{width:'100%'}}
        //     testID="dateTimePicker"
        //     value={dateStart}
        //     mode={mode}
        //     is24Hour={true}
        //     onChange={onChange}
        //   />
        // </View>
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
