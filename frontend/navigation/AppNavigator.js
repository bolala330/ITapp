import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// AUTH
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// LECTURER MODULE
import LecturerHome from '../screens/lecturer/LecturerHome';
import LecturerReportForm from '../screens/lecturer/LecturerReportForm';
import LecturerReportsList from '../screens/lecturer/LecturerReportsList';
import LecturerClassesScreen from '../screens/lecturer/ClassesScreen';
import LecturerRatingScreen from '../screens/lecturer/LecturerRatingScreen';
import LecturerMonitoringScreen from '../screens/lecturer/MonitoringScreen';
import LecturerAttendanceScreen from '../screens/lecturer/StudentAttendanceScreen';

// STUDENT MODULE
import StudentHome from '../screens/student/StudentHome';
import StudentAttendanceScreen from '../screens/student/AttendanceScreen';
import StudentRatingScreen from '../screens/student/RatingScreen';
import StudentLecturesScreen from '../screens/student/StudentLecturesScreen';
import StudentMonitoringScreen from '../screens/student/StudentMonitoringScreen';

// PRINCIPAL (PRL) MODULE
import PrincipalLecturerHome from '../screens/principal/PrincipalLecturerHome';
import PRLReportsScreen from '../screens/principal/ReportsScreen';
import PRLRatingScreen from '../screens/principal/RatingScreen';
import PRLCoursesScreen from '../screens/principal/CoursesScreen';
import PRLMonitoringScreen from '../screens/principal/MonitoringScreen';
import PRLClassesScreen from '../screens/principal/ClassesScreen';

// PROGRAM LEADER (PL) MODULE
import ProgramLeaderHome from '../screens/program/ProgramLeaderHome';
import PLCoursesScreen from '../screens/program/CoursesScreen';
import PLClassesScreen from '../screens/program/ClassesScreen';
import PLLecturesScreen from '../screens/program/LecturesScreen';
import PLMonitoringScreen from '../screens/program/MonitoringScreen';
import PLRatingScreen from '../screens/program/RatingScreen';
import PLReportsScreen from '../screens/program/ReportsScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        
        {/* AUTH */}
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register' }} />

        {/* LECTURER MODULE */}
        <Stack.Screen name="LecturerHome" component={LecturerHome} options={{ title: 'Lecturer Dashboard' }} />
        <Stack.Screen name="LecturerReportForm" component={LecturerReportForm} options={{ title: 'New Report' }} />
        <Stack.Screen name="LecturerReportsList" component={LecturerReportsList} options={{ title: 'My Reports' }} />
        <Stack.Screen name="LecturerClasses" component={LecturerClassesScreen} options={{ title: 'My Classes' }} />
        <Stack.Screen name="LecturerRatingScreen" component={LecturerRatingScreen} options={{ title: 'Ratings' }} />
        <Stack.Screen name="LecturerMonitoring" component={LecturerMonitoringScreen} options={{ title: 'Monitoring' }} />
        <Stack.Screen name="LecturerAttendance" component={LecturerAttendanceScreen} options={{ title: 'Take Attendance' }} />

        {/* STUDENT MODULE */}
        <Stack.Screen name="StudentHome" component={StudentHome} options={{ title: 'Student Dashboard' }} />
        <Stack.Screen name="StudentAttendance" component={StudentAttendanceScreen} options={{ title: 'My Attendance' }} />
        <Stack.Screen name="StudentRating" component={StudentRatingScreen} options={{ title: 'Rate Lecturer' }} />
        <Stack.Screen name="StudentLectures" component={StudentLecturesScreen} options={{ title: 'My Lectures' }} />
        <Stack.Screen name="StudentMonitoring" component={StudentMonitoringScreen} options={{ title: 'Monitoring' }} />

        {/* PRINCIPAL (PRL) MODULE */}
        <Stack.Screen name="PrincipalHome" component={PrincipalLecturerHome} options={{ title: 'Principal Dashboard' }} />
        <Stack.Screen name="PRLCoursesScreen" component={PRLCoursesScreen} options={{ title: 'Courses' }} />
        <Stack.Screen name="PRLClassesScreen" component={PRLClassesScreen} options={{ title: 'Classes' }} />
        <Stack.Screen name="PRLReportsScreen" component={PRLReportsScreen} options={{ title: 'Reports' }} />
        <Stack.Screen name="PRLRatingScreen" component={PRLRatingScreen} options={{ title: 'Rating' }} />
        <Stack.Screen name="PRLMonitoringScreen" component={PRLMonitoringScreen} options={{ title: 'Monitoring' }} />

        {/* PROGRAM LEADER (PL) MODULE */}
        <Stack.Screen name="ProgramHome" component={ProgramLeaderHome} options={{ title: 'Program Leader' }} />
        <Stack.Screen name="PLCoursesScreen" component={PLCoursesScreen} options={{ title: 'Courses' }} />
        <Stack.Screen name="PLClassesScreen" component={PLClassesScreen} options={{ title: 'Classes' }} />
        <Stack.Screen name="PLLecturesScreen" component={PLLecturesScreen} options={{ title: 'Lectures' }} />
        <Stack.Screen name="PLMonitoringScreen" component={PLMonitoringScreen} options={{ title: 'Monitoring' }} />
        <Stack.Screen name="PLRatingScreen" component={PLRatingScreen} options={{ title: 'Rating' }} />
        <Stack.Screen name="PLReportsScreen" component={PLReportsScreen} options={{ title: 'Reports' }} />

        {/* GENERIC FIX: Added this line to handle the "RatingScreen" error */}
        <Stack.Screen name="RatingScreen" component={StudentRatingScreen} options={{ title: 'Rating' }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}