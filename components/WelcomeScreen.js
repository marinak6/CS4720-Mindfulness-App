import React from 'react';
import { Button, View, Text } from 'react-native';

export default class WelcomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text> Mindfullness</Text>
        <Button title="Login" onPress={() => this.props.navigation.navigate('Login')} />
        <Button title="Signup" onPress={() => this.props.navigation.navigate('Signup')} />
      </View>
    );
  }
}