import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Constants from 'expo-constants';
import moment from "moment";
import Firebase from '../Firebase'
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
class HomeScreen extends React.Component {

    constructor(props) {
        super(props)
        this.state = { quote: "" }
        this.getEntry.bind(this)
    }
    getEntry = () => {
        date = moment().format('YYYY-MM-DD')
        email = Firebase.auth().currentUser.email;
        entry = Firebase.firestore().collection('users').doc("" + email).collection(date).doc("text");
        entry.get().then((e) => {
            if (e.exists) {
                text = e.data().value;
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
    }

    componentDidMount() {
        this.getQuote()
    }

    async getQuote() {
        let response = await fetch("http://quotes.rest/qod.json?category=inspire")
        let parseObject = await response.json()
        console.log(parseObject)
        this.setState({
            quote: parseObject.contents.quotes[0].quote
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.feelingText}> How Are You Today?</Text>
                <View style={styles.moodIcons}>
                    <TouchableOpacity onPress={() => this.getEntry()} style={styles.mood}>
                        <MaterialCommunityIcons name="emoticon-neutral" color="#cbbade" size={55} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.getEntry()} style={styles.mood}>
                        <MaterialCommunityIcons name="emoticon-happy" color="#cbbade" size={55} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Journal')} style={styles.mood}>
                        <MaterialCommunityIcons name="emoticon-happy" color="#cbbade" size={55} />
                    </TouchableOpacity>
                </View>

                <View style={styles.quoteContainer}>
                    {/* <Text>Quote of the Day</Text> */}
                    <Text style={styles.quoteText}>{this.state.quote}</Text>
                </View>
            </View>
        )
    }
}
export default HomeScreen

const styles = StyleSheet.create({

    container: {
        flex: 1,
        height: "100%",
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    feelingText: {
        //marginTop: '-25%',
        fontFamily: 'BodoniSvtyTwoITCTT-Bold',
        fontSize: 35,
        color: '#383838'
    },
    moodIcons: {
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    mood: {
        margin: 10,
        marginTop: 20
    },
    quoteContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    quoteText: {
        fontSize: 30,
        fontFamily: 'AppleSDGothicNeo-Light',
        textAlign: 'center',
        color: '#383838',
    }
});

