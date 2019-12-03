import React from 'react'
import Firebase from '../Firebase'
import { View, Text, StyleSheet } from 'react-native';
import Constants from "expo-constants";
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import moment from "moment";
import { thisExpression } from '@babel/types';
import CNRichTextEditor, { getDefaultStyles, convertToObject, getInitialObject } from "react-native-cn-richtext-editor";

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
                this.props.navigation.navigate('Journal', {
                    text: text,
                    date: date
                });
            }
            else {
                this.props.navigation.navigate('Journal', {
                    text: "",
                    date: date
                });
            }
        })
        this.setState({
            selected: date,
        })
    }

    componentDidMount =()=> {
        uid = Firebase.auth().currentUser.uid;
        datesRef = Firebase.firestore().collection('users').doc("" + uid).collection('dates')
        let datesObj = {}
        datesRef.get().then((querySnapshot)=> {
            querySnapshot.forEach(function(doc) { 
                datesObj[""+doc.id] = [{
                    date: doc.data().date,
                    text: doc.data().text
                }]         
            });
            this.setState({
                olderEntries: datesObj,
                intialItemsLoad: datesObj
            })
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        }); 
      }

    getMarkedDates = () => {
        let markedDates = {};
        if(this.state.olderEntries!==undefined){
            Object.keys(this.state.olderEntries).map(date => {
                let moodColor = 'blue'
                if(date.mood === 'sad')
                    moodColor = 'red'
                else if(date.mood === 'neutral')
                    moodColor = 'yellow'
                else if(date.mood === 'happy')
                    moodColor = 'green'
                else{ moodColor = 'blue'}
                markedDates[date] = {
                    marked: true,
                    dotColor: moodColor
              };
            });
        }
        
    
        return markedDates
        
    };

    onUpdateSelectedDate = date => {
        const item = this.state.olderEntries[date.dateString];
        this.setState({
            intialItemsLoad: {item},
            selected: date.dateString
       });
    };

    renderItemForAgenda = item => {
        if(item.date === this.state.selected){
            console.log("I got in bitches!")
            return (
                <View style={styles.item}>
                    <View style={styles.itemTop}>
                        <TouchableOpacity>
                            <MaterialCommunityIcons name={item.mood} color="#cbbade" size={55} />
                        </TouchableOpacity>
                        <Text>{item.date}</Text>
                        <TouchableOpacity>
                            <MaterialCommunityIcons name='square-edit-outline' color="#cbbade" size={25} />
                        </TouchableOpacity>

                    </View>
                    <View  pointerEvents="none"> 
                        <CNRichTextEditor
                            value={JSON.parse(item.text)}
                            foreColor='dimgray' // optional (will override default fore-color)
                            onValueChanged={()=>{ }}
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
                {console.log(this.state.olderEntries)}
                <Agenda
                    firstDay={parseInt(
                        moment(new Date())
                        .day()
                        .toString(),
                        10
                    )}
                    items={this.state.olderEntries}
                    renderItem={this.renderItemForAgenda}
                    renderDay={(day, item) => {return (<View />);}}
                    onDayPress={this.onUpdateSelectedDate}
                    markedDates = {this.getMarkedDates()}
                    renderEmptyData={() => <View style={{ flex: 1, flexDirection:'column',justifyContent: 'center', alignItems: 'center' }}><Text>No saved entry</Text></View>}
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
        backgroundColor: 'white',
    },
    calendarText: {
        //marginTop: '-25%',
        fontFamily: 'BodoniSvtyTwoITCTT-Bold',
        margin: 10,
        fontSize: 35,
        color: '#383838'
    },
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17,
        fontSize: 5,
    },
    itemTop:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 18,
        borderBottomWidth: 0.5,
        borderColor: '#70757A',

    }


});