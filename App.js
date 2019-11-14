import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Login from './components/Login'
import Signup from './components/Signup'
import Welcome from './components/Welcome'


const rootStack = createStackNavigator({
  Login: Login,
  Signup: Signup,
  Welcome: Welcome,
}, {
    initalRouteName: 'Login'
  }
);
const AppContainer = createAppContainer(rootStack)
export default AppContainer;