import React, {useState} from 'react';
import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Login from './src/screens/Login';
import AdminDashboard from './src/screens/AdminDashboard';
import Sections from './src/screens/Sections';
import AddSection from './src/screens/AddSection';
import SectionDetails from './src/screens/SectionDetails';
import EditSection from './src/screens/EditSection';
import Supervisors from './src/screens/Supervisors';
import ProductBatches from './src/screens/ProductBatches';
import AddProduct from './src/screens/AddProduct.jsx';
import BatchDetails from './src/screens/BatchDetails';
import Defects from './src/screens/Defects';
import EmployeeProductivity from './src/screens/EmployeeProductivity';
import AddEmployee from './src/screens/AddEmployee';
import EmployeeRecord from './src/screens/EmployeeRecord';
import EmployeeDetail from './src/screens/EmployeeDetail';
import EmployeeAttendance from './src/screens/EmployeeAttendance';
import EmployeeViolation from './src/screens/EmployeeViolation';
import ViolationDetails from './src/screens/ViolationDetails';
import EmployeeRanking from './src/screens/EmployeeRanking';
import EmployeeSummary from './src/screens/EmployeeSummary.jsx';
import SupervisorDashboard from './src/screens/SupervisorDashboard';
import BatchDefectMonitoring from './src/screens/BatchDefectMonitoring';
import EmployeeMonitoring from './src/screens/EmployeeMonitoring';
import DefectsSummary from './src/screens/DefectsSummary';
import EmployeeLogin from './src/screens/EmployeeLogin';
import EmployeeLoginHome from './src/screens/EmployeeLoginHome';
import EmployeeProfile from './src/screens/EmployeeProfile';
import EditProfile from './src/screens/EditProfile';
import SplashScreen from './src/screens/SplashScreen';
import PrimaryAppBar from './src/components/PrimaryAppBar';
import SecondaryAppBar from './src/components/SecondaryAppBar';
import ProductionDashboard from './src/screens/ProductionDashboard';
import RawMaterials from './src/screens/RawMaterials';
import Inventory from './src/screens/Inventory';
import InventoryDetail from './src/screens/InventoryDetail';
import Products from './src/screens/Products';
import LinkProduct from './src/screens/LinkProduct';
import AddBatch from './src/screens/AddBatch';
import ChooseStock from './src/screens/ChooseStock';
import DeactivatedSections from './src/screens/DeactivatedSections';
import EditSupervisor from './src/screens/EditSupervisor';
import ViolationSummary from './src/screens/ViolationSummary';
import DefectMonitoringTypes from './src/screens/DefectMonitoringTypes';
import MultipleAngleMonitoring from './src/screens/MultipleAngleMonitoring';
import MarkAttendance from './src/screens/MarkAttendance';
import Guests from './src/screens/Guests';
import AddGuest from './src/screens/AddGuest';
import GuestViolation from './src/screens/GuestViolation';

const Stack = createNativeStackNavigator();
const LIGHT_STATUS_BAR_SCREENS = ['Splash Screen', 'Login'];

const App = () => {
  const [routeName, setRouteName] = useState('Splash Screen');
  const isLight = LIGHT_STATUS_BAR_SCREENS.includes(routeName);

  return (
    <SafeAreaProvider>
      <SafeAreaView
        edges={['top']}
        style={{flex: 1, backgroundColor: isLight ? '#FFFFFF' : '#2196F3'}}>
        <StatusBar style={isLight ? 'dark' : 'light'} />
        <NavigationContainer
          onStateChange={state =>
            setRouteName(state?.routes[state.index]?.name)
          }>
          <Stack.Navigator
            screenOptions={{
              headerTintColor: 'white',
              headerTransparent: false,
              headerStyle: {
                backgroundColor: '#2196F3',
              },
              headerTitleStyle: {fontSize: 19},
            }}>
            <Stack.Screen
              name="Splash Screen"
              component={SplashScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Admin Dashboard"
              component={AdminDashboard}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Sections"
              component={Sections}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Deactivated Sections"
              component={DeactivatedSections}
              options={{
                header: () => <PrimaryAppBar text="Deactivated Sections" />,
              }}
            />
            <Stack.Screen
              name="Add Section"
              component={AddSection}
              options={{header: () => <PrimaryAppBar text="Add Section" />}}
            />
            <Stack.Screen
              name="Section Detail"
              component={SectionDetails}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Edit Section"
              component={EditSection}
              options={{header: () => <PrimaryAppBar text="Edit Section" />}}
            />
            <Stack.Screen
              name="Supervisors"
              component={Supervisors}
              options={() => ({
                header: () => <PrimaryAppBar text={'Supervisors'} />,
              })}
            />
            <Stack.Screen
              name="Edit Supervisor"
              component={EditSupervisor}
              options={() => ({
                header: () => <PrimaryAppBar text={'Edit Supervisor'} />,
              })}
            />
            <Stack.Screen
              name="Production"
              component={ProductionDashboard}
              options={() => ({
                header: () => <PrimaryAppBar text="Production" />,
              })}
            />
            <Stack.Screen
              name="Raw Material"
              component={RawMaterials}
              options={() => ({
                header: () => <PrimaryAppBar text="Raw Materials" />,
              })}
            />
            <Stack.Screen
              name="Add Product"
              component={AddProduct}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Inventory"
              component={Inventory}
              options={() => ({
                header: () => <PrimaryAppBar text={'Inventory'} />,
              })}
            />
            <Stack.Screen
              name="Inventory Detail"
              component={InventoryDetail}
              options={() => ({
                headerShown: false,
              })}
            />

            <Stack.Screen
              name="Products"
              component={Products}
              options={() => ({
                header: () => <PrimaryAppBar text={'Products'} />,
              })}
            />

            <Stack.Screen
              name="Link Product"
              component={LinkProduct}
              options={() => ({
                header: () => <PrimaryAppBar text={'Link Product'} />,
              })}
            />
            <Stack.Screen
              name="Product Batches"
              component={ProductBatches}
              options={() => ({
                headerShown: false,
              })}
            />

            <Stack.Screen
              name="Add Batch"
              component={AddBatch}
              options={() => ({
                headerShown: false,
              })}
            />
            <Stack.Screen
              name="Choose Stock"
              component={ChooseStock}
              options={() => ({
                headerShown: false,
              })}
            />
            <Stack.Screen
              name="Batch Detail"
              component={BatchDetails}
              options={{headerShown: false}}
            />

            <Stack.Screen
              name="Defects"
              component={Defects}
              options={{headerShown: false}}
            />

            <Stack.Screen
              name="Add Employee"
              component={AddEmployee}
              options={() => ({
                header: () => <PrimaryAppBar text={'Add Employee'} />,
              })}
            />
            <Stack.Screen
              name="Employee Record"
              component={EmployeeRecord}
              options={() => ({
                header: () => <PrimaryAppBar text={'Employee Record'} />,
              })}
            />
            <Stack.Screen
              name="Employee Detail"
              component={EmployeeDetail}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Employee Violation"
              component={EmployeeViolation}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Violation Details"
              component={ViolationDetails}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Employee Summary"
              component={EmployeeSummary}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Attendance"
              component={EmployeeAttendance}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Employee Productivity"
              component={EmployeeProductivity}
              options={() => ({
                headerShown: false,
              })}
            />
            <Stack.Screen
              name="Employees Ranking"
              component={EmployeeRanking}
              options={() => ({
                header: () => <PrimaryAppBar text={'Employee Ranking'} />,
              })}
            />
            <Stack.Screen
              name="Guests"
              component={Guests}
              options={() => ({
                header: () => <PrimaryAppBar text={'Guests'} />,
              })}
            />
            <Stack.Screen
              name="Add Guest"
              component={AddGuest}
              options={() => ({
                header: () => <PrimaryAppBar text={'Add Guest'} />,
              })}
            />
            <Stack.Screen
              name="Guest Violation"
              component={GuestViolation}
              options={() => ({
                headerShown: false,
              })}
            />
            <Stack.Screen
              options={{headerShown: false}}
              name="Supervisor Dashboard"
              component={SupervisorDashboard}
            />
            <Stack.Screen
              name="Employee Monitoring"
              component={EmployeeMonitoring}
              options={{
                header: () => <SecondaryAppBar text="" />,
              }}
            />
            <Stack.Screen
              name="Mark Attendance"
              component={MarkAttendance}
              options={{
                header: () => <SecondaryAppBar text="" />,
              }}
            />
            <Stack.Screen
              name="Violation Summary"
              component={ViolationSummary}
              options={{
                header: () => <SecondaryAppBar text="Violation Summary" />,
              }}
            />
            <Stack.Screen
              name="Defect Monitoring Types"
              component={DefectMonitoringTypes}
              options={{
                header: () => (
                  <SecondaryAppBar text="Defect Monitoring Types" />
                ),
              }}
            />
            <Stack.Screen
              name="Batch Defect Monitoring"
              component={BatchDefectMonitoring}
              options={{
                header: () => <SecondaryAppBar text="Batch Monitoring" />,
              }}
            />
            <Stack.Screen
              name="Defects Summary"
              component={DefectsSummary}
              options={{
                header: () => <SecondaryAppBar text="Detection Summary" />,
              }}
            />
            <Stack.Screen
              name="Multiple Angle Monitoring"
              component={MultipleAngleMonitoring}
              options={{
                header: () => (
                  <SecondaryAppBar text="Multiple Angle Monitoring" />
                ),
              }}
            />
            <Stack.Screen
              name="Employee Login"
              component={EmployeeLogin}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Home"
              component={EmployeeLoginHome}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Employee Profile"
              component={EmployeeProfile}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Edit Profile"
              component={EditProfile}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;
