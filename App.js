import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import LoginScreen from './components/LoginScreen'
import SignupScreen from './components/SignupScreen'
import WelcomeScreen from './components/WelcomeScreen'
import HomeScreen from './components/HomeScreen'
import CalendarScreen from './components/CalendarScreen'
import JournalScreen from './components/JournalScreen'


const AppStack = createBottomTabNavigator({
  Home: HomeScreen,
  Calendar: CalendarScreen,
  Journal: JournalScreen,
});

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
      initialRouteName: 'Auth'
    }
  )
)
