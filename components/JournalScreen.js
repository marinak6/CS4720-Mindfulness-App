import React from 'react'
import { View, Text, TextInput, StyleSheet, Button, Keyboard, TouchableWithoutFeedback } from 'react-native'
import Constants from 'expo-constants';
import moment from "moment";
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

class JournalScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            entry: "",
            date: moment().format('YYYY-MM-DD')
        };
    }

    componentDidMount() {
        if (this.props != undefined) {
            this.setState({
                entry: this.props.navigation.state.params.text,
                date: this.props.navigation.state.params.date
            })
        }
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.container}>
                    <View style={styles.title}>
                        <View style={{ flexDirection: "row", alignItems: "flex-end", }}>
                            <Text style={styles.day}>Date</Text>
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
                        </View>
                    </View>


                    <TextInput
                        multiline
                        autogrow
                        scrollEnabled
                        placeholder="How was your day?"
                        placeholderTextColor="#70757A"
                        style={styles.entry}
                        onChangeText={text => this.setState({ entry: text })}
                        value={this.state.entry}
                    />

                    <TouchableOpacity>
                        <Ionicons name="ios-add-circle-outline" color="#cbbade" size={55} />
                    </TouchableOpacity>

                </View>
            </TouchableWithoutFeedback>
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
        paddingLeft: 5,
        marginBottom: 7,
    },
    day: {
        fontFamily: 'AvenirNextCondensed-Regular',
        fontSize: 24,
        paddingBottom: 3,
        paddingLeft: 10
    },
    date: {
        fontFamily: 'AvenirNextCondensed-UltraLight',
        fontSize: 18,
        paddingBottom: 6,
        paddingLeft: 10
    },
    moodIcons: {
        flexDirection: 'row',
        paddingRight: 10,
    },
    entry: {
        width: "100%",
        paddingLeft: 19,
        paddingRight: 19,
        paddingTop: 20,
        paddingBottom: 20,
        borderColor: '#70757A',
        borderTopWidth: 0.5,
        height: "85%",
        fontSize: 16,
    }

})

export default JournalScreen