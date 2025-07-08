import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const AdminLoginScreen = () => {
  // Login form states
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [loginFocused, setLoginFocused] = useState({
    username: false,
    password: false,
  });
  const [loginState, setLoginState] = useState({
    loading: false,
    error: "",
    showPassword: false,
    showLoginLoading: false,
  });

  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  // Animation refs
  const usernameAnim = useRef(new Animated.Value(0)).current;
  const passwordAnim = useRef(new Animated.Value(0)).current;

  const isWeb = Platform.OS === "web";

  // Animation helpers
  const labelPosition = (anim: Animated.Value) => {
    return anim.interpolate({
      inputRange: [0, 1],
      outputRange: isWeb ? [20, 8] : [13, 0],
    });
  };

  const labelSize = (anim: Animated.Value) => {
    return anim.interpolate({
      inputRange: [0, 1],
      outputRange: isWeb ? [16, 13] : [16, 12],
    });
  };

  const animateLabel = (anim: Animated.Value, toValue: number) => {
    Animated.spring(anim, {
      toValue,
      useNativeDriver: false,
      speed: 20,
      bounciness: 10,
    }).start();
  };

  // Form handlers
  const handleInputChange = (field: string, value: string) => {
    setLoginData((prev) => ({ ...prev, [field]: value }));
    if (loginState.error) setLoginState((prev) => ({ ...prev, error: "" }));
  };

  const handleFocus = (field: string, anim: Animated.Value) => {
    setLoginFocused((prev) => ({ ...prev, [field]: true }));
    animateLabel(anim, 1);
  };

  const handleBlur = (field: string, anim: Animated.Value) => {
    setLoginFocused((prev) => ({ ...prev, [field]: false }));
    if (!loginData[field as keyof typeof loginData]) animateLabel(anim, 0);
  };

  // Validation functions
  const validateLoginForm = () => {
    if (!loginData.username.trim()) {
      setLoginState((prev) => ({ ...prev, error: "Admin ID is required" }));
      return false;
    }
    if (!loginData.password.trim()) {
      setLoginState((prev) => ({ ...prev, error: "Password is required" }));
      return false;
    }
    if (loginData.password.length < 8) {
      setLoginState((prev) => ({
        ...prev,
        error: "Password must be at least 8 characters",
      }));
      return false;
    }
    setLoginState((prev) => ({ ...prev, error: "" }));
    return true;
  };

  // Action handlers
  const handleLogin = () => {
    if (!validateLoginForm()) return;

    Keyboard.dismiss();
    setLoginState((prev) => ({
      ...prev,
      loading: true,
      showLoginLoading: true,
    }));

    // Simulate admin authentication
    setTimeout(() => {
      // In a real app, you would verify credentials with your backend
      if (loginData.username === "admin" && loginData.password === "admin123") {
        setLoginState((prev) => ({
          ...prev,
          loading: false,
          showLoginLoading: false,
        }));
        router.replace("/admin/dashboard");
      } else {
        setLoginState((prev) => ({
          ...prev,
          loading: false,
          showLoginLoading: false,
          error: "Invalid admin credentials",
        }));
        Toast.show({
          type: "error",
          text1: "Authentication Failed",
          text2: "Invalid admin ID or password",
          visibilityTime: 4000,
        });
      }
    }, 1500);
  };

  const togglePasswordVisibility = () => {
    setLoginState((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
      keyboardVerticalOffset={Platform.OS === "android" ? 20 : 0}
    >
      {/* Loading Modal */}
      <Modal visible={loginState.showLoginLoading} transparent>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-64 items-center">
            <ActivityIndicator size="large" color="#6366f1" />
            <Text className="mt-4 text-lg font-medium text-gray-800">
              Authenticating...
            </Text>
          </View>
        </View>
      </Modal>

      {/* Background elements */}
      <View className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-bl-full" />
      <View className="absolute bottom-0 left-0 w-32 h-32 bg-amber-50 rounded-tr-full" />

      {/* Main content */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
        ref={scrollViewRef}
      >
        <View className="flex-1 justify-center px-2 py-4">
          <View
            className={`bg-white p-8 rounded-xl shadow-sm border border-gray-100 ${isWeb ? "max-w-md" : ""} w-full mx-auto`}
          >
            <View className="items-center mb-8">
              <View className="bg-indigo-100 p-3 rounded-full mb-3">
                <Image
                  source={require("../../assets/images/education-logo.png")}
                  className="w-12 h-12"
                  accessibilityLabel="Education logo"
                />
              </View>

              <Text className="text-3xl text-indigo-800 font-bold">
                Admin Portal
              </Text>

              <View className="mt-1">
                <Text className="text-gray-500 text-center">
                  Access the administration dashboard to manage {"\n"}
                  <Text className="text-indigo-600 font-medium">
                    system settings and user data
                  </Text>
                </Text>
              </View>
            </View>

            {/* Username Input */}
            <View className={isWeb ? "mb-1" : "mb-4"}>
              <Animated.Text
                className={`absolute left-0 z-10 ${isWeb ? "" : "top-1 mb-2"}`}
                style={{
                  top: labelPosition(usernameAnim),
                  fontSize: labelSize(usernameAnim),
                  color: loginFocused.username ? "#6366f1" : "#6b7280",
                  transform: [{ translateY: labelPosition(usernameAnim) }],
                }}
              >
                Admin ID
              </Animated.Text>
              <View
                className={`border-b pb-1 mb-5 ${loginFocused.username ? "border-indigo-500 border-b-2" : "border-gray-200"}`}
              >
                <TextInput
                  className={`${isWeb ? "h-12" : "h-14"} text-base pt-5 w-full text-gray-900 ${isWeb ? "outline-none" : ""}`}
                  value={loginData.username}
                  onChangeText={(text) => handleInputChange("username", text)}
                  onFocus={() => handleFocus("username", usernameAnim)}
                  onBlur={() => handleBlur("username", usernameAnim)}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Input */}
            <View className={isWeb ? "mb-1" : "mb-4"}>
              <Animated.Text
                className={`absolute left-0 z-10 ${isWeb ? "" : "top-1 mb-2"}`}
                style={{
                  top: labelPosition(passwordAnim),
                  fontSize: labelSize(passwordAnim),
                  color: loginFocused.password ? "#6366f1" : "#6b7280",
                  transform: [{ translateY: labelPosition(passwordAnim) }],
                }}
              >
                Password
              </Animated.Text>
              <View
                className={`border-b pb-1 mb-5 ${loginFocused.password ? "border-indigo-500 border-b-2" : "border-gray-200"}`}
              >
                <View className="flex-row items-center">
                  <TextInput
                    className={`${isWeb ? "h-12" : "h-14"} text-base pt-5 flex-1 text-gray-900 ${isWeb ? "outline-none" : ""}`}
                    value={loginData.password}
                    onChangeText={(text) => handleInputChange("password", text)}
                    onFocus={() => handleFocus("password", passwordAnim)}
                    onBlur={() => handleBlur("password", passwordAnim)}
                    secureTextEntry={!loginState.showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={togglePasswordVisibility}
                    className="ml-2 px-2 py-1"
                  >
                    <Text className="text-indigo-600 text-sm">
                      {loginState.showPassword ? "Hide" : "Show"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {loginState.error ? (
              <Text className="text-red-500 text-sm mt-2 text-center">
                {loginState.error}
              </Text>
            ) : null}

            <TouchableOpacity
              className={`h-14 bg-indigo-600 rounded-full justify-center items-center shadow-sm mt-6 ${loginState.loading ? "opacity-80" : ""} ${isWeb ? "hover:bg-indigo-700" : ""}`}
              onPress={handleLogin}
              disabled={loginState.loading}
            >
              <Text className="text-white text-lg font-medium">
                {loginState.loading ? "Sign in..." : "Login "}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Toast />
    </KeyboardAvoidingView>
  );
};

export default AdminLoginScreen;