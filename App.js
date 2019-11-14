import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import LoginScreen from './components/LoginScreen'
import SignupScreen from './components/SignupScreen'
import WelcomeScreen from './components/WelcomeScreen'
import HomeScreen from './components/HomeScreen'
import CalendarScreen from './components/CalendarScreen'
import JournalScreen from './components/JournalScreen'


const AppStack = createBottomTabNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="ios-home" color={tintColor} size={25} />

        )
      }
    },
    Journal: {
      screen: JournalScreen,
      navigationOptions: {
        tabBarLabel: 'Journal',
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome name="pencil" color={tintColor} size={25} />
        )
      }
    },
    Calendar: {
      screen: CalendarScreen,
      navigationOptions: {
        tabBarLabel: 'Calendar',
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="ios-calendar" color={tintColor} size={25} />
        )
      }
    }
  }
);

const AuthStack = createStackNavigator(
  {
    Welcome: WelcomeScreen,
    Login: LoginScreen,
    Signup: SignupScreen,
  },
  {
    initialRouteName: 'Welcome'
  }
);

export default createAppContainer(
  createSwitchNavigator(
    {
      App: AppStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'App'
    }
  )
)
