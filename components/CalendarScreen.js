import React from 'react'
import Firebase from '../Firebase'
import { View, Text, StyleSheet, Button, Dimensions } from 'react-native';
import Constants from "expo-constants";
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import moment from "moment";
import { thisExpression } from '@babel/types';
import CNRichTextEditor, { getDefaultStyles, convertToObject, getInitialObject } from "react-native-cn-richtext-editor";

const { width, height } = Dimensions.get('window');

const defaultStyles = getDefaultStyles();

class CalendarScreen extends React.Component {
    constructor(props) {
        super(props);
        this.customStyles = {
            ...defaultStyles, body: { fontSize: 16 }, heading: { fontSize: 16 }
            , title: { fontSize: 20 }, ol: { fontSize: 16 }, ul: { fontSize: 16 }, bold: { fontSize: 16, fontWeight: 'bold', color: 'black' }
        };
        this.state = {
            selected: moment().format('YYYY-MM-DD') //initially selected date should be today
        }
        this.getEntry.bind(this)
    }

    getEntry = (date) => {
        uid = Firebase.auth().currentUser.uid;
        entry = Firebase.firestore().collection('users').doc("" + uid).collection('dates').doc("" + date);
        entry.get().then((e) => {
            if (e.exists) {
                text = e.data().text;
                mood = e.data().mood;
                this.props.navigation.navigate('Journal', {
                    text: text,
                    date: date,
                    mood: mood,
                });
            }
            else {
                this.props.navigation.navigate('Journal', {
                    text: "",
                    date: date,
                    mood: ""
                });
            }
        })

    }


    componentDidMount = () => {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.onFocusFunction()
        })
    }
    

    onFocusFunction = () => {
        console.log('onfoucs called')
        setTimeout(this.getFirebase, 500)
    }
    getFirebase = () => {
        console.log('getting from firebase')
        uid = Firebase.auth().currentUser.uid;
        datesRef = Firebase.firestore().collection('users').doc("" + uid).collection('dates')
        let datesObj = {}
        datesRef.get().then((querySnapshot) => {
            querySnapshot.forEach(function (doc) {
                datesObj["" + doc.id] = [{
                    date: doc.data().date,
                    text: doc.data().text,
                    mood: doc.data().mood
                }]
            });
            this.setState({
                olderEntries: datesObj,
            })
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });
    }

    getMarkedDates = () => {
        let markedDates = {};
        if (this.state.olderEntries !== undefined) {
            Object.keys(this.state.olderEntries).map(date => {
                var moodColor = 'black'
                if (this.state.olderEntries[date][0].mood === 'emoticon-sad'){
                    //moodColor = '#bacdde'
                    moodColor = 'blue'
                }
                if (this.state.olderEntries[date][0].mood === 'emoticon-neutral'){
                    //moodColor = '#decbba'
                    moodColor = 'orange'
                }  
                if (this.state.olderEntries[date][0].mood === 'emoticon-happy'){
                    //moodColor = '#BBDEBA'
                    moodColor = '#3bff05'
                }
                    
                markedDates[date] = {
                    marked: true,
                    dotColor: moodColor
                };
            });
        }



        return markedDates

    };

    onUpdateSelectedDate = date => {
        this.setState({
            selected: date.dateString
        });
    };

    renderItemForAgenda = item => {
        if (item.date === this.state.selected) {
            return (
                <View style={styles.item}>
                    <View style={styles.itemTop}>
                        <TouchableOpacity>
                            <MaterialCommunityIcons name={item.mood} color="#cbbade" size={30} />
                        </TouchableOpacity>
                        <Text>{item.date}</Text>
                        <TouchableOpacity onPress={() => this.getEntry(this.state.selected)}>
                            <MaterialCommunityIcons name='square-edit-outline' color="#cbbade" size={30} />
                        </TouchableOpacity>

                    </View>
                    <View pointerEvents="none">
                        <CNRichTextEditor
                            value={JSON.parse(item.text)}
                            foreColor='dimgray' // optional (will override default fore-color)
                            onValueChanged={() => { }}
                            styleList={this.customStyles}
                        />
                    </View>
                </View>
            );
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.calendarText}>Calendar</Text>
                <Agenda
                    firstDay={parseInt(
                        moment(new Date())
                            .day()
                            .toString(),
                        10
                    )}
                    selected={this.state.selected}
                    items={this.state.olderEntries}
                    renderItem={this.renderItemForAgenda}
                    renderDay={(day, item) => { return (<View />); }}
                    onDayPress={this.onUpdateSelectedDate}
                    markedDates={this.getMarkedDates()}
                    renderEmptyData={() => {
                        return (
                            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

                                <TouchableOpacity
                                    style={{ borderRadius: 5, borderWidth: 1, borderColor: "#cbbade", backgroundColor: "#cbbade", padding: 3, fontFamily: 'AppleSDGothicNeo-Light', marginBottom: 10 }}
                                    onPress={() => this.getEntry(this.state.selected)}>
                                    <Text style={{ fontFamily: 'AppleSDGothicNeo-Light' }}>Add Entry</Text>
                                </TouchableOpacity>
                                <Text>No saved entry</Text>
                            </View>
                        )
                    }}
                    rowHasChanged={(r1, r2) => r1.date !== r2.date}
                    theme={{
                        agendaDayNumColor: '#CBBADE',
                        agendaDayTextColor: '#CBBADE',
                        agendaKnobColor: '#efefef',
                        agendaTodayColor: '#CBBADE',
                        dotColor: '#CBBADE',
                        todayTextColor: '#CBBADE',
                        selectedDayBackgroundColor: '#CBBADE',
                        'stylesheet.calendar.header': {
                            week: { marginTop: 0, flexDirection: 'row', justifyContent: 'space-between' }
                        }
                    }}
                />
            </View>
        )
    }
}

export default CalendarScreen


const styles = StyleSheet.create({

    container: {
        flex: 1,
        // height: "100%",
        // width: "100%",
        // justifyContent: 'center',
        // alignItems: 'center',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: 'white',
    },
    calendarText: {
        //marginTop: '-25%',
        fontFamily: 'BodoniSvtyTwoITCTT-Bold',
        margin: 10,
        paddingLeft: 20,
        fontSize: 35,
        color: '#383838'
    },
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        //padding: Constants.statusBarHeight,
        //margin: Constants.statusBarHeight,
        marginRight: 10,
        marginLeft: 10,
        marginTop: 17,
        fontSize: 5,
    },
    itemTop: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 18,
        borderBottomWidth: 0.5,
        borderColor: '#70757A',

    }


});