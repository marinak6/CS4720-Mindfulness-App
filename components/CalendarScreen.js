import React from 'react'
import Firebase from '../Firebase'
import { View, Text, StyleSheet } from 'react-native';
import Constants from "expo-constants";
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import moment from "moment";


class CalendarScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: moment().format('YYYY-MM-DD')
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
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.calendarText}>Calendar</Text>
                <Calendar
                    current={'2019-11-14'}
                    markedDates={{ [this.state.selected]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' } }}

                    onDayPress={(date) => { this.getEntry(date.dateString) }}
                    // Handler which gets executed on day long press. Default = undefined
                    onDayLongPress={(day) => { console.log('selected day', day) }}
                    // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                    monthFormat={'MMM yyyy'}
                    // Handler which gets executed when visible month changes in calendar. Default = undefined
                    onMonthChange={(month) => { console.log('month changed', month) }}

                    // Do not show days of other months in month page. Default = false
                    hideExtraDays={true}
                    // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
                    // day from another month that is visible in calendar page. Default = false
                    disableMonthChange={true}
                    // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
                    firstDay={1}
                    // Hide day names. Default = false
                    hideDayNames={true}

                    // Handler which gets executed when press arrow icon left. It receive a callback can go back month
                    onPressArrowLeft={substractMonth => substractMonth()}
                    // Handler which gets executed when press arrow icon left. It receive a callback can go next month
                    onPressArrowRight={addMonth => addMonth()}

                    style={{
                        borderWidth: 1,
                        borderColor: 'gray',
                        width: '85%',

                    }}
                    // Specify theme properties to override specific styles for calendar parts. Default = {}
                    theme={{
                        backgroundColor: '#ffffff',
                        calendarBackground: '#ffffff',
                        selectedDayBackgroundColor: '#CBBADE',
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: '#383838',
                        textDisabledColor: '#d9e1e8',
                        arrowColor: '#CBBADE',
                        dotColor: '#00adf5',
                        selectedDotColor: '#ffffff',
                        textDayFontWeight: '300',
                        textMonthFontWeight: 'bold',
                        textDayHeaderFontWeight: '300',
                        textDayFontSize: 16,
                        textMonthFontSize: 16,
                        monthTextColor: '#383838',
                        dayTextColor: '#383838',
                        textDayHeaderFontSize: 16
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
        height: "100%",
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    calendarText: {
        //marginTop: '-25%',
        fontFamily: 'BodoniSvtyTwoITCTT-Bold',
        margin: 10,
        fontSize: 35,
        color: '#383838'
    },

});