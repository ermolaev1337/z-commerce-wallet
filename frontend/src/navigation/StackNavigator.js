import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo, AntDesign,Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import ActionScreen from "../screens/ActionScreen";
import ConnectionScreen from "../screens/ConnectionScreen";
import CredentialScreen from "../screens/CredentialScreen";

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  function BottomTabs() {
    return (
      <Tab.Navigator>
         <Tab.Screen
          name="Action"
          component={ActionScreen}
          options={{
            tabBarLabel: "Action",
            tabBarLabelStyle: { color: "#008E97" },
            tabBarIcon: ({ focused }) =>
              focused ? (
                <AntDesign name="bells" size={24} color="#008E97" />
              ) : (
                <AntDesign name="bells" size={24} color="black" />
              ),

          }}
        /> 
        <Tab.Screen
          name="Credential"
          component={CredentialScreen}
          options={{
            tabBarLabel: "Credential",
            tabBarLabelStyle: { color: "#008E97" },
            tabBarIcon: ({ focused }) =>
              focused ? (
                <AntDesign name="idcard" size={24} color="#008E97" />
              ) : (
                <AntDesign name="idcard" size={24} color="black" />
              ),
          }}
        />

        <Tab.Screen
          name="Connection"
          component={ConnectionScreen}
          options={{
            tabBarLabel: "Connection",
            tabBarLabelStyle: { color: "#008E97" },
            tabBarIcon: ({ focused }) =>
              focused ? (
                <AntDesign name="key" size={24} color="#008E97" />
              ) : (
                <AntDesign name="key" size={24} color="black" />
              ),
          }}
        />
      </Tab.Navigator>
    );
  }
  return (
    <NavigationContainer>
      <View style={styles.contentContainer}>
        <View style={styles.content}>
          <Stack.Navigator initialRouteName="Main"
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen
              name="Main"
              component={BottomTabs}
              options={{ headerShown: false }} />
          </Stack.Navigator>
        </View>
      </View>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 5,
  },
  header: {
    flex: 0.1,
  },
  content: {
    flex: 1,
  },
});
