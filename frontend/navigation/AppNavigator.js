import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Auth
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Student
import StudentHome from '../screens/student/StudentHome';
import AttendanceScreen from '../screens/student/AttendanceScreen';
import RatingScreen from '../screens/student/RatingScreen';
// ✅ ADDED NEW IMPORT
import StudentLecturesScreen from '../screens/student/StudentLecturesScreen';

// Lecturer
import LecturerHome from '../screens/lecturer/LecturerHome';
import LecturerReportForm from '../screens/lecturer/LecturerReportForm';
import ClassesScreen from '../screens/lecturer/ClassesScreen';
import MonitoringScreen from '../screens/lecturer/MonitoringScreen';
import LecturerRatingScreen from '../screens/lecturer/RatingScreen'; 
import StudentAttendanceScreen from '../screens/lecturer/StudentAttendanceScreen';
import LecturerReportsList from '../screens/lecturer/LecturerReportsList'; 

// Principal Lecturer (PRL)
import PrincipalLecturerHome from '../screens/principal/PrincipalLecturerHome';
import PRLCoursesScreen from '../screens/principal/CoursesScreen';
import PRLReportsScreen from '../screens/principal/ReportsScreen';
import PRLMonitoringScreen from '../screens/principal/MonitoringScreen';
import PRLRatingScreen from '../screens/principal/RatingScreen';
import PRLClassesScreen from '../screens/principal/ClassesScreen';

// Program Leader (PL)
import ProgramLeaderHome from '../screens/program/ProgramLeaderHome';
import PLCoursesScreen from '../screens/program/CoursesScreen';
import PLReportsScreen from '../screens/program/ReportsScreen';
import PLMonitoringScreen from '../screens/program/MonitoringScreen';
import PLClassesScreen from '../screens/program/ClassesScreen';
import PLLecturesScreen from '../screens/program/LecturesScreen';
import PLRatingScreen from '../screens/program/RatingScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        {/* Auth */}
        <Stack.Screen name="LoginScreen" component={LoginScreen}/>
        <Stack.Screen name="RegisterScreen" component={RegisterScreen}/>

        {/* Student */}
        <Stack.Screen name="StudentHome" component={StudentHome}/>
        {/* ✅ ADDED NEW SCREEN HERE */}
        <Stack.Screen name="StudentLecturesScreen" component={StudentLecturesScreen} options={{ title: 'View Lectures' }}/>
        <Stack.Screen name="AttendanceScreen" component={AttendanceScreen}/>
        <Stack.Screen name="RatingScreen" component={RatingScreen}/>

        {/* Lecturer */}
        <Stack.Screen name="LecturerHome" component={LecturerHome}/>
        <Stack.Screen name="LecturerReportForm" component={LecturerReportForm}/>
        <Stack.Screen name="ClassesScreen" component={ClassesScreen}/>
        <Stack.Screen name="MonitoringScreen" component={MonitoringScreen}/>
        <Stack.Screen name="LecturerRatingScreen" component={LecturerRatingScreen}/>
        <Stack.Screen name="StudentAttendanceScreen" component={StudentAttendanceScreen}/>
        <Stack.Screen name="LecturerReportsList" component={LecturerReportsList} />

        {/* Principal Lecturer */}
        <Stack.Screen name="PrincipalLecturerHome" component={PrincipalLecturerHome}/>
        <Stack.Screen name="PRLCoursesScreen" component={PRLCoursesScreen}/>
        <Stack.Screen name="PRLReportsScreen" component={PRLReportsScreen}/>
        <Stack.Screen name="PRLMonitoringScreen" component={PRLMonitoringScreen}/>
        <Stack.Screen name="PRLRatingScreen" component={PRLRatingScreen}/>
        <Stack.Screen name="PRLClassesScreen" component={PRLClassesScreen}/>

        {/* Program Leader */}
        <Stack.Screen name="ProgramLeaderHome" component={ProgramLeaderHome}/>
        <Stack.Screen name="PLCoursesScreen" component={PLCoursesScreen}/>
        <Stack.Screen name="PLReportsScreen" component={PLReportsScreen}/>
        <Stack.Screen name="PLMonitoringScreen" component={PLMonitoringScreen}/>
        <Stack.Screen name="PLClassesScreen" component={PLClassesScreen}/>
        <Stack.Screen name="PLLecturesScreen" component={PLLecturesScreen}/>
        <Stack.Screen name="PLRatingScreen" component={PLRatingScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}