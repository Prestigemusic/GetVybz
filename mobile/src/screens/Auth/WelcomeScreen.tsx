// src/screens/WelcomeScreen.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Easing,
  Image,
  Pressable,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const WelcomeScreen = () => {
  const navigation = useNavigation<any>();

  // Animations
  const glowAnim = useRef(new Animated.Value(0)).current;
  const breatheAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;
  const borderGlowAnim = useRef(new Animated.Value(0)).current;

  const [currentText, setCurrentText] = useState("");
  const services = [
    "DJs",
    "MCs",
    "Pianist",
    "Dancers",
    "Content Creators",
    "Choreographers",
    "Photographers",
    "Videographers",
    "Caterers",
    "Music Producers",
    "Music Instructors",
    "Comedians",
    "Musicians",
    "Live Bands",
    "Event Planners",
    "Decorators",
    "Make-Up Artistes",
    "Gele Experts",
  ];

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: 6000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 0,
          duration: 6000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(borderGlowAnim, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();

    Animated.timing(contentAnim, {
      toValue: 1,
      duration: 1200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    let serviceIndex = 0;
    let charIndex = 0;
    let isTyping = true;
    let animationTimeout: NodeJS.Timeout | null = null;

    const animateText = () => {
      const currentService = services[serviceIndex];
      const speed = isTyping ? 100 : 50;

      if (isTyping) {
        if (charIndex < currentService.length) {
          setCurrentText(currentService.substring(0, charIndex + 1));
          charIndex++;
          animationTimeout = setTimeout(animateText, speed);
        } else {
          isTyping = false;
          animationTimeout = setTimeout(animateText, 1500);
        }
      } else {
        if (charIndex > 0) {
          setCurrentText(currentService.substring(0, charIndex - 1));
          charIndex--;
          animationTimeout = setTimeout(animateText, speed);
        } else {
          isTyping = true;
          serviceIndex = (serviceIndex + 1) % services.length;
          animationTimeout = setTimeout(animateText, 500);
        }
      }
    };

    animateText();
    return () => {
      if (animationTimeout) clearTimeout(animationTimeout);
    };
  }, []);

  const breatheScale = breatheAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });
  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  const borderStart = borderGlowAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0],
  });
  const borderEnd = borderGlowAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 1],
  });

  const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

  const MovingBorderGlow = ({ children, isJoinButton = false }: any) => {
    const glowColors = isJoinButton
      ? ["#00F5FF", "#6A0DFF", "#12003D"]
      : ["#FFFFFF", "#B400FF", "#12003D"];

    return (
      <View style={styles.glowWrapper}>
        <AnimatedLinearGradient
          colors={glowColors}
          start={{ x: borderStart, y: 0.5 }}
          end={{ x: borderEnd, y: 0.5 }}
          style={styles.movingGlowBg}
        />
        {children}
      </View>
    );
  };

  return (
    <LinearGradient
      colors={["#12003D", "#6A0DFF", "#B400FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <Animated.View
          style={[
            styles.pulseCircle,
            { transform: [{ scale: breatheScale }], opacity: 0.3 },
          ]}
        />

        <Animated.View
          style={[
            styles.content,
            {
              opacity: contentAnim,
              transform: [
                {
                  translateY: contentAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Image
            source={require("../../assets/getvybz-logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Ignite Your Vibe</Text>

          <View style={styles.animatedSubtitleContainer}>
            <Text style={styles.baseSubtitleText}>Book Top </Text>
            <Text style={styles.animatedText}>{currentText}</Text>
            <Animated.Text
              style={[
                styles.baseSubtitleText,
                { opacity: glowOpacity, marginLeft: 2, marginRight: 4 },
              ]}
            >
              |
            </Animated.Text>
            <Text style={styles.baseSubtitleText}>for your event.</Text>
          </View>

          <View style={styles.buttonsContainer}>
            {/* Hire a Pro → goes to FindPro (public list) */}
            <MovingBorderGlow>
              <Pressable
                onPress={() => navigation.navigate("FindPro")}
                style={styles.button}
              >
                <LinearGradient
                  colors={["#300060", "#12003D"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.hireButtonInner}
                >
                  <Text style={styles.hireButtonText}>Hire a Pro</Text>
                </LinearGradient>
              </Pressable>
            </MovingBorderGlow>

            {/* Join as a Pro → goes to Signup with role=pro */}
            <MovingBorderGlow isJoinButton>
              <Pressable
                onPress={() => navigation.navigate("SignUp", { role: "pro" })}
                style={styles.button}
              >
                <View style={styles.joinButtonInner}>
                  <Text style={styles.joinButtonText}>Join as a Pro</Text>
                </View>
              </Pressable>
            </MovingBorderGlow>

            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              style={{ marginTop: 16 }}
            >
              <Text style={styles.loginText}>
                Already a user? <Text style={styles.loginLink}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  content: { width: "100%", alignItems: "center" },
  logo: { width: 160, height: 160, marginBottom: 40 },
  title: {
    fontSize: 36,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 12,
    textAlign: "center",
  },
  animatedSubtitleContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    maxWidth: width * 0.9,
    height: 60,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  baseSubtitleText: { fontSize: 18, color: "#CFCFCF", textAlign: "center" },
  animatedText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonsContainer: { width: "100%", alignItems: "center" },
  glowWrapper: {
    width: "100%",
    marginBottom: 18,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  movingGlowBg: {
    position: "absolute",
    width: "100%",
    height: 60,
    borderRadius: 16,
    padding: 2,
    zIndex: -1,
  },
  button: {
    width: "100%",
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  hireButtonInner: {
    width: "100%",
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
  },
  hireButtonText: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold" },
  joinButtonInner: {
    width: "100%",
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "#12003D",
  },
  joinButtonText: { color: "#00F5FF", fontSize: 18, fontWeight: "bold" },
  loginText: { color: "#fff", fontSize: 15 },
  loginLink: { color: "#00F5FF", fontWeight: "bold" },
  pulseCircle: {
    position: "absolute",
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width,
    backgroundColor: "#6A0DFF",
    zIndex: -2,
  },
});

export default WelcomeScreen;
