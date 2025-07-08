import { SplashScreen as CustomSplashScreen } from "@/components/SplashScreen";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import Head from "expo-router/head";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Platform, View, StyleSheet } from "react-native";
import "react-native-reanimated";
import "../global.css";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, fontError] = useFonts({
    "Montserrat-Black": require("../assets/fonts/Montserrat-Black.ttf"),
    "SpaceMono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [appIsReady, setAppIsReady] = useState(false);
  const [isNativeSplashHidden, setIsNativeSplashHidden] = useState(false);
  const [isCustomSplashComplete, setIsCustomSplashComplete] = useState(false);

  // Check if all resources are loaded
  useEffect(() => {
    if (fontsLoaded || fontError) {
      setAppIsReady(true);
    }
  }, [fontsLoaded, fontError]);

  // Hide native splash screen when resources are loaded
  useEffect(() => {
    const hideNativeSplash = async () => {
      if (appIsReady) {
        if (Platform.OS !== "web") {
          await SplashScreen.hideAsync();
        }
        setIsNativeSplashHidden(true);
      }
    };

    hideNativeSplash();
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Head>
        <title>EduConnect</title>
        <meta name="description" content="Your learning companion" />
      </Head>

      {/* Loading state - prevents flash of content */}
      {(!isNativeSplashHidden || !isCustomSplashComplete) && (
        <View
          style={[
            styles.container,
            { backgroundColor: colorScheme === "dark" ? "#121212" : "#ffffff" },
          ]}
        />
      )}

      {/* Custom splash screen (shown after native splash is hidden) */}
      {isNativeSplashHidden && !isCustomSplashComplete && (
        <View style={styles.splashContainer}>
          <CustomSplashScreen
            onAnimationComplete={() => setIsCustomSplashComplete(true)}
          />
        </View>
      )}
      {/* Main app content */}
      {isCustomSplashComplete && (
        <>
          <Stack initialRouteName="auth/login">
            <Stack.Screen
              name="auth/login"
              options={{ title: "Login", headerShown: false }}
            />
            <Stack.Screen name="adminAuth/login" options ={{ title: "Admin Login", headerShown: false}}/>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </>
      )}
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent', 
  },
});