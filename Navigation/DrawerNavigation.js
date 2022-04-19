import * as React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MyPath from '../MyPath';
import UserInfoDisplay from '../Screens/User/UserInfoDisplay';
import UserInfoEdit from '../Screens/User/UserInfoEdit';
import TransportationInfoDisplay from '../Screens/Transportation/TransportationInfoDisplay';
import TransportationInfoEdit from '../Screens/Transportation/TransportationInfoEdit';
import AccountInfoDisplay from '../Screens/Account/AccountInfoDisplay';
import ChangeEmail from '../Screens/InfoEdit/ChangeEmail';
import ChangePassword from '../Screens/InfoEdit/ChangePassword';
import ChangeUsername from '../Screens/InfoEdit/ChangeUsername';
//import MaterialCommunityIcons from '../assets/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf';
//import AntDesign from '../assets/react-native-vector-icons/Fonts/AntDesign.ttf';
//import FontAwesome5 from '../assets/react-native-vector-icons/Fonts/FontAwesome5_Regular.ttf';
//import FontAwesome from '../assets/react-native-vector-icons/Fonts/FontAwesome.ttf';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const NavigationDrawerStructure = props => {
  const toggleDrawer = () => {
    //Opens and closes the drawer
    props.navigationProps.toggleDrawer();
  };

  return (
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity onPress={() => toggleDrawer()}>
        {/*Donute Button Image */}
        <Image
          source={{
            uri: 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/drawerWhite.png',
          }}
          style={{
            width: 25,
            height: 25,
            marginLeft: 5,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

function dashboardStack({navigation}) {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="MyPath" component={MyPath} />
    </Stack.Navigator>
  );
}

function userStack({navigation}) {
  return (
    <Stack.Navigator
      initialRouteName="UserInfoDisplay"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="UserInfoDisplay" component={UserInfoDisplay} />
      <Stack.Screen name="UserInfoEdit" component={UserInfoEdit} />
    </Stack.Navigator>
  );
}

function transportationStack({navigation}) {
  return (
    <Stack.Navigator
      initialRouteName="TransportationInfoDisplay"
      screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="TransportationInfoDisplay"
        component={TransportationInfoDisplay}
      />
      <Stack.Screen
        name="TransportationInfoEdit"
        component={TransportationInfoEdit}
      />
    </Stack.Navigator>
  );
}

function accountStack({navigation}) {
  return (
    <Stack.Navigator
      initialRouteName="AccountInfoDisplay"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="AccountInfoDisplay" component={AccountInfoDisplay} />
      <Stack.Screen name="ChangeEmail" component={ChangeEmail} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="ChangeUsername" component={ChangeUsername} />
    </Stack.Navigator>
  );
}

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="Dashboard"
        options={{
          drawerLabel: 'Dashboard',
          /*drawerIcon: ({focused, size}) => (
            <AntDesign
              name="dashboard"
              size={size}
              color={focused ? '#7cc' : '#ccc'}
            />
          ),*/
        }}
        component={dashboardStack}
      />
      <Drawer.Screen
        name="User"
        options={{
          drawerLabel: 'User',
          /*drawerIcon: ({focused, size}) => (
            <MaterialCommunityIcons
              name="face"
              size={size}
              color={focused ? '#7cc' : '#ccc'}
            />
          ),*/
        }}
        component={userStack}
      />
      <Drawer.Screen
        name="Transportation"
        options={{
          drawerLabel: 'Transportation',
          /*drawerIcon: ({focused, size}) => (
            <FontAwesome5
              name="wheelchair"
              size={size}
              color={focused ? '#7cc' : '#ccc'}
            />
          ),*/
        }}
        component={transportationStack}
      />
      <Drawer.Screen
        name="Account Settings"
        options={{
          drawerLabel: 'Account Settings',
          //drawerIcon: ({}) => <FontAwesome name="gear" color={'#ccc'} />,
        }}
        component={accountStack}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;

const styles = StyleSheet.create({
  root: {
    alignItems: 'flex-start',
    padding: 50,
  },
  container: {
    fontSize: 30,
  },
  space: {
    width: 70,
    height: 20,
  },
});
