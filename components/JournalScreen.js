import React from 'react'
import moment from "moment";
import Firebase from '../Firebase'
import { Modal, View, Text, TextInput, StyleSheet, Button, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Dimensions } from 'react-native'
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { EvilIcons, Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CNRichTextEditor, { CNToolbar, getDefaultStyles, convertToObject, getInitialObject } from "react-native-cn-richtext-editor";
import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuContext, MenuProvider, renderers } from 'react-native-popup-menu';
import KeyboardListener from 'react-native-keyboard-listener';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import uuid from 'uuid';



const { SlideInMenu } = renderers;

const IS_IOS = Platform.OS === 'ios';
const { width, height } = Dimensions.get('window');
const defaultStyles = getDefaultStyles();


class JournalScreen extends React.Component {

    constructor(props) {
        super(props);
        this.customStyles = {
            ...defaultStyles, body: { fontSize: 16 }, heading: { fontSize: 16 }
            , title: { fontSize: 20 }, ol: { fontSize: 16 }, ul: { fontSize: 16 }, bold: { fontSize: 16, fontWeight: 'bold', color: 'black' }
        };
        this.state = {
            selectedTag: 'body',
            selectedColor: 'default',
            selectedHighlight: 'default',
            colors: ['red', 'green', 'blue'],
            highlights: ['yellow_hl', 'pink_hl', 'orange_hl', 'green_hl', 'purple_hl', 'blue_hl'],
            selectedStyles: [],
            // value: [getInitialObject()] get empty editor
            value: [getInitialObject()],
            keyboardOpen: null,
            date: moment().format('YYYY-MM-DD'),
            mapVisible: false,
            location: "",
            mapRegion: "",
        };

        this.editor = null;
    }
    addToFirebase = () => {
        uid = Firebase.auth().currentUser.uid;
        entry = Firebase.firestore().collection('users').doc("" + uid).collection('dates').doc("" + this.state.date)
        entry.get().then((e) => {
            if (e.exists) {
                entry.update({
                    date: "" + this.state.date,
                    text: JSON.stringify(this.state.value),
                })
            }
            else {
                entry.set({
                    date: "" + this.state.date,
                    text: JSON.stringify(this.state.value),
                })
            }
        })
        this.props.navigation.navigate('Calendar')
    }
    openMap = () => {
        if (this.state.location == "") {
            loc = this.getLocation();
            if (loc == undefined) {
                // sets state of location and region
                this.getCurrentLocation();
                // need to push this to firebase and render map
            }
            else {
                this.setState({
                    location: loc.location,
                    mapRegion: {
                        latitude: loc.location.latitude,
                        longitude: loc.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421
                    },
                    mapVisible: true
                })
            }
        }
        else {
            this.setState({ mapVisible: true })
        }

    }

    closeMap = () => {
        this.setState({ mapVisible: false });
    }
    getLocation = () => {
        uid = Firebase.auth().currentUser.uid;
        entry = Firebase.firestore().collection('users').doc("" + uid).collection('dates').doc("" + this.state.date);
        entry.get().then((e) => {
            if (e.exists) {
                lat = e.data().latitude;
                console.log(lat)
                long = e.data().longitude;
                if (lat != undefined) {
                    loc = {
                        location: {
                            latitude: lat,
                            longitude: long,
                        },
                        mapRegion: {
                            latitude: lat,
                            longitude: long,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421
                        }
                    }
                    return loc;
                }
            }
            return "";
        })
    }

    getCurrentLocation = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }
        console.log("hi")
        let location = await Location.getCurrentPositionAsync({});
        uid = Firebase.auth().currentUser.uid;
        entry = Firebase.firestore().collection('users').doc("" + uid).collection('dates').doc("" + this.state.date)
        entry.get().then((e) => {
            if (e.exists) {
                entry.update({
                    latitude: "" + location.coords.latitude,
                    longitude: "" + location.coords.longitude,
                })
            }
            else {
                entry.set({
                    latitude: "" + location.coords.latitude,
                    longitude: "" + location.coords.longitude,
                })
            }
        })
        this.setState({
            location: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            },
            mapRegion: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
            },
            mapVisible: true

        })
    }
    onFocusFunction = () => {
        v = undefined;
        if (this.props.navigation.state.params == undefined) {
            uid = Firebase.auth().currentUser.uid;
            console.log(this.state.date)
            entry = Firebase.firestore().collection('users').doc("" + uid).collection('dates').doc("" + this.state.date)
            entry.get().then((e) => {
                if (e.exists) {
                    v = e.data().text
                    // gets the text from firebase
                    console.log(v)

                    // if there is no text in firebase
                    if (v == undefined) {
                        console.log("hi")
                        v = [getInitialObject()];
                    }
                    // somehow v is undefined here
                    this.setState({
                        value: v,
                    })
                }
            })
        }
        else {
            v = JSON.parse(this.props.navigation.state.params.text);
            this.setState({
                value: v,
                date: this.props.navigation.state.params.date
            })
        }
    }
    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.onFocusFunction()
        })

    }
    onStyleKeyPress = (toolType) => {
        if (toolType == 'image') {
            return;
        }
        else {
            this.editor.applyToolbar(toolType);
        }
    }

    onSelectedTagChanged = (tag) => {
        this.setState({
            selectedTag: tag
        })
    }

    onSelectedStyleChanged = (styles) => {
        const colors = this.state.colors;
        const highlights = this.state.highlights;
        let sel = styles.filter(x => colors.indexOf(x) >= 0);

        let hl = styles.filter(x => highlights.indexOf(x) >= 0);
        this.setState({
            selectedStyles: styles,
            selectedColor: (sel.length > 0) ? sel[sel.length - 1] : 'default',
            selectedHighlight: (hl.length > 0) ? hl[hl.length - 1] : 'default',
        })
    }

    onValueChanged = (value) => {
        this.setState({
            value: value
        });
    }

    insertImage(url) {
        this.editor.insertImage(url);
    }

    askPermissionsAsync = async () => {
        const camera = await Permissions.askAsync(Permissions.CAMERA);
        const cameraRoll = await Permissions.askAsync(Permissions.CAMERA_ROLL);


        this.setState({
            hasCameraPermission: camera.status === 'granted',
            hasCameraRollPermission: cameraRoll.status === 'granted'
        });
    };

    uploadImage = async (uri, imageName) => {
        const response = await fetch(uri)
        const blob = await response.blob()
        var ref = Firebase.storage().ref().child("images/" + imageName)
        const snapshot = await ref.put(blob);
        blob.close();
        let getNewUrl = await snapshot.ref.getDownloadURL();

        this.insertImage(getNewUrl);

    }

    useLibraryHandler = async () => {
        await this.askPermissionsAsync();
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 4],
            base64: false,
        });

        if (!result.cancelled) {
            var randomName = uuid.v4()
            this.uploadImage(result.uri, randomName)
        }

    };

    useCameraHandler = async () => {
        await this.askPermissionsAsync();
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 4],
            base64: false,
        });

        if (!result.cancelled) {
            var randomName = uuid.v4()
            this.uploadImage(result.uri, randomName)
        }

    };


    onImageSelectorClicked = (value) => {
        if (value == 1) {
            this.useCameraHandler();
        }
        else if (value == 2) {
            this.useLibraryHandler();
        }

    }

    onColorSelectorClicked = (value) => {

        if (value === 'default') {
            this.editor.applyToolbar(this.state.selectedColor);
        }
        else {
            this.editor.applyToolbar(value);

        }

        this.setState({
            selectedColor: value
        });
    }

    onRemoveImage = ({ url, id }) => {
        // do what you have to do after removing an image
        //console.log(`image removed (url : ${url})`);

    }

    onHighlightSelectorClicked = (value) => {
        if (value === 'default') {
            this.editor.applyToolbar(this.state.selectedHighlight);
        }
        else {
            this.editor.applyToolbar(value);

        }

        this.setState({
            selectedHighlight: value
        });
    }

    renderImageSelector() {
        return (
            <Menu renderer={SlideInMenu} onSelect={this.onImageSelectorClicked}>
                <MenuTrigger>
                    <MaterialCommunityIcons name="image" size={28} color="#737373" />
                </MenuTrigger>
                <MenuOptions>
                    <MenuOption value={1}>
                        <Text style={styles.menuOptionText}>
                            Take Photo
                    </Text>
                    </MenuOption>
                    <View style={styles.divider} />
                    <MenuOption value={2} >
                        <Text style={styles.menuOptionText}>
                            Photo Library
                    </Text>
                    </MenuOption>
                    <View style={styles.divider} />
                    <MenuOption value={3}>
                        <Text style={styles.menuOptionText}>
                            Cancel
                    </Text>
                    </MenuOption>
                </MenuOptions>
            </Menu>
        );

    }

    renderColorMenuOptions = () => {

        let lst = [];

        if (defaultStyles[this.state.selectedColor]) {
            lst = this.state.colors.filter(x => x !== this.state.selectedColor);
            lst.push('default');
            lst.push(this.state.selectedColor);
        }
        else {
            lst = this.state.colors.filter(x => true);
            lst.push('default');
        }

        return (

            lst.map((item) => {
                let color = defaultStyles[item] ? defaultStyles[item].color : 'black';
                return (
                    <MenuOption value={item} key={item}>
                        <MaterialCommunityIcons name="format-color-text" color={color}
                            size={28} />
                    </MenuOption>
                );
            })

        );
    }

    renderHighlightMenuOptions = () => {
        let lst = [];

        if (defaultStyles[this.state.selectedHighlight]) {
            lst = this.state.highlights.filter(x => x !== this.state.selectedHighlight);
            lst.push('default');
            lst.push(this.state.selectedHighlight);
        }
        else {
            lst = this.state.highlights.filter(x => true);
            lst.push('default');
        }



        return (

            lst.map((item) => {
                let bgColor = defaultStyles[item] ? defaultStyles[item].backgroundColor : 'black';
                return (
                    <MenuOption value={item} key={item}>
                        <MaterialCommunityIcons name="marker" color={bgColor}
                            size={26} />
                    </MenuOption>
                );
            })

        );
    }

    renderColorSelector() {

        let selectedColor = '#737373';
        if (defaultStyles[this.state.selectedColor]) {
            selectedColor = defaultStyles[this.state.selectedColor].color;
        }


        return (
            <Menu renderer={SlideInMenu} onSelect={this.onColorSelectorClicked}>
                <MenuTrigger>
                    <MaterialCommunityIcons name="format-color-text" color={selectedColor}
                        size={28} style={{
                            top: 2
                        }} />
                </MenuTrigger>
                <MenuOptions customStyles={optionsStyles}>
                    {this.renderColorMenuOptions()}
                </MenuOptions>
            </Menu>
        );
    }
    renderHighlight() {
        let selectedColor = '#737373';
        if (defaultStyles[this.state.selectedHighlight]) {
            selectedColor = defaultStyles[this.state.selectedHighlight].backgroundColor;
        }
        return (
            <Menu renderer={SlideInMenu} onSelect={this.onHighlightSelectorClicked}>
                <MenuTrigger>
                    <MaterialCommunityIcons name="marker" color={selectedColor}
                        size={24} style={{
                        }} />
                </MenuTrigger>
                <MenuOptions customStyles={highlightOptionsStyles}>
                    {this.renderHighlightMenuOptions()}
                </MenuOptions>
            </Menu>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <KeyboardListener
                    onWillShow={() => { this.setState({ keyboardOpen: true }); }}
                    onWillHide={() => { this.setState({ keyboardOpen: false }); }}
                />

                <View style={styles.title}>
                    <View style={{ flexDirection: "row", alignItems: "flex-end", }}>
                        <Text style={styles.date}>{this.state.date}</Text>
                    </View>
                    <View style={styles.moodIcons}>
                        <TouchableOpacity style={{ marginRight: 10 }}>
                            <MaterialCommunityIcons name="emoticon-sad" color="#cbbade" size={35} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginRight: 10 }}>
                            <MaterialCommunityIcons name="emoticon-neutral" color="#cbbade" size={35} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <MaterialCommunityIcons name="emoticon-happy" color="#cbbade" size={35} />
                        </TouchableOpacity>
                        {(this.state.keyboardOpen == true) ? <Button onPress={Keyboard.dismiss} title="Done" color="#cbbade" /> : <View />}
                    </View>
                </View>

                {/* <TextInput 
                    multiline 
                    autogrow 
                    scrollEnabled
                    placeholder="How was your day?"
                    placeholderTextColor = "#70757A" 
                    style={styles.entry}
                    onChangeText = {text => this.setState({entry: text})}
                    value = {this.state.entry}
                /> */}

                <KeyboardAvoidingView
                    behavior="padding"
                    enabled
                    keyboardVerticalOffset={0}
                    style={{
                        flex: 1,
                        width: "100%",
                        backgroundColor: '#fff',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                    }}
                >
                    <MenuProvider style={{ flex: 1, flexDirection: "column", alignItems: "center" }}>

                        <View style={styles.main}>
                            <CNRichTextEditor
                                ref={input => this.editor = input}
                                onSelectedTagChanged={this.onSelectedTagChanged}
                                onSelectedStyleChanged={this.onSelectedStyleChanged}
                                value={this.state.value}
                                style={styles.editor}
                                styleList={this.customStyles}
                                foreColor='dimgray' // optional (will override default fore-color)
                                onValueChanged={this.onValueChanged}
                                onRemoveImage={this.onRemoveImage}
                            />
                        </View>

                        {(this.state.keyboardOpen == false) ?
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity onPress={this.addToFirebase}>
                                    <Ionicons name="ios-add-circle-outline" color="#cbbade" size={55} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.openMap()} style={styles.locationButton}>
                                    <EvilIcons name="location" color="#cbbade" size={55} />
                                </TouchableOpacity>
                                <View>
                                    <Modal
                                        visible={this.state.mapVisible}
                                        animationType={'slide'}
                                        onRequestClose={() => this.closeMap()}
                                    >
                                        <View style={styles.modalContainer}>
                                            <MapView
                                                style={styles.mapStyle}
                                                region={this.state.mapRegion != "" ? this.state.mapRegion : null}
                                            >
                                                {(this.state.location != "") ? <MapView.Marker
                                                    coordinate={this.state.location != "" ? this.state.location : null}
                                                    title={"Entry Location"}
                                                /> : <br />}
                                            </MapView>
                                            <Button
                                                onPress={() => this.closeMap()}
                                                title="Close Map"
                                                style={styles.mapButton}
                                                color="#3e3e3e"
                                            >
                                            </Button>
                                        </View>
                                    </Modal>
                                </View>
                            </View> :

                            <View style={styles.toolbarContainer}>
                                <CNToolbar
                                    style={{ height: 35, }}
                                    iconSetContainerStyle={{
                                        flexGrow: 1,
                                        justifyContent: 'space-evenly',
                                        alignItems: 'center',
                                    }}
                                    size={28}
                                    iconSet={[
                                        {
                                            type: 'tool',
                                            iconArray: [{
                                                toolTypeText: 'bold',
                                                buttonTypes: 'style',
                                                iconComponent: <MaterialCommunityIcons name="format-bold" />
                                            },
                                            {
                                                toolTypeText: 'italic',
                                                buttonTypes: 'style',
                                                iconComponent: <MaterialCommunityIcons name="format-italic" />
                                            },
                                            {
                                                toolTypeText: 'underline',
                                                buttonTypes: 'style',
                                                iconComponent: <MaterialCommunityIcons name="format-underline" />
                                            },
                                            {
                                                toolTypeText: 'lineThrough',
                                                buttonTypes: 'style',
                                                iconComponent: <MaterialCommunityIcons name="format-strikethrough-variant" />
                                            }
                                            ]
                                        },
                                        {
                                            type: 'seperator'
                                        },
                                        {
                                            type: 'tool',
                                            iconArray: [
                                                {
                                                    toolTypeText: 'body',
                                                    buttonTypes: 'tag',
                                                    iconComponent:
                                                        <MaterialCommunityIcons name="format-text" />
                                                },
                                                {
                                                    toolTypeText: 'title',
                                                    buttonTypes: 'tag',
                                                    iconComponent:
                                                        <MaterialCommunityIcons name="format-header-1" />
                                                },
                                                {
                                                    toolTypeText: 'heading',
                                                    buttonTypes: 'tag',
                                                    iconComponent:
                                                        <MaterialCommunityIcons name="format-header-3" />
                                                },
                                                {
                                                    toolTypeText: 'ul',
                                                    buttonTypes: 'tag',
                                                    iconComponent:
                                                        <MaterialCommunityIcons name="format-list-bulleted" />
                                                },
                                                {
                                                    toolTypeText: 'ol',
                                                    buttonTypes: 'tag',
                                                    iconComponent:
                                                        <MaterialCommunityIcons name="format-list-numbered" />
                                                }
                                            ]
                                        },
                                        {
                                            type: 'seperator'
                                        },
                                        {
                                            type: 'tool',
                                            iconArray: [
                                                {
                                                    toolTypeText: 'image',
                                                    iconComponent: this.renderImageSelector()
                                                },
                                                {
                                                    toolTypeText: 'color',
                                                    iconComponent: this.renderColorSelector()
                                                },
                                                {
                                                    toolTypeText: 'highlight',
                                                    iconComponent: this.renderHighlight()
                                                }
                                            ]
                                        },

                                    ]}
                                    selectedTag={this.state.selectedTag}
                                    selectedStyles={this.state.selectedStyles}
                                    onStyleKeyPress={this.onStyleKeyPress}
                                    backgroundColor="#faf7ff" // optional (will override default backgroundColor)
                                    color="gray" // optional (will override default color)
                                    selectedColor='white' // optional (will override default selectedColor)
                                    selectedBackgroundColor='#CBBADE' // optional (will override default selectedBackgroundColor)
                                />
                            </View>}
                    </MenuProvider>
                </KeyboardAvoidingView>
            </View>
        )
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: Constants.statusBarHeight,
        alignItems: "center",
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    locationButton: {
        flex: 1,
        marginTop: 5,
        alignItems: 'flex-end',
    },
    mapButton: {
        flex: 1,
    },
    mapStyle: {
        justifyContent: 'center',
        alignSelf: 'flex-end',
        width: '100%',
        height: '90%',
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    title: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        width: "100%",
        paddingLeft: 20,
        paddingBottom: 5,
        marginBottom: 5,
        height: Constants.statusBarHeight
    },
    done: {
        fontFamily: 'AppleSDGothicNeo-Regular',
        fontSize: 24,
        color: '#cbbade'
    },
    date: {
        fontFamily: 'AppleSDGothicNeo-Light',
        fontSize: 18,
        paddingBottom: 6,
        paddingLeft: 10
    },
    moodIcons: {
        flexDirection: 'row',
        paddingRight: 20,
    },
    main: {
        flex: 1,
        width: "100%",
        paddingTop: 10,
        paddingBottom: 10,
        borderColor: '#70757A',
        borderTopWidth: 0.5,
        height: "85%",
        fontSize: 16,
    },
    editor: {
        backgroundColor: '#fff'
    },
    toolbarContainer: {
        minHeight: 35
    },
    menuOptionText: {
        textAlign: 'center',
        paddingTop: 5,
        paddingBottom: 5
    },
    divider: {
        marginVertical: 0,
        marginHorizontal: 0,
        borderBottomWidth: 1,
        borderColor: '#eee'
    },
    modalContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    innerContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
})

const optionsStyles = {
    optionsContainer: {
        backgroundColor: 'yellow',
        padding: 0,
        width: 40,
        marginLeft: width - 40 - 30,
        alignItems: 'flex-end',
    },
    optionsWrapper: {
        //width: 40,
        backgroundColor: 'white',
    },
    optionWrapper: {
        //backgroundColor: 'yellow',
        margin: 2,
    },
    optionTouchable: {
        underlayColor: 'gold',
        activeOpacity: 70,
    },
    // optionText: {
    //   color: 'brown',
    // },
};

const highlightOptionsStyles = {
    optionsContainer: {
        backgroundColor: 'transparent',
        padding: 0,
        width: 40,
        marginLeft: width - 40,

        alignItems: 'flex-end',
    },
    optionsWrapper: {
        //width: 40,
        backgroundColor: 'white',
    },
    optionWrapper: {
        //backgroundColor: 'yellow',
        margin: 2,
    },
    optionTouchable: {
        underlayColor: 'gold',
        activeOpacity: 70,
    },
    // optionText: {
    //   color: 'brown',
    // },
};

export default JournalScreen