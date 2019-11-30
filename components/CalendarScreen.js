import React from 'react'
import Firebase from '../Firebase'
import { View, Text, StyleSheet } from 'react-native';
import Constants from "expo-constants";
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import moment from "moment";

const appointments = {
    '2019-09-14': [
      {
        key: 32,
        year: '2019',
        month: '7',
        day: '11',
        mins: '00',
        hour: '21',
        time: '09:00 PM',
        title: 'Shave (Customer1)',
        date: '2019-09-14'
      }
    ],
    '2019-09-15': [
      {
        key: 32,
        year: '2019',
        month: '7',
        day: '11',
        mins: '00',
        hour: '21',
        time: '09:00 PM',
        title: 'Shave (Customer1)',
        date: '2019-09-14'
      }
    ],
    '2019-09-16': [
      {
        key: 32,
        year: '2019',
        month: '7',
        day: '11',
        mins: '00',
        hour: '21',
        time: '09:00 PM',
        title: 'Shave (Customer1)',
        date: '2019-09-14'
      }
    ],
}

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

    componentDidMount() {
        uid = Firebase.auth().currentUser.uid;
        datesRef = Firebase.firestore().collection('users').doc("" + uid).collection('dates')

        datesRef.get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
        // fireRef.on("value", snapshot => {
        //   let allChallenges = snapshot.val();
        //   let tempList = [];
        //   for (let challenge in allChallenges) {
        //     tempList.push({
        //       key: challenge,
        //       title: allChallenges[challenge].title,
        //       text: allChallenges[challenge].text,
        //       date: allChallenges[challenge].date,
        //       time: allChallenges[challenge].time,
        //       submission: allChallenges[challenge].submission
        //     });
        //   }
        //   this.setState({
        //     challengeArray: tempList
        //   });
        // });
      }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.calendarText}>Calendar</Text>
                {/* <Calendar
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
                /> */}
                <Agenda
                    firstDay={parseInt(
                        moment(new Date())
                        .day()
                        .toString(),
                        10
                    )}
                    items={appointments}
                    renderItem={item => (
                        <View style={[styles.item]}>
                        <Text
                            style={{ color: '#6a6a6a' }}
                        >
                            {item.time} &mdash; {item.title}
                        </Text>
                        </View>
                    )}
                    renderEmptyData={() => <View style={{ flex: 1, flexDirection:'column',justifyContent: 'center', alignItems: 'center' }}><Text>No saved entry</Text></View>}
                    rowHasChanged={(r1, r2) => r1.title !== r2.title}
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
        marginTop: 17
      },

});