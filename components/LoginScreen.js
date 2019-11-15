import React from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Button } from 'react-native'
import Firebase from '../Firebase'

class LoginScreen extends React.Component {
  state = {
    email: '',
    password: ''
  }

  handleLogin = () => {
    const { email, password } = this.state
    Firebase.auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => this.props.navigation.navigate('Home'))
      .catch(error => console.log(error))
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcomeTitle}> Mindfulness</Text>
        <TextInput
          style={styles.inputBox}
          value={this.state.email}
          onChangeText={email => this.setState({ email })}
          placeholder='Email'
          autoCapitalize='none'
        />
        <TextInput
          style={styles.inputBox}
          value={this.state.password}
          onChangeText={password => this.setState({ password })}
          placeholder='Password'
          secureTextEntry={true}
        />
        <TouchableOpacity onPress={this.handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Signup')}
        >
          <Text style={styles.signUpLink}> Don't have an account yet? Sign up </Text>
        </TouchableOpacity>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -100
  },
  welcomeTitle: {
    fontFamily: 'BodoniSvtyTwoITCTT-Bold',
    fontSize: 50,
    padding: 10
  },
  signUpLink: {
    fontFamily: 'AppleSDGothicNeo-Light',
    fontSize: 20,
  },
  inputBox: {
    width: '85%',
    margin: 10,
    padding: 15,
    fontSize: 16,
    borderColor: '#D3D3D3',
    borderBottomWidth: 1,
    textAlign: 'center'
  },
  button: {
    marginTop: 30,
    marginBottom: 20,
    paddingVertical: 5,
    alignItems: 'center',
    backgroundColor: '#CBBADE',
    borderColor: '#CBBADE',
    borderWidth: 1,
    borderRadius: 5,
    width: 200
  },
  buttonText: {
    fontFamily: 'KohinoorBangla-Semibold',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff'
  },
  buttonSignup: {
    fontSize: 12
  }
})
export default LoginScreen