import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import LoginScreen from './components/LoginScreen'
import SignupScreen from './components/SignupScreen'
import WelcomeScreen from './components/WelcomeScreen'
import HomeScreen from './components/HomeScreen'


const rootStack = createStackNavigator({
  Login: LoginScreen,
  Signup: SignupScreen,
  Welcome: WelcomeScreen,
  Home: HomeScreen,
}, {
    initialRouteName: 'Welcome'
  }
);
const AppContainer = createAppContainer(rootStack)
export default AppContainer;
