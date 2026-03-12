import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FloatingReportButton from './src/components/FloatingReportButton';
import DashboardScreen from './src/screens/DashboardScreen';
import DetailScreen from './src/screens/DetailScreen';
import ListScreen from './src/screens/ListScreen';
import ReportScreen from './src/screens/ReportScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={({navigation})=>({
            title: 'Incidents',
            headerRight: ()=> (
              <Button title="Report" onPress={()=>navigation.navigate('Report')} />
            )
          })}
        />
        <Stack.Screen name="List" component={ListScreen} />
        <Stack.Screen name="Report" component={ReportScreen} />
        <Stack.Screen name="Guardian" component={require('./src/screens/GuardianAlertScreen').default} />
        <Stack.Screen name="Detail" component={DetailScreen} />
      </Stack.Navigator>
      <FloatingReportButton onPress={() => { /* handled inside screens if needed */ }} />
    </NavigationContainer>
  );
}
