import React from 'react'
import { View, Text, TextInput, StyleSheet, Button } from 'react-native'
import Constants from 'expo-constants';

class JournalScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = { entry: 'What happened toaday? '};
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style = {styles.title}>Today Date:</Text>
                <View style={styles.line}/>
                <TextInput 
                    multiline 
                    autogrow 
                    scrollEnabled 
                    style={styles.entry}>
                        Journal!!
                </TextInput>
                <Button title="Add Journal Entry"/>
            </View>
        )
    }
}

let styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: 'column',
        paddingTop: Constants.statusBarHeight,
        alignItems: "center",
      }, 
      line:{
        borderBottomColor: 'black',
        borderBottomWidth: 10,
        marginBottom: 10
      },
      title:{
        fontFamily: 'BodoniSvtyTwoITCTT-Bold',
        fontSize: 25,
        color: '#383838'
      },
      entry:{
          width: "100%",
          padding: 10,
          borderColor: 'black',
          borderWidth: 2,
      }

})

export default JournalScreen