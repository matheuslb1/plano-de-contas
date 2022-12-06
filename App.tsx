import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import HomeScreen from "./src/screens/Home";
import EditScreen from "./src/screens/Edit";
import store, { persistor } from "./src/redux/store";
import { PersistGate } from "redux-persist/lib/integration/react";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Edit" component={EditScreen} />
            </Stack.Navigator>
          </NavigationContainer>

          <StatusBar barStyle="light-content" />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
