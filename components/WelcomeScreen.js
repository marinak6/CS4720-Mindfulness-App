import React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class WelcomeScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcomeTitle}> Mindfulness</Text>
        <Text style={styles.subTitle}> HOW ARE YOU TODAY? </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Signup')}
          >
            <Text style={styles.buttonText}>SIGN UP</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginTop: -100
  },
  welcomeTitle: {
    fontFamily: 'BodoniSvtyTwoITCTT-Bold',
    fontSize: 50,
    padding: 10,
  },
  subTitle: {
    fontFamily: 'AppleSDGothicNeo-Light',
    fontSize: 15,
  },
  buttonText: {
    fontFamily: 'KohinoorBangla-Semibold',
    fontSize: 30
  },
  buttonContainer: {
    alignItems: 'center', // center buttons within container 
    marginTop: 50
  }
})