import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import {useTheme} from 'react-native-paper';

import {AuthContext} from '../components/context';

import Users from '../model/users';

import AsyncStorage from '@react-native-async-storage/async-storage';

const SignInScreen = ({navigation}) => {
  const [data, setData] = React.useState({
    email: '',
    password: '',
    //check_textInputChange: false,
    secureTextEntry: true,
    //isValidUser: true,
    isValidPassword: true,
  });

  const {colors} = useTheme();

  const {signIn} = React.useContext(AuthContext);



  const textInputChange = val => {
    if (val.length>0 && isValidEmail()) {
      setData({
        ...data,
        email: val,
        // check_textInputChange: true,
        //isValidUser: true,
      });
    } else if(val.length>0 && !isValidEmail()) {
      setData({
        ...data,
        email: val,
        // check_textInputChange: false,
        //isValidUser: false,
      });
    }
  };



  const handlePasswordChange = val => {
    if (val.trim().length >= 6) {
      setData({
        ...data,
        password: val,
        isValidPassword: true,
      });
    } else {
      setData({
        ...data,
        password: val,
        isValidPassword: false,
      });
    }
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const handleValidUser = (val) => {
    if (isValidEmail(val)) {
      setData({
        ...data,
        //isValidUser: true,
      });
    } else {
      setData({
        ...data,
        //isValidUser: false,
      });
    }
  };

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  }

  const DataValidate = async (email, password) => {
    try {
        const valueEmail = await AsyncStorage.getItem("email");
        if (valueEmail !== null) {
            if(valueEmail != email)
            {
              return false;
            }else{
              console.log("True--> " + valueEmail);
            }
        }else{
          console.log("Value is null");
          return false;
        }

        const valuePass = await AsyncStorage.getItem("password");
        if (valuePass !== null) {
          if(valuePass != password){
            return false;
          }else{
            console.log("True--> " + valuePass);
          }
        }else{
          console.log("Value is null");
          return false;
        }
    } catch (e) {
        alert('Failed to fetch the input from storage');
    }

    console.log("Correct");
    return true;
  };


  const loginHandle = async (email, password) => {

    var res = await DataValidate(email, password);
    console.log("Res is " + res);

    if(Boolean(res) == true || (email == "user1@email.com" && password == "abcd-1234"))
    {
      console.log("True");
      //signIn(Users[0]);
      const foundUser = Users.filter(item => {
        return "user1@email.com" == item.email && "password" == item.password;
      });
      signIn(foundUser);

      console.log("in");
    }else{
      alert("Email or password is incorrect");
    }

    // const foundUser = Users.filter(item => {
    //   return email == item.email && password == item.password;
    // });

    // if (data.email.length == 0 || data.password.length == 0) {
    //   Alert.alert(
    //     'Wrong Input!',
    //     'Email or password field cannot be empty.',
    //     [{text: 'Okay'}],
    //   );
    //   return;
    // }

    // if (foundUser.length == 0) {
    //   Alert.alert('Invalid User!', 'Email or password is incorrect.', [
    //     {text: 'Okay'},
    //   ]);
    //   return;
    // }
    // console.log("Type of   " + typeof(Users));
    // signIn(foundUser);
  };

  return (
  <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={styles.container}
  >

    <View style={styles.container}>
      <StatusBar backgroundColor="#009387" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>Welcome</Text>
      </View>
      <Animatable.View
        animation="fadeInUpBig"
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
          },
        ]}>
        <ScrollView nestedScrollEnabled={true}>
        

        <Text
          style={[
            styles.text_footer,
            {
              color: colors.text,
            },
          ]}>
          Email address
        </Text>
        <View style={styles.action}>
          <FontAwesome name="user-o" color={colors.text} size={20} />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#666666"
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
            autoCapitalize="none"
            onChangeText={val => textInputChange(val)}
            //onEndEditing={e => handleValidUser(e.nativeEvent.text)}
          />
          
          {data.check_textInputChange ? (
            <Animatable.View animation="bounceIn">
              <Feather name="check-circle" color="green" size={20} />
            </Animatable.View>
          ) : null}
        </View>
        {/* {data.isValidUser ? null : (
          <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>
              Email address is incorrect
            </Text>
          </Animatable.View>
        )} */}

        <Text
          style={[
            styles.text_footer,
            {
              color: colors.text,
              marginTop: 35,
            },
          ]}>
          Password
        </Text>
        <View style={styles.action}>
          <Feather name="lock" color={colors.text} size={20} />
          <TextInput
            placeholder="Your Password"
            placeholderTextColor="#666666"
            secureTextEntry={data.secureTextEntry ? true : false}
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
            autoCapitalize="none"
            onChangeText={val => handlePasswordChange(val)}
          />
          <TouchableOpacity onPress={updateSecureTextEntry}>
            {data.secureTextEntry ? (
              <Feather name="eye-off" color="grey" size={20} />
            ) : (
              <Feather name="eye" color="grey" size={20} />
            )}
          </TouchableOpacity>
        </View>
        {data.isValidPassword ? null : (
          <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>
              Password must be 6 characters long.
            </Text>
          </Animatable.View>
        )}

        {/* <TouchableOpacity>
          <Text style={{color: '#009387', marginTop: 15}}>
            Forgot password?
          </Text>
        </TouchableOpacity> */}
        <View style={styles.button}>
          <TouchableOpacity
            style={styles.signIn}
            onPress={() => {
              loginHandle(data.email, data.password);
            }}>
            <LinearGradient
              colors={['#08d4c4', '#01ab9d']}
              style={styles.signIn}>
              <Text
                style={[
                  styles.textSign,
                  {
                    color: '#fff',
                  },
                ]}>
                Sign In
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('SignUpScreen')}
            style={[
              styles.signIn,
              {
                borderColor: '#009387',
                borderWidth: 1,
                marginTop: 15,
              },
            ]}>
            <Text
              style={[
                styles.textSign,
                {
                  color: '#009387',
                },
              ]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </Animatable.View>
    </View>
  </KeyboardAvoidingView>

  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#009387',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
