import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Constants from 'expo-constants';
import moment from "moment";
import Firebase from '../Firebase'
import {
    Ionicons, FontAwesome, MaterialCommunityIcons,
    SimpleLineIcons
} from '@expo/vector-icons';
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
        this.setState({
            quote: parseObject.contents.quotes[0].quote
        })
    }

    handleLogout = () => {
        Firebase.auth()
            .signOut()
            .then(() => this.props.navigation.navigate('Welcome'))
            .catch(error => console.log(error))
    }

    render() {
        return (
            <View style={styles.screen}>
                <TouchableOpacity onPress={this.handleLogout} style={styles.logout}>
                    <SimpleLineIcons name="logout" color="#383838" size={25} />
                </TouchableOpacity>
                <View style={styles.container}>
                    <Text style={styles.feelingText}> How Are You Today?</Text>
                    <View style={styles.moodIcons}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Journal',{mood:"emoticon-sad"})} style={styles.mood}>
                            <MaterialCommunityIcons name="emoticon-sad" color="#bacdde" size={55} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Journal',{mood:"emoticon-neutral"})} style={styles.mood}>
                            <MaterialCommunityIcons name="emoticon-neutral" color="#decbba" size={55} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Journal',{mood:"emoticon-happy"})} style={styles.mood}>
                            <MaterialCommunityIcons name="emoticon-happy" color="#BBDEBA" size={55} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.quoteContainer}>
                        {/* <Text>Quote of the Day</Text> */}
                        <Text style={styles.quoteText}>{this.state.quote}</Text>
                    </View>
                </View>
            </View>
        )
    }
}
export default HomeScreen

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        height: "100%",
        width: "100%",
        flexDirection: 'column',

    },
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
        padding: 35
    },
    quoteText: {
        fontSize: 30,
        fontFamily: 'AppleSDGothicNeo-Light',
        textAlign: 'center',
        color: '#383838',
    },
    logout: {
        marginTop: 40,
        marginLeft: 20,
        justifyContent: 'flex-start',
        alignSelf: 'flex-start'
    }
});

