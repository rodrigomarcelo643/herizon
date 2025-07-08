import RotatingDots from "@/components/ui/RotatingDots";
import {
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { useColorScheme } from "nativewind";
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Extrapolate,
  FadeIn,
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const { height, width } = Dimensions.get("window");
const isWeb = Platform.OS === "web";

export default function WelcomeScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Hero background style with parallax effect
  const heroBgStyle = useAnimatedStyle(() => ({
    height: height,
    width: "100%",
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [0, height],
          [0, -height * 0.3],
          Extrapolate.CLAMP
        ),
      },
      {
        scale: interpolate(
          scrollY.value,
          [0, height],
          [1, 1.2],
          Extrapolate.CLAMP
        ),
      },
    ],
  }));

  // Navbar animation styles
  const navbarStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, 100],
      [80, 60],
      Extrapolate.CLAMP
    );
    const paddingVertical = interpolate(
      scrollY.value,
      [0, 100],
      [12, 6],
      Extrapolate.CLAMP
    );
    return {
      height,
      paddingVertical,
    };
  });

  const navbarBgStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 100],
      [0.8, 0.95],
      Extrapolate.CLAMP
    );
    return {
      opacity,
    };
  });

  const logoStyle = useAnimatedStyle(() => {
    const size = interpolate(
      scrollY.value,
      [0, 100],
      [24, 20],
      Extrapolate.CLAMP
    );
    return {
      width: size,
      height: size,
    };
  });

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Animated Navbar */}
      <Animated.View
        className={`flex-row justify-between items-center px-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 ${
          isWeb ? "px-12" : ""
        }`}
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            width: "100%",
          },
          navbarStyle,
        ]}
      >
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: isDark
                ? "rgba(17, 24, 39, 0.8)"
                : "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(10px)",
            },
            navbarBgStyle,
          ]}
        />

        <View className="flex-row items-center z-10">
          <Animated.Image
            source={require("../assets/images/education-logo.png")}
            style={logoStyle}
            className="mr-2"
          />
          <Text className="text-lg font-bold text-gray-900 dark:text-white">
            EduConnect
          </Text>
        </View>

        <View className="flex-row items-center space-x-4 z-10">
          <Link href="/auth/login" asChild>
            <TouchableOpacity className="px-3 py-1.5">
              <Text className="text-gray-700 dark:text-gray-300 font-medium">
                Login
              </Text>
            </TouchableOpacity>
          </Link>
          <Link href="/auth/signup" asChild>
            <TouchableOpacity className="bg-indigo-600 px-4 py-2 rounded-full">
              <Text className="text-white font-medium">Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </Animated.View>

      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        className="flex-1 bg-white mt-[70px] dark:bg-gray-900"
      >
        {/* Hero Section */}
        <View className="relative" style={{ height }}>
          <Animated.Image
            source={require("../assets/images/edu-bg.jpg")}
            style={heroBgStyle}
            className="absolute"
            resizeMode="cover"
          />

          <Animated.View className="absolute top-0 left-0 right-0 bottom-0  dark:bg-black/60" />

          <View
            className="flex-1 justify-center items-center px-6"
            style={{ paddingTop: isWeb ? 0 : 80 }}
          >
            <Animated.View
              className="bg-white/20 dark:bg-black/30 p-5 rounded-full mb-8 backdrop-blur-sm"
              entering={FadeInUp.delay(400)}
            >
              <Image
                source={require("../assets/images/education-logo.png")}
                className="w-20 h-20"
              />
            </Animated.View>

            <Animated.Text
              className="font-bold text-white mb-6 leading-tight text-5xl text-center max-w-2xl"
              entering={FadeInUp.delay(600)}
            >
              Discover Your {"\n"}Perfect Career Path
            </Animated.Text>

            <Animated.Text
              className="text-white/90 mb-10 text-xl text-center max-w-md"
              entering={FadeInUp.delay(800)}
            >
              AI-powered assessment to find your ideal strand and college path
            </Animated.Text>

            <Animated.View entering={FadeInUp.delay(1000)}>
              <RotatingDots color="#ffffff" />
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(1200)}>
              <Link href="/assessment" asChild>
                <TouchableOpacity
                  className="bg-white dark:bg-indigo-500 px-10 py-4 rounded-full mt-12 shadow-2xl"
                  activeOpacity={0.8}
                >
                  <Text className="text-indigo-600 dark:text-white font-bold text-lg">
                    Start Your Assessment →
                  </Text>
                </TouchableOpacity>
              </Link>
            </Animated.View>
          </View>
        </View>
        {/* Assessment Section */}
        <Animated.View
          className={`min-h-screen bg-white dark:bg-gray-800 py-16 ${
            isWeb ? "px-12" : "px-6"
          }`}
          entering={FadeIn.delay(200)}
        >
          <Animated.Text
            className={`font-bold text-center mb-12 text-gray-900 dark:text-white ${
              isWeb ? "text-4xl" : "text-3xl"
            }`}
            entering={FadeInDown.delay(300)}
          >
            Find Your Perfect Strand
          </Animated.Text>

          <View
            className={`flex-row flex-wrap justify-between ${
              isWeb ? "max-w-6xl mx-auto" : ""
            }`}
          >
            <Animated.View
              className={`bg-indigo-50 dark:bg-gray-700 p-6 rounded-2xl mb-6 shadow-sm ${
                isWeb ? "w-[48%]" : "w-full"
              }`}
              entering={FadeInLeft.delay(400)}
            >
              <View className="flex-row items-center mb-4">
                <View className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full mr-4">
                  <Feather name="cpu" size={24} color="#6366f1" />
                </View>
                <Text className="text-xl font-bold text-gray-900 dark:text-white">
                  STEM
                </Text>
              </View>
              <Text className="text-gray-600 dark:text-gray-300 mb-4">
                Science, Technology, Engineering, and Mathematics. Perfect for
                future engineers, doctors, scientists, and tech innovators.
              </Text>
              <Link href="/assessment?strand=stem" asChild>
                <TouchableOpacity className="bg-indigo-100 dark:bg-indigo-900 px-4 py-2 rounded-full self-start">
                  <Text className="text-indigo-600 dark:text-indigo-200 font-medium">
                    Explore STEM
                  </Text>
                </TouchableOpacity>
              </Link>
            </Animated.View>

            <Animated.View
              className={`bg-blue-50 dark:bg-gray-700 p-6 rounded-2xl mb-6 shadow-sm ${
                isWeb ? "w-[48%]" : "w-full"
              }`}
              entering={FadeInRight.delay(500)}
            >
              <View className="flex-row items-center mb-4">
                <View className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-4">
                  <MaterialIcons
                    name="attach-money"
                    size={24}
                    color="#3b82f6"
                  />
                </View>
                <Text className="text-xl font-bold text-gray-900 dark:text-white">
                  ABM
                </Text>
              </View>
              <Text className="text-gray-600 dark:text-gray-300 mb-4">
                Accountancy, Business, and Management. Ideal for future
                entrepreneurs, accountants, and business leaders.
              </Text>
              <Link href="/assessment?strand=abm" asChild>
                <TouchableOpacity className="bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-full self-start">
                  <Text className="text-blue-600 dark:text-blue-200 font-medium">
                    Explore ABM
                  </Text>
                </TouchableOpacity>
              </Link>
            </Animated.View>

            <Animated.View
              className={`bg-purple-50 dark:bg-gray-700 p-6 rounded-2xl mb-6 shadow-sm ${
                isWeb ? "w-[48%]" : "w-full"
              }`}
              entering={FadeInLeft.delay(600)}
            >
              <View className="flex-row items-center mb-4">
                <View className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full mr-4">
                  <FontAwesome5 name="book-reader" size={20} color="#8b5cf6" />
                </View>
                <Text className="text-xl font-bold text-gray-900 dark:text-white">
                  HUMSS
                </Text>
              </View>
              <Text className="text-gray-600 dark:text-gray-300 mb-4">
                Humanities and Social Sciences. Perfect for future lawyers,
                psychologists, teachers, and writers.
              </Text>
              <Link href="/assessment?strand=humss" asChild>
                <TouchableOpacity className="bg-purple-100 dark:bg-purple-900 px-4 py-2 rounded-full self-start">
                  <Text className="text-purple-600 dark:text-purple-200 font-medium">
                    Explore HUMSS
                  </Text>
                </TouchableOpacity>
              </Link>
            </Animated.View>

            <Animated.View
              className={`bg-green-50 dark:bg-gray-700 p-6 rounded-2xl mb-6 shadow-sm ${
                isWeb ? "w-[48%]" : "w-full"
              }`}
              entering={FadeInRight.delay(700)}
            >
              <View className="flex-row items-center mb-4">
                <View className="bg-green-100 dark:bg-green-900 p-3 rounded-full mr-4">
                  <Ionicons name="options" size={24} color="#10b981" />
                </View>
                <Text className="text-xl font-bold text-gray-900 dark:text-white">
                  GAS
                </Text>
              </View>
              <Text className="text-gray-600 dark:text-gray-300 mb-4">
                General Academic Strand. Flexible path for students exploring
                multiple disciplines or undecided careers.
              </Text>
              <Link href="/assessment?strand=gas" asChild>
                <TouchableOpacity className="bg-green-100 dark:bg-green-900 px-4 py-2 rounded-full self-start">
                  <Text className="text-green-600 dark:text-green-200 font-medium">
                    Explore GAS
                  </Text>
                </TouchableOpacity>
              </Link>
            </Animated.View>
          </View>
        </Animated.View>

        {/* College Prep Section */}
        <Animated.View
          className={`min-h-screen bg-gray-50 dark:bg-gray-900 py-16 ${
            isWeb ? "px-12" : "px-6"
          }`}
          entering={FadeIn.delay(800)}
        >
          <Animated.Text
            className={`font-bold text-center mb-12 text-gray-900 dark:text-white ${
              isWeb ? "text-4xl" : "text-3xl"
            }`}
            entering={FadeInDown.delay(900)}
          >
            Get College Ready
          </Animated.Text>

          <View
            className={`flex-row flex-wrap justify-center ${
              isWeb ? "max-w-6xl mx-auto" : ""
            }`}
          >
            <Animated.View
              className={`p-6 ${isWeb ? "w-1/3" : "w-full"}`}
              entering={FadeInLeft.delay(1000)}
            >
              <View className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm h-full">
                <View className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded-full w-16 h-16 items-center justify-center mb-6">
                  <Feather name="target" size={24} color="#6366f1" />
                </View>
                <Text className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  College Matching
                </Text>
                <Text className="text-gray-600 dark:text-gray-300 mb-6">
                  Discover the perfect colleges for your chosen career path
                  based on your skills and preferences.
                </Text>
                <Link href="/college-matching" asChild>
                  <TouchableOpacity className="flex-row items-center">
                    <Text className="text-indigo-600 dark:text-indigo-400 font-medium mr-2">
                      Find Colleges
                    </Text>
                    <Feather
                      name="arrow-right"
                      size={18}
                      color={isDark ? "#818cf8" : "#6366f1"}
                    />
                  </TouchableOpacity>
                </Link>
              </View>
            </Animated.View>

            <Animated.View
              className={`p-6 ${isWeb ? "w-1/3" : "w-full"}`}
              entering={FadeInUp.delay(1100)}
            >
              <View className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm h-full">
                <View className="bg-green-100 dark:bg-green-900 p-4 rounded-full w-16 h-16 items-center justify-center mb-6">
                  <Feather name="award" size={24} color="#10b981" />
                </View>
                <Text className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Scholarship Finder
                </Text>
                <Text className="text-gray-600 dark:text-gray-300 mb-6">
                  Access thousands of scholarship opportunities tailored to your
                  profile and academic goals.
                </Text>
                <Link href="/scholarships" asChild>
                  <TouchableOpacity className="flex-row items-center">
                    <Text className="text-green-600 dark:text-green-400 font-medium mr-2">
                      Find Scholarships
                    </Text>
                    <Feather
                      name="arrow-right"
                      size={18}
                      color={isDark ? "#6ee7b7" : "#10b981"}
                    />
                  </TouchableOpacity>
                </Link>
              </View>
            </Animated.View>

            <Animated.View
              className={`p-6 ${isWeb ? "w-1/3" : "w-full"}`}
              entering={FadeInRight.delay(1200)}
            >
              <View className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm h-full">
                <View className="bg-purple-100 dark:bg-purple-900 p-4 rounded-full w-16 h-16 items-center justify-center mb-6">
                  <Feather name="map" size={24} color="#8b5cf6" />
                </View>
                <Text className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Career Roadmap
                </Text>
                <Text className="text-gray-600 dark:text-gray-300 mb-6">
                  Get a personalized step-by-step plan from high school to your
                  dream career.
                </Text>
                <Link href="/roadmap" asChild>
                  <TouchableOpacity className="flex-row items-center">
                    <Text className="text-purple-600 dark:text-purple-400 font-medium mr-2">
                      View Roadmap
                    </Text>
                    <Feather
                      name="arrow-right"
                      size={18}
                      color={isDark ? "#a78bfa" : "#8b5cf6"}
                    />
                  </TouchableOpacity>
                </Link>
              </View>
            </Animated.View>
          </View>
        </Animated.View>

        {/* Testimonials Section */}
        <Animated.View
          className={`min-h-screen bg-indigo-600 dark:bg-indigo-900 py-16 ${
            isWeb ? "px-12" : "px-6"
          }`}
          entering={FadeIn.delay(1300)}
        >
          <Animated.Text
            className={`font-bold text-center mb-12 text-white ${
              isWeb ? "text-4xl" : "text-3xl"
            }`}
            entering={FadeInDown.delay(1400)}
          >
            Success Stories
          </Animated.Text>

          <View
            className={`flex-row flex-wrap justify-center ${
              isWeb ? "max-w-6xl mx-auto" : ""
            }`}
          >
            {[
              {
                name: "Maria Santos",
                strand: "STEM",
                college: "University of the Philippines",
                testimonial:
                  "EduConnect helped me realize my passion for biomedical engineering. The assessment was spot on!",
                avatar: "👩‍🔬",
              },
              {
                name: "Juan Dela Cruz",
                strand: "ABM",
                college: "Ateneo de Manila University",
                testimonial:
                  "I was undecided until I took the assessment. Now I'm on my way to becoming an entrepreneur!",
                avatar: "👨‍💼",
              },
              {
                name: "Sophia Reyes",
                strand: "HUMSS",
                college: "De La Salle University",
                testimonial:
                  "The career roadmap showed me exactly what courses to take to become a human rights lawyer.",
                avatar: "👩‍⚖️",
              },
            ].map((student, index) => (
              <Animated.View
                key={index}
                className={`p-4 ${isWeb ? "w-1/3" : "w-full"}`}
                entering={FadeInUp.delay(1500 + index * 200)}
              >
                <View className="bg-white/10 p-6 rounded-2xl h-full backdrop-blur-sm">
                  <Text className="text-4xl mb-4">{student.avatar}</Text>
                  <Text className="text-white text-lg font-bold mb-2">
                    {student.name}
                  </Text>
                  <Text className="text-indigo-200 mb-1">
                    {student.strand} Graduate
                  </Text>
                  <Text className="text-indigo-100 mb-4">
                    Now at {student.college}
                  </Text>
                  <Text className="text-white/90 italic">
                    "{student.testimonial}"
                  </Text>
                </View>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Final CTA */}
        <Animated.View
          className={`min-h-[50vh] bg-gradient-to-b from-indigo-600 to-indigo-700 dark:from-indigo-800 dark:to-indigo-900 py-16 flex items-center justify-center ${
            isWeb ? "px-12" : "px-6"
          }`}
          entering={FadeIn.delay(2000)}
        >
          <View className={`${isWeb ? "max-w-6xl mx-auto" : ""}`}>
            <Animated.Text
              className={`font-bold text-center mb-8 text-white ${
                isWeb ? "text-5xl" : "text-4xl"
              }`}
              entering={FadeInUp.delay(2100)}
            >
              Ready to Discover Your Perfect Career Path?
            </Animated.Text>
            <Animated.Text
              className={`text-center text-white/90 mb-12 ${
                isWeb ? "text-xl max-w-4xl" : "text-lg max-w-2xl"
              }`}
              entering={FadeInUp.delay(2200)}
            >
              Take our 10-minute assessment and get a personalized report with
              career recommendations, college matches, and scholarship
              opportunities.
            </Animated.Text>
            <Animated.View
              className={`${isWeb ? "" : "w-full items-center"}`}
              entering={FadeInUp.delay(2300)}
            >
              <Link href="/assessment" asChild>
                <TouchableOpacity
                  className={`bg-white dark:bg-indigo-500 px-12 py-5 rounded-full shadow-2xl ${
                    isWeb ? "" : "w-full max-w-md"
                  }`}
                  activeOpacity={0.8}
                >
                  <Text className="text-indigo-600 dark:text-white font-bold text-lg text-center">
                    Start Free Assessment Now
                  </Text>
                </TouchableOpacity>
              </Link>
            </Animated.View>
          </View>
        </Animated.View>
      </Animated.ScrollView>
    </>
  );
}
