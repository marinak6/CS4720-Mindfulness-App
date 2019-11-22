import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Constants from 'expo-constants';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
class HomeScreen extends React.Component {

    constructor(props){
        super(props)
        this.state = {quote: "Wait on quote"}
    }

    componentDidMount(){
        this.getQuote()
    }

    async getQuote(){
        //temp joke api
        let response = await fetch("http://api.icndb.com/jokes/random?limitTo=[nerdy]&firstName=Prof&lastName=X")
        //quote of the day api
        //let response = await fetch("http://quotes.rest/qod.json?category=inspire")
        let parseObject = await response.json()
        console.log(parseObject)
        this.setState({
            quote: parseObject.value.joke
            //quote: parseObject.contents.quotes[0].quote
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.feelingText}> How Are You Today?</Text>
                <View style={styles.moodIcons}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Journal')} style={styles.mood}>
                        <MaterialCommunityIcons name="emoticon-sad" color="#cbbade" size={55} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Journal')} style={styles.mood}>
                        <MaterialCommunityIcons name="emoticon-neutral" color="#cbbade" size={55} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Journal')} style={styles.mood}>
                        <MaterialCommunityIcons name="emoticon-happy" color="#cbbade" size={55} />
                    </TouchableOpacity>
                </View>

                <View style={styles.inspirationQuote}>
                    <Text>Quote of the Day</Text>
                    <Text>{this.state.quote}</Text>
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
        marginTop: '-25%',
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

    inspirationQuote: {
        fontSize: 20,
        color: '#383838',
        justifyContent: 'center',
        alignItems: 'center'
    },
});

