import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import RotatingDots from "@/components/ui/RotatingDots";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BottomSheet from "react-native-gesture-bottom-sheet";
import Toast from "react-native-toast-message";

const LoginScreen = () => {
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

  // Sign up form states
  const [signUpData, setSignUpData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    avatar: null as string | null,
  });
  const [signUpFocused, setSignUpFocused] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
    phone: false,
  });
  const [signUpState, setSignUpState] = useState({
    step: 1,
    error: "",
    loading: false,
    showPassword: false,
    acceptedPrivacyPolicy: false,
    showSignUpLoading: false,
  });

  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState({
    level: 0,
    message: "",
    color: "#e53e3e",
  });

  const router = useRouter();
  const bottomSheet = useRef(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Animation refs
  const usernameAnim = useRef(new Animated.Value(0)).current;
  const passwordAnim = useRef(new Animated.Value(0)).current;
  const signUpUsernameAnim = useRef(new Animated.Value(0)).current;
  const signUpEmailAnim = useRef(new Animated.Value(0)).current;
  const signUpPasswordAnim = useRef(new Animated.Value(0)).current;
  const signUpConfirmPasswordAnim = useRef(new Animated.Value(0)).current;
  const signUpPhoneAnim = useRef(new Animated.Value(0)).current;

  const isWeb = Platform.OS === "web";
  const windowHeight = Dimensions.get("window").height;

  // Password strength calculation
  useEffect(() => {
    if (signUpData.password) {
      const strength = calculatePasswordStrength(signUpData.password);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength({
        level: 0,
        message: "",
        color: "#e53e3e",
      });
    }
  }, [signUpData.password]);

  const calculatePasswordStrength = (password: string) => {
    const requirements = [
      password.length >= 6,
      /\d/.test(password),
      /[!@#$%^&*(),.?":{}|<>]/.test(password),
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
    ];

    const strength = requirements.filter(Boolean).length;

    if (strength <= 2)
      return { level: strength, message: "Weak", color: "#e53e3e" };
    if (strength <= 4)
      return { level: strength, message: "Medium", color: "#d69e2e" };
    return { level: strength, message: "Strong", color: "#38a169" };
  };

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
  const handleInputChange = (
    form: "login" | "signUp",
    field: string,
    value: string
  ) => {
    if (form === "login") {
      setLoginData((prev) => ({ ...prev, [field]: value }));
      if (loginState.error) setLoginState((prev) => ({ ...prev, error: "" }));
    } else {
      setSignUpData((prev) => ({ ...prev, [field]: value }));
      if (signUpState.error) setSignUpState((prev) => ({ ...prev, error: "" }));
    }
  };

  const handleFocus = (
    form: "login" | "signUp",
    field: string,
    anim: Animated.Value
  ) => {
    if (form === "login") {
      setLoginFocused((prev) => ({ ...prev, [field]: true }));
    } else {
      setSignUpFocused((prev) => ({ ...prev, [field]: true }));
    }
    animateLabel(anim, 1);
  };

  const handleBlur = (
    form: "login" | "signUp",
    field: string,
    anim: Animated.Value
  ) => {
    if (form === "login") {
      setLoginFocused((prev) => ({ ...prev, [field]: false }));
      if (!loginData[field as keyof typeof loginData]) animateLabel(anim, 0);
    } else {
      setSignUpFocused((prev) => ({ ...prev, [field]: false }));
      if (!signUpData[field as keyof typeof signUpData]) animateLabel(anim, 0);
    }
  };

  const scrollToInput = () => {
    if (!isWeb && scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  // Image picker
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSignUpData((prev) => ({ ...prev, avatar: result.assets[0].uri }));
    }
  };

  // Validation functions
  const validateLoginForm = () => {
    if (!loginData.username.trim()) {
      setLoginState((prev) => ({ ...prev, error: "Username is required" }));
      return false;
    }
    if (!loginData.password.trim()) {
      setLoginState((prev) => ({ ...prev, error: "Password is required" }));
      return false;
    }
    if (loginData.password.length < 6) {
      setLoginState((prev) => ({
        ...prev,
        error: "Password must be at least 6 characters",
      }));
      return false;
    }
    setLoginState((prev) => ({ ...prev, error: "" }));
    return true;
  };

  const validateSignUpFormStep1 = () => {
    if (!signUpData.username.trim()) {
      setSignUpState((prev) => ({ ...prev, error: "Username is required" }));
      return false;
    }
    if (!signUpData.email.trim()) {
      setSignUpState((prev) => ({ ...prev, error: "Email is required" }));
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(signUpData.email)) {
      setSignUpState((prev) => ({
        ...prev,
        error: "Please enter a valid email",
      }));
      return false;
    }
    if (!signUpData.phone.trim()) {
      setSignUpState((prev) => ({
        ...prev,
        error: "Phone number is required",
      }));
      return false;
    }
    setSignUpState((prev) => ({ ...prev, error: "" }));
    return true;
  };

  const validateSignUpFormStep2 = () => {
    if (!signUpData.password.trim()) {
      setSignUpState((prev) => ({ ...prev, error: "Password is required" }));
      return false;
    }
    if (signUpData.password.length < 6) {
      setSignUpState((prev) => ({
        ...prev,
        error: "Password must be at least 6 characters",
      }));
      return false;
    }
    if (passwordStrength.level <= 2) {
      setSignUpState((prev) => ({ ...prev, error: "Password is too weak" }));
      return false;
    }
    if (signUpData.password !== signUpData.confirmPassword) {
      setSignUpState((prev) => ({ ...prev, error: "Passwords do not match" }));
      return false;
    }
    if (!signUpState.acceptedPrivacyPolicy) {
      setSignUpState((prev) => ({
        ...prev,
        error: "You must accept the privacy policy",
      }));
      return false;
    }
    setSignUpState((prev) => ({ ...prev, error: "" }));
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

    setTimeout(() => {
      setLoginState((prev) => ({
        ...prev,
        loading: false,
        showLoginLoading: false,
      }));
      router.replace("/home");
    }, 1500);
  };

  const handleNextSignUpStep = () => {
    if (signUpState.step === 1 && validateSignUpFormStep1()) {
      setSignUpState((prev) => ({ ...prev, step: 2 }));
    }
  };

  const handlePreviousSignUpStep = () => {
    setSignUpState((prev) => ({ ...prev, step: 1 }));
  };

  const handleSignUp = () => {
    if (!validateSignUpFormStep2()) return;

    Keyboard.dismiss();
    setSignUpState((prev) => ({
      ...prev,
      loading: true,
      showSignUpLoading: true,
    }));

    setTimeout(() => {
      setSignUpState((prev) => ({
        ...prev,
        loading: false,
        showSignUpLoading: false,
        step: 1,
      }));
      setSignUpData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        avatar: null,
      });
      bottomSheet.current?.close();

      Toast.show({
        type: "success",
        text1: "Account created successfully!",
        text2: "You can now sign in with your credentials",
        visibilityTime: 4000,
      });
    }, 1500);
  };

  const togglePasswordVisibility = (form: "login" | "signUp") => {
    if (form === "login") {
      setLoginState((prev) => ({ ...prev, showPassword: !prev.showPassword }));
    } else {
      setSignUpState((prev) => ({ ...prev, showPassword: !prev.showPassword }));
    }
  };

  const openSignUpSheet = () => {
    bottomSheet.current?.show();
  };

  const openPrivacyPolicy = () => {
    Linking.openURL("https://example.com/privacy-policy");
  };

  // Render functions
  const renderSignUpStepIndicator = () => (
    <View className="flex-row justify-center items-center mb-4">
      <View className="flex-row items-center">
        <View
          className={`w-8 h-8 rounded-full justify-center items-center ${signUpState.step === 1 ? "bg-indigo-600" : "bg-gray-200"}`}
        >
          <Text
            className={`text-sm font-medium ${signUpState.step === 1 ? "text-white" : "text-gray-600"}`}
          >
            1
          </Text>
        </View>
        <View
          className={`h-1 w-12 ${signUpState.step === 1 ? "bg-indigo-200" : "bg-indigo-600"}`}
        />
        <View
          className={`w-8 h-8 rounded-full justify-center items-center ${signUpState.step === 2 ? "bg-indigo-600" : "bg-gray-200"}`}
        >
          <Text
            className={`text-sm font-medium ${signUpState.step === 2 ? "text-white" : "text-gray-600"}`}
          >
            2
          </Text>
        </View>
      </View>
    </View>
  );

  const renderSignUpStep1 = () => (
    <>
      <Text className="text-lg font-semibold text-gray-800 mb-6 text-center">
        Personal Information
      </Text>

      <View className={isWeb ? "mb-1" : "mb-4"}>
        <Animated.Text
          className={`absolute left-0 z-10 ${isWeb ? "" : "top-1 mb-2"}`}
          style={{
            top: labelPosition(signUpUsernameAnim),
            fontSize: labelSize(signUpUsernameAnim),
            color: signUpFocused.username ? "#6366f1" : "#6b7280",
            transform: [{ translateY: labelPosition(signUpUsernameAnim) }],
          }}
        >
          Username
        </Animated.Text>
        <View
          className={`border-b pb-1 mb-5 ${signUpFocused.username ? "border-indigo-500 border-b-2" : "border-gray-200"}`}
        >
          <TextInput
            className={`${isWeb ? "h-12" : "h-14"} text-base pt-5 w-full text-gray-900 ${isWeb ? "outline-none" : ""}`}
            value={signUpData.username}
            onChangeText={(text) =>
              handleInputChange("signUp", "username", text)
            }
            onFocus={() =>
              handleFocus("signUp", "username", signUpUsernameAnim)
            }
            onBlur={() => handleBlur("signUp", "username", signUpUsernameAnim)}
            autoCapitalize="none"
          />
        </View>
      </View>

      <View className={isWeb ? "mb-1" : "mb-4"}>
        <Animated.Text
          className={`absolute left-0 z-10 ${isWeb ? "" : "top-1 mb-2"}`}
          style={{
            top: labelPosition(signUpEmailAnim),
            fontSize: labelSize(signUpEmailAnim),
            color: signUpFocused.email ? "#6366f1" : "#6b7280",
            transform: [{ translateY: labelPosition(signUpEmailAnim) }],
          }}
        >
          Email
        </Animated.Text>
        <View
          className={`border-b pb-1 mb-5 ${signUpFocused.email ? "border-indigo-500 border-b-2" : "border-gray-200"}`}
        >
          <TextInput
            className={`${isWeb ? "h-12" : "h-14"} text-base pt-5 w-full text-gray-900 ${isWeb ? "outline-none" : ""}`}
            value={signUpData.email}
            onChangeText={(text) => handleInputChange("signUp", "email", text)}
            onFocus={() => handleFocus("signUp", "email", signUpEmailAnim)}
            onBlur={() => handleBlur("signUp", "email", signUpEmailAnim)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>

      <View className={isWeb ? "mb-1" : "mb-4"}>
        <Animated.Text
          className={`absolute left-0 z-10 ${isWeb ? "" : "top-1 mb-2"}`}
          style={{
            top: labelPosition(signUpPhoneAnim),
            fontSize: labelSize(signUpPhoneAnim),
            color: signUpFocused.phone ? "#6366f1" : "#6b7280",
            transform: [{ translateY: labelPosition(signUpPhoneAnim) }],
          }}
        >
          Phone Number
        </Animated.Text>
        <View
          className={`border-b pb-1 mb-5 ${signUpFocused.phone ? "border-indigo-500 border-b-2" : "border-gray-200"}`}
        >
          <TextInput
            className={`${isWeb ? "h-12" : "h-14"} text-base pt-5 w-full text-gray-900 ${isWeb ? "outline-none" : ""}`}
            value={signUpData.phone}
            onChangeText={(text) => handleInputChange("signUp", "phone", text)}
            onFocus={() => handleFocus("signUp", "phone", signUpPhoneAnim)}
            onBlur={() => handleBlur("signUp", "phone", signUpPhoneAnim)}
            keyboardType="phone-pad"
          />
        </View>
      </View>
    </>
  );

  const renderSignUpStep2 = () => (
    <>
      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity onPress={handlePreviousSignUpStep} className="p-2">
          <Text className="text-2xl">←</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-lg font-semibold text-gray-800 mb-6 text-center">
        Password & Security
      </Text>

      <View className={isWeb ? "mb-1" : "mb-4"}>
        <Animated.Text
          className={`absolute left-0 z-10 ${isWeb ? "" : "top-1 mb-2"}`}
          style={{
            top: labelPosition(signUpPasswordAnim),
            fontSize: labelSize(signUpPasswordAnim),
            color: signUpFocused.password ? "#6366f1" : "#6b7280",
            transform: [{ translateY: labelPosition(signUpPasswordAnim) }],
          }}
        >
          Password
        </Animated.Text>
        <View
          className={`border-b pb-1 mb-5 ${signUpFocused.password ? "border-indigo-500 border-b-2" : "border-gray-200"}`}
        >
          <TextInput
            className={`${isWeb ? "h-12" : "h-14"} text-base pt-5 w-full text-gray-900 ${isWeb ? "outline-none" : ""}`}
            value={signUpData.password}
            onChangeText={(text) =>
              handleInputChange("signUp", "password", text)
            }
            onFocus={() => {
              handleFocus("signUp", "password", signUpPasswordAnim);
              scrollToInput();
            }}
            onBlur={() => handleBlur("signUp", "password", signUpPasswordAnim)}
            secureTextEntry={!signUpState.showPassword}
          />
        </View>
        {signUpData.password && (
          <View className="mt-1">
            <View className="flex-row items-center mb-1">
              <Text className="text-xs text-gray-500 mr-2">Strength:</Text>
              <Text
                className="text-xs font-medium"
                style={{ color: passwordStrength.color }}
              >
                {passwordStrength.message}
              </Text>
            </View>
            <View className="flex-row h-1">
              <View
                className="h-full rounded-l"
                style={{
                  width: "33%",
                  backgroundColor:
                    passwordStrength.level > 0
                      ? passwordStrength.color
                      : "#e2e8f0",
                }}
              />
              <View
                className="h-full"
                style={{
                  width: "33%",
                  backgroundColor:
                    passwordStrength.level > 2
                      ? passwordStrength.color
                      : "#e2e8f0",
                }}
              />
              <View
                className="h-full rounded-r"
                style={{
                  width: "34%",
                  backgroundColor:
                    passwordStrength.level > 4
                      ? passwordStrength.color
                      : "#e2e8f0",
                }}
              />
            </View>
            <Text className="text-xs text-gray-500 mt-1">
              Use 6+ characters with numbers, symbols, and mixed case
            </Text>
          </View>
        )}
      </View>

      <View className={isWeb ? "mb-1" : "mb-4"}>
        <Animated.Text
          className={`absolute left-0 z-10 ${isWeb ? "" : "top-1 mb-2"}`}
          style={{
            top: labelPosition(signUpConfirmPasswordAnim),
            fontSize: labelSize(signUpConfirmPasswordAnim),
            color: signUpFocused.confirmPassword ? "#6366f1" : "#6b7280",
            transform: [
              { translateY: labelPosition(signUpConfirmPasswordAnim) },
            ],
          }}
        >
          Confirm Password
        </Animated.Text>
        <View
          className={`border-b pb-1 mb-5 ${signUpFocused.confirmPassword ? "border-indigo-500 border-b-2" : "border-gray-200"}`}
        >
          <TextInput
            className={`${isWeb ? "h-12" : "h-14"} text-base pt-5 w-full text-gray-900 ${isWeb ? "outline-none" : ""}`}
            value={signUpData.confirmPassword}
            onChangeText={(text) =>
              handleInputChange("signUp", "confirmPassword", text)
            }
            onFocus={() => {
              handleFocus(
                "signUp",
                "confirmPassword",
                signUpConfirmPasswordAnim
              );
              scrollToInput();
            }}
            onBlur={() =>
              handleBlur("signUp", "confirmPassword", signUpConfirmPasswordAnim)
            }
            secureTextEntry={!signUpState.showPassword}
          />
        </View>
        {signUpData.confirmPassword && (
          <View className="mt-1">
            <Text
              className="text-xs"
              style={{
                color:
                  signUpData.password === signUpData.confirmPassword
                    ? "#38a169"
                    : "#e53e3e",
              }}
            >
              {signUpData.password === signUpData.confirmPassword
                ? "Passwords match"
                : "Passwords don't match"}
            </Text>
          </View>
        )}
      </View>

      <View className="flex-row items-center mb-6">
        <TouchableOpacity
          onPress={() => togglePasswordVisibility("signUp")}
          className="w-5 h-5 border border-gray-300 rounded mr-2 justify-center items-center"
        >
          {signUpState.showPassword && (
            <View className="w-3 h-3 bg-indigo-600 rounded-sm" />
          )}
        </TouchableOpacity>
        <Text className="text-gray-600">Show password</Text>
      </View>

      <View className="mb-6">
        <Text className="text-gray-600 mb-2">Profile Picture (Optional)</Text>
        <View className="flex-row items-center">
          <Avatar className="w-16 h-16 mr-4">
            {signUpData.avatar ? (
              <AvatarImage source={{ uri: signUpData.avatar }} />
            ) : (
              <AvatarFallback className="bg-gray-200">
                <Text className="text-gray-500">JP</Text>
              </AvatarFallback>
            )}
          </Avatar>
          <TouchableOpacity
            className="border border-dashed border-gray-300 rounded-lg p-4 items-center flex-1"
            onPress={pickImage}
          >
            <Text className="text-indigo-600">+ Upload Photo</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row items-center mb-6">
        <TouchableOpacity
          onPress={() =>
            setSignUpState((prev) => ({
              ...prev,
              acceptedPrivacyPolicy: !prev.acceptedPrivacyPolicy,
            }))
          }
          className="w-5 h-5 border border-gray-300 rounded mr-2 justify-center items-center"
        >
          {signUpState.acceptedPrivacyPolicy && (
            <View className="w-3 h-3 bg-indigo-600 rounded-sm" />
          )}
        </TouchableOpacity>
        <Text className="text-gray-600">
          I agree to the{" "}
          <Text
            className="text-indigo-600 underline"
            onPress={openPrivacyPolicy}
          >
            Privacy Policy
          </Text>
        </Text>
      </View>
    </>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
      keyboardVerticalOffset={Platform.OS === "android" ? 20 : 0}
    >
      {/* Loading Modals */}
      <Modal visible={loginState.showLoginLoading} transparent>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-64 items-center">
            <ActivityIndicator size="large" color="#6366f1" />
            <Text className="mt-4 text-lg font-medium text-gray-800">
              Signing In...
            </Text>
          </View>
        </View>
      </Modal>

      <Modal visible={signUpState.showSignUpLoading} transparent>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-64 items-center">
            <ActivityIndicator size="large" color="#6366f1" />
            <Text className="mt-4 text-lg font-medium text-gray-800">
              {signUpState.step === 1 ? "Processing..." : "Creating Account..."}
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
                  accessibilityLabel="EduConnect logo"
                />
              </View>

              <Text className="text-3xl text-indigo-800 font-bold">
                EduConnect
              </Text>

              <View className="mt-1">
                <Text className="text-gray-500 text-center">
                  Discover your perfect career path through our {"\n"}
                  <Text className="text-indigo-600 font-medium">
                    AI-powered assessment
                  </Text>
                </Text>
                <RotatingDots />
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
                Username
              </Animated.Text>
              <View
                className={`border-b pb-1 mb-5 ${loginFocused.username ? "border-indigo-500 border-b-2" : "border-gray-200"}`}
              >
                <TextInput
                  className={`${isWeb ? "h-12" : "h-14"} text-base pt-5 w-full text-gray-900 ${isWeb ? "outline-none" : ""}`}
                  value={loginData.username}
                  onChangeText={(text) =>
                    handleInputChange("login", "username", text)
                  }
                  onFocus={() => handleFocus("login", "username", usernameAnim)}
                  onBlur={() => handleBlur("login", "username", usernameAnim)}
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
                    onChangeText={(text) =>
                      handleInputChange("login", "password", text)
                    }
                    onFocus={() =>
                      handleFocus("login", "password", passwordAnim)
                    }
                    onBlur={() => handleBlur("login", "password", passwordAnim)}
                    secureTextEntry={!loginState.showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => togglePasswordVisibility("login")}
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

            <TouchableOpacity className="mb-2 self-end">
              <Text className="text-indigo-600">Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`h-14 bg-indigo-600 rounded-full justify-center items-center shadow-sm mt-2 ${loginState.loading ? "opacity-80" : ""} ${isWeb ? "hover:bg-indigo-700" : ""}`}
              onPress={handleLogin}
              disabled={loginState.loading}
            >
              <Text className="text-white text-lg font-medium">
                {loginState.loading ? "Signing In..." : "Sign In"}
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-4">
              <Text className="text-gray-600">Don't have an account? </Text>
              <TouchableOpacity onPress={openSignUpSheet}>
                <Text className="text-indigo-600 font-semibold">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sign Up Bottom Sheet */}
      <BottomSheet
        ref={bottomSheet}
        height={isWeb ? 700 : Math.min(windowHeight * 0.85, 700)}
        radius={20}
        hasDraggableIcon
        sheetBackgroundColor="#fff"
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ paddingBottom: isWeb ? 20 : 40 }}
          keyboardShouldPersistTaps="handled"
          style={isWeb ? { maxHeight: 600 } : {}}
        >
          <View className={`p-6 ${isWeb ? "max-w-md w-full mx-auto" : ""}`}>
            <Text className="text-2xl font-bold text-gray-800 mb-2 text-center">
              Create an Account
            </Text>

            {renderSignUpStepIndicator()}

            {signUpState.step === 1 ? renderSignUpStep1() : renderSignUpStep2()}

            {signUpState.error ? (
              <Text className="text-red-500 text-sm mb-4 text-center">
                {signUpState.error}
              </Text>
            ) : null}

            <View className="mt-4">
              <TouchableOpacity
                className={`h-14 bg-indigo-600 rounded-full justify-center items-center shadow-sm w-full ${signUpState.loading ? "opacity-80" : ""}`}
                onPress={
                  signUpState.step === 1 ? handleNextSignUpStep : handleSignUp
                }
                disabled={signUpState.loading}
              >
                <Text className="text-white text-lg font-medium">
                  {signUpState.step === 1 ? "Continue" : "Create Account"}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="mt-4 flex-row justify-center">
              <Text className="text-gray-600">Already have an account? </Text>
              <TouchableOpacity onPress={() => bottomSheet.current?.close()}>
                <Text className="text-indigo-600 font-semibold">Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </BottomSheet>

      <Toast />
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
