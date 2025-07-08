import { useColorScheme } from "@/hooks/useColorScheme";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  StyleSheet,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export function SplashScreen({ onAnimationComplete }) {
  const colorScheme = useColorScheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const textAnim = useRef(new Animated.Value(0)).current;
  const containerAnim = useRef(new Animated.Value(0)).current;
  const finalLogoAnim = useRef(new Animated.Value(0)).current;
  const bgOpacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Combined animation sequence
    Animated.parallel([
      // Container animation
      Animated.timing(containerAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      // Logo animations
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 2,
          tension: 60,
          useNativeDriver: true,
        }),
      ]),
      // Text animation
      Animated.sequence([
        Animated.delay(300),
        Animated.timing(textAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Final animation sequence
      Animated.sequence([
        Animated.delay(500), // Wait half a second before lifting
        Animated.parallel([
          // Logo lift and shrink animation
          Animated.timing(finalLogoAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          // Fade out other elements
          Animated.timing(textAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
          // Background fade to transparent
          Animated.timing(bgOpacityAnim, {
            toValue: 0,
            duration: 1000, // Fade out over 1 second
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        onAnimationComplete();
      });
    });
  }, []);

  // Animated text effect
  const text = "EduConnect";
  const animatedText = text.split("").map((char, index) => {
    const opacity = textAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: "clamp",
    });

    return (
      <Animated.Text
        key={index}
        style={[
          styles.text,
          {
            opacity,
            transform: [
              {
                translateY: textAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0],
                  extrapolate: "clamp",
                }),
              },
            ],
          },
        ]}
      >
        {char}
      </Animated.Text>
    );
  });

  // Final logo animation interpolations
  const logoTranslateY = finalLogoAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [35, -300], // Moves up 200 pixels
    extrapolate: "clamp",
  });

  const logoScale = finalLogoAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.27], // Shrinks to 30% size
    extrapolate: "clamp",
  });

  // Background color with opacity animation
  const bgColor = colorScheme === "dark" ? "#121212" : "#ffffff";
  const animatedBgStyle = {
    backgroundColor: bgColor,
    opacity: bgOpacityAnim,
  };

  return (
    <Animated.View
      style={[
        styles.container,
        animatedBgStyle,
        {
          opacity: containerAnim,
        },
      ]}
    >
      <View style={styles.centeredContent}>
       <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [
              { scale: Animated.multiply(scaleAnim, logoScale) },
              { translateY: logoTranslateY },
            ],
            marginBottom: 22, // equivalent to Tailwind's mb-3
            
            backgroundColor: '#E0E7FF', // Tailwind's bg-indigo-100
            padding: 40, // Tailwind's p-3
            borderRadius: 9999, // Tailwind's rounded-full
            alignSelf: 'center', // optional: to center it like your original View
          }}
        >
          <Image
            source={require("@/assets/images/education-logo.png")}
            style={styles.logo} 
            resizeMode="contain"
            accessibilityLabel="EduConnect logo"
          />
        </Animated.View>

        <Animated.View style={{ opacity: textAnim }} className={"mt-8"}>
          <View style={styles.textContainer}>{animatedText}</View>
          <Animated.Text
            style={[
              styles.subtitle,
              {
                transform: [
                  {
                    translateY: textAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [10, 0],
                      extrapolate: "clamp",
                    }),
                  },
                ],
              },
            ]}
          >
            Your Career Path Guide 
          </Animated.Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    position: "absolute",
    top: -270,
    left: 0,
    right: 0,
    bottom: 0,
  },
  centeredContent: {
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    maxWidth: 400,
  },
  logo: {
    width: 150,
    height: 150,
    padding:6, 
  },
  textContainer: {
    flexDirection: "row",
    marginBottom: 10,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  text: {
    fontSize: 36,
    fontWeight: "800",
    color: "#4a6da7",
    fontFamily: "Montserrat-Black",
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginHorizontal: 2,
  },
  subtitle: {
    fontSize: 18,
    color: "#888",
    fontFamily: "SpaceMono-Regular",
    letterSpacing: 1.2,
    textAlign: "center",
    marginTop: 10,
  },
});