import React, {useState, useEffect} from 'react';
import { 
    View, 
    Text, 
    Button, 
    TouchableOpacity, 
    Dimensions,
    TextInput,
    Platform,
    StyleSheet,
    ScrollView,
    StatusBar,
    SafeAreaView,
    LogBox
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Picker} from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';


const SignInScreen = ({navigation}) => {

    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested',]);
    }, [])
    DropDownPicker.setListMode("SCROLLVIEW");

    const [data, setData] = React.useState({
        username: '',
        password: '',
        confirm_password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        confirm_secureTextEntry: true,
    });

    const textInputChange = (val) => {
        if( val.length !== 0 ) {
            setData({
                ...data,
                username: val,
                check_textInputChange: true
            });
        } else {
            setData({
                ...data,
                username: val,
                check_textInputChange: false
            });
        }
    }

    const handlePasswordChange = (val) => {
        setData({
            ...data,
            password: val
        });
    }

    const handleConfirmPasswordChange = (val) => {
        setData({
            ...data,
            confirm_password: val
        });
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const updateConfirmSecureTextEntry = () => {
        setData({
            ...data,
            confirm_secureTextEntry: !data.confirm_secureTextEntry
        });
    }

    const [openGender, setOpenGender] = useState(false);
    const [valueGender, setValueGender] = useState(null);
    const [itemsGender, setItemsGender] = useState([
      {label: 'Man', value: 'man'},
      {label: 'Woman', value: 'woman'},
      {label: 'Transgender', value: 'tg'},
      {label: 'Non-binary/Non-conforming', value: 'nb'},
      {label: 'Prefer not to respond', value: 'pn'},
    ]);

    const [openWC, setOpenWC] = useState(false);
    const [valueWC, setValueWC] = useState(null);
    const [itemsWC, setItemsWC] = useState([
      {label: 'Manual Wheelchair', value: 'mawc'},
      {label: 'Powered Wheelchair', value: 'powc'},
      {label: 'Power Assist Wheelchair', value: 'pawc'},
      {label: 'Other Wheelchair', value: 'owc'},
    ]);

    const [openWT, setOpenWT] = useState(false);
    const [valueWT, setValueWT] = useState(null);
    const [itemsWT, setItemsWT] = useState([
      {label: 'Front Wheel Drive', value: 'fwd'},
      {label: 'Mid Wheel Drive', value: 'mwd'},
      {label: 'Rear Wheel Drive', value: 'rwd'},
    ]);

    const [openTM, setOpenTM] = useState(false);
    const [valueTM, setValueTM] = useState(null);
    const [itemsTM, setItemsTM] = useState([
      {label: 'Spoke Wheels', value: 'swwc'},
      {label: 'Meg Wheels', value: 'mewc'},
      {label: 'Pneumatic Tyres', value: 'pnwc'},
      {label: 'Solid Tyres', value: 'sowc'},
      {label: 'Flat Free Tyres', value: 'ffwc'},
      {label: 'Other', value: 'other'},
    ]);

    return (
      <View style={styles.container}>
          <StatusBar backgroundColor='#009387' barStyle="light-content"/>
        <View style={styles.header}>
            <Text style={styles.text_header}>Register Now</Text>
        </View>
        <Animatable.View 
            animation="fadeInUpBig"
            style={styles.footer}
        >

        <ScrollView nestedScrollEnabled={true}>

            <Text style={styles.text_footer}>Full Name</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="user-o"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Full Name"
                    style={styles.textInput}
                    autoCapitalize="none"
                    // onChangeText={(val) => textInputChange(val)}
                />
                {data.check_textInputChange ? 
                <Animatable.View
                    animation="bounceIn"
                >
                    <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animatable.View>
                : null}
            </View>





            <Text style={[styles.text_footer, {
                marginTop: 35
            }]}>User name</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="user-o"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Your Username"
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => textInputChange(val)}
                />
                {data.check_textInputChange ? 
                <Animatable.View
                    animation="bounceIn"
                >
                    <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animatable.View>
                : null}
            </View>


            <Text style={[styles.text_footer, {
                marginTop: 35
            }]}>Email</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="envelope-o"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="example@email.com"
                    style={styles.textInput}
                    autoCapitalize="none"
                    // onChangeText={(val) => textInputChange(val)}
                />
                {data.check_textInputChange ? 
                <Animatable.View
                    animation="bounceIn"
                >
                    <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animatable.View>
                : null}
            </View>



            <Text style={[styles.text_footer, {
                marginTop: 35
            }]}>Password</Text>
            <View style={styles.action}>
                <Feather 
                    name="lock"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Your Password"
                    secureTextEntry={data.secureTextEntry ? true : false}
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => handlePasswordChange(val)}
                />
                <TouchableOpacity
                    onPress={updateSecureTextEntry}
                >
                    {data.secureTextEntry ? 
                    <Feather 
                        name="eye-off"
                        color="grey"
                        size={20}
                    />
                    :
                    <Feather 
                        name="eye"
                        color="grey"
                        size={20}
                    />
                    }
                </TouchableOpacity>
            </View>

            <Text style={[styles.text_footer, {
                marginTop: 35
            }]}>Confirm Password</Text>
            <View style={styles.action}>
                <Feather 
                    name="lock"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Confirm Your Password"
                    secureTextEntry={data.confirm_secureTextEntry ? true : false}
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => handleConfirmPasswordChange(val)}
                />
                <TouchableOpacity
                    onPress={updateConfirmSecureTextEntry}
                >
                    {data.secureTextEntry ? 
                    <Feather 
                        name="eye-off"
                        color="grey"
                        size={20}
                    />
                    :
                    <Feather 
                        name="eye"
                        color="grey"
                        size={20}
                    />
                    }
                </TouchableOpacity>
            </View>








            <Text style={[styles.text_footer, {
                marginTop: 35
            }]}>Others Information</Text>
            <Text style={[styles.text_footer, {
                marginTop: 35
            }]}>Height</Text>
            <View style={styles.action}>
                <MaterialComIcon 
                    name="human-male-height"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Height in cm"
                    style={styles.textInput}
                    autoCapitalize="none"
                    // onChangeText={(val) => textInputChange(val)}
                />
                {data.check_textInputChange ? 
                <Animatable.View
                    animation="bounceIn"
                >
                    <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animatable.View>
                : null}
            </View>


            <Text style={[styles.text_footer, {
                marginTop: 35
            }]}>Weight</Text>
            <View style={styles.action}>
                <FontAwesome5 
                    name="weight"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Weight in lb"
                    style={styles.textInput}
                    autoCapitalize="none"
                    // onChangeText={(val) => textInputChange(val)}
                />
                {data.check_textInputChange ? 
                <Animatable.View
                    animation="bounceIn"
                >
                    <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animatable.View>
                : null}
            </View>

            <Text style={[styles.text_footer, {
                marginTop: 35
            }]}>Gender</Text>
            
            <View style={styles.action}>
                <DropDownPicker 
                    open={openGender}
                    value={valueGender}
                    items={itemsGender}
                    setOpen={setOpenGender}
                    setValue={setValueGender}
                    setItems={setItemsGender}
                    dropDownDirection="TOP"
                />
            </View>
            
            <Text style={[styles.text_footer, {
                marginTop: 35
            }]}>Age</Text>
            <View style={styles.action}>
                <FontAwesome5 
                    name="weight"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Age"
                    style={styles.textInput}
                    autoCapitalize="none"
                    keyboardType = 'number-pad'
                    // onChangeText={(val) => textInputChange(val)}
                />
                {data.check_textInputChange ? 
                <Animatable.View
                    animation="bounceIn"
                >
                    <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animatable.View>
                : null}
            </View>


            <Text style={[styles.text_footer, {
                marginTop: 35
            }]}>Wheelchair Information</Text>
            <Text style={[styles.text_footer, {
                marginTop: 35
            }]}>Type of Wheelchair</Text>
            <View style={styles.action}>
                <View style={styles.action}>
                    <DropDownPicker 
                        open={openWC}
                        value={valueWC}
                        items={itemsWC}
                        setOpen={setOpenWC}
                        setValue={setValueWC}
                        setItems={setItemsWC}
                        dropDownDirection="TOP"
                    />
                </View>
            </View> 

            <Text style={[styles.text_footer, {
                marginTop: 35
            }]}>Number of Wheels</Text>
            <View style={styles.action}>
                <FontAwesome
                    name="wheelchair-alt"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Number of wheels"
                    style={styles.textInput}
                    autoCapitalize="none"
                    keyboardType = 'number-pad'
                    // onChangeText={(val) => textInputChange(val)}
                />
                {data.check_textInputChange ? 
                <Animatable.View
                    animation="bounceIn"
                >
                    <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animatable.View>
                : null}
            </View>

            <Text style={[styles.text_footer, {
                marginTop: 35
            }]}>Wheel Type</Text>
            <View style={styles.action}>
                <DropDownPicker 
                    open={openWT}
                    value={valueWT}
                    items={itemsWT}
                    setOpen={setOpenWT}
                    setValue={setValueWT}
                    setItems={setItemsWT}
                    dropDownDirection="TOP"
                />
            </View> 

            <Text style={[styles.text_footer, {
                marginTop: 35
            }]}>Tires Material</Text>
            <View style={styles.action}>
                <DropDownPicker 
                    open={openTM}
                    value={valueTM}
                    items={itemsTM}
                    setOpen={setOpenTM}
                    setValue={setValueTM}
                    setItems={setItemsTM}
                    dropDownDirection="TOP"
                />
            </View> 


            <Text style={[styles.text_footer, {
                marginTop: 35
            }]}>Wheelchair Width</Text>
            <View style={styles.action}>
                <FontAwesome5
                    name="wheelchair"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="wheel chair width (in cm)"
                    style={styles.textInput}
                    autoCapitalize="none"
                    keyboardType = 'number-pad'
                    // onChangeText={(val) => textInputChange(val)}
                />
                {data.check_textInputChange ? 
                <Animatable.View
                    animation="bounceIn"
                >
                    <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animatable.View>
                : null}
            </View>


            <Text style={[styles.text_footer, {
                marginTop: 35
            }]}>Seat to Floor Height</Text>
            <View style={styles.action}>
                <FontAwesome5
                    name="wheelchair"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Seat to floor height (in cm)"
                    style={styles.textInput}
                    autoCapitalize="none"
                    keyboardType = 'number-pad'
                    // onChangeText={(val) => textInputChange(val)}
                />
                {data.check_textInputChange ? 
                <Animatable.View
                    animation="bounceIn"
                >
                    <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animatable.View>
                : null}
            </View>

            <View style={styles.textPrivate}>
                <Text style={styles.color_textPrivate}>
                    By signing up you agree to our
                </Text>
                <Text style={[styles.color_textPrivate, {fontWeight: 'bold'}]}>{" "}Terms of service</Text>
                <Text style={styles.color_textPrivate}>{" "}and</Text>
                <Text style={[styles.color_textPrivate, {fontWeight: 'bold'}]}>{" "}Privacy policy</Text>
            </View>
            <View style={styles.button}>
                <TouchableOpacity
                    style={styles.signIn}
                    onPress={() => {}}
                >
                <LinearGradient
                    colors={['#08d4c4', '#01ab9d']}
                    style={styles.signIn}
                >
                    <Text style={[styles.textSign, {
                        color:'#fff'
                    }]}>Sign Up</Text>
                </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={[styles.signIn, {
                        borderColor: '#009387',
                        borderWidth: 1,
                        marginTop: 15
                    }]}
                >
                    <Text style={[styles.textSign, {
                        color: '#009387'
                    }]}>Sign In</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>




        </Animatable.View>
      </View>
    );
};

export default SignInScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: '#009387'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: Platform.OS === 'ios' ? 3 : 5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20
    },
    color_textPrivate: {
        color: 'grey'
    }
  });
