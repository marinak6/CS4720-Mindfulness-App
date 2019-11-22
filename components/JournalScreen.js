import React from 'react'
import moment from "moment";
import { View, Text, TextInput, StyleSheet, Button, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Dimensions } from 'react-native'
import Constants, { Permissions, ImagePicker } from 'expo-constants';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CNRichTextEditor, { CNToolbar, getDefaultStyles, convertToObject } from "react-native-cn-richtext-editor";
import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuContext, MenuProvider, renderers } from 'react-native-popup-menu';
import KeyboardListener from 'react-native-keyboard-listener';

const { SlideInMenu } = renderers;

const IS_IOS = Platform.OS === 'ios';
const { width, height } = Dimensions.get('window');
const defaultStyles = getDefaultStyles();


class JournalScreen extends React.Component {

    constructor(props) {
        super(props);
        this.customStyles = {
            ...defaultStyles, body: { fontSize: 12 }, heading: { fontSize: 16 }
            , title: { fontSize: 20 }, ol: { fontSize: 12 }, ul: { fontSize: 12 }, bold: { fontSize: 12, fontWeight: 'bold', color: 'black' }
        };
        this.state = {
            selectedTag: 'body',
            selectedColor: 'default',
            selectedHighlight: 'default',
            colors: ['red', 'green', 'blue'],
            highlights: ['yellow_hl', 'pink_hl', 'orange_hl', 'green_hl', 'purple_hl', 'blue_hl'],
            selectedStyles: [],
            // value: [getInitialObject()] get empty editor
            value: convertToObject('<div><p><span>This is </span><span style="font-weight: bold;">bold</span><span> and </span><span style="font-style: italic;">italic </span><span>text</span></p></div>'
                , this.customStyles),
            keyboardOpen: null,
            entry: this.props.navigation.state.params.text,
            date: this.props.navigation.state.params.date
        };

        this.editor = null;
    }



    componentDidMount() {
        if (this.props.navigation.state.params != undefined) {
            this.setState({
                entry: this.props.navigation.state.params.text,
                date: this.props.navigation.state.params.date
            })
        }

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

    useLibraryHandler = async () => {
        await this.askPermissionsAsync();
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 4],
            base64: false,
        });

        this.insertImage(result.uri);
    };

    useCameraHandler = async () => {
        await this.askPermissionsAsync();
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 4],
            base64: false,
        });
        console.log(result);

        this.insertImage(result.uri);
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
        console.log(`image removed (url : ${url})`);

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
        console.log(this.state)
        console.log(this.props.navigation.state.params)
        return (
            <View style={styles.container}>
                <KeyboardListener
                    onWillShow={() => { this.setState({ keyboardOpen: true }); }}
                    onWillHide={() => { this.setState({ keyboardOpen: false }); }}
                />

                <View style={styles.title}>
                    <View style={{ flexDirection: "row", alignItems: "flex-end", }}>
                        <Text style={styles.day}>Today</Text>
                        <Text style={styles.date}>11/15/19</Text>
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
                        {(this.state.keyboardOpen == true) ? <Button onPress={Keyboard.dismiss} title="Done" /> : <View />}
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
                            <TouchableOpacity>
                                <Ionicons name="ios-add-circle-outline" color="#cbbade" size={55} />
                            </TouchableOpacity> :

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
    title: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        width: "100%",
        paddingLeft: Constants.statusBarHeight,
        marginBottom: 7,
    },
    day: {
        fontFamily: 'AvenirNextCondensed-Regular',
        fontSize: 24,
        paddingBottom: 3,
    },
    date: {
        fontFamily: 'AvenirNextCondensed-UltraLight',
        fontSize: 18,
        paddingBottom: 6,
        paddingLeft: 10
    },
    moodIcons: {
        flexDirection: 'row',
        paddingRight: Constants.statusBarHeight,
    },
    main: {
        flex: 1,
        width: "100%",
        paddingLeft: Constants.statusBarHeight,
        paddingRight: Constants.statusBarHeight,
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
    }
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