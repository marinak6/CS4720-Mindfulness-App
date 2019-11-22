import React from 'react'
import Firebase from '../Firebase'
import { View, Text, StyleSheet } from 'react-native';
import Constants from "expo-constants";
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

class CalendarScreen extends React.Component {
    constructor(props) {
        super(props);
        this.getEntry.bind(this)
    }

    getEntry = (date) => {
        email = Firebase.auth().currentUser.email;
        entry = Firebase.firestore().collection('users').doc("" + email).collection(date).doc("text");
        console.log(date)
        entry.get().then((e) => {
            if (e.exists) {
                text = e.data().value;
                text
                this.props.navigation.navigate('Journal', {
                    text: text,
                    date: date
                });
            }
            else {
                console.log(date)
                this.props.navigation.navigate('Journal', {
                    text: "",
                    date: date
                });
            }
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <Text>Calendar!</Text>
                <Calendar
                    // Initially visible month. Default = Date()
                    current={'2019-11-14'}
                    // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                    // minDate={'2019-01-01'}
                    // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                    // maxDate={'2019-12-31'}
                    // Handler which gets executed on day press. Default = undefined
                    //onDayPress={() => this.props.navigation.navigate('Journal')}
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
                        height: 350
                    }}
                    // Specify theme properties to override specific styles for calendar parts. Default = {}
                    theme={{
                        backgroundColor: '#ffffff',
                        calendarBackground: '#ffffff',
                        selectedDayBackgroundColor: '#00adf5',
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: '#00adf5',
                        textDisabledColor: '#d9e1e8',
                        dotColor: '#00adf5',
                        selectedDotColor: '#ffffff',
                        textDayFontWeight: '300',
                        textMonthFontWeight: 'bold',
                        textDayHeaderFontWeight: '300',
                        textDayFontSize: 16,
                        textMonthFontSize: 16,
                        textDayHeaderFontSize: 16
                    }}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
    }
})

export default CalendarScreen