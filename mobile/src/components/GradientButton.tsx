// src/components/GradientButton.tsx
import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { gradients, radii, typography } from "../theme";

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  colors?: string[]; // override default gradient
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  colors = gradients.primary,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      disabled={disabled || loading}
      activeOpacity={0.85}
      onPress={onPress}
      style={[{ borderRadius: radii.lg, overflow: "hidden" }, style]}
    >
      <LinearGradient
        colors={disabled ? ["#666", "#555"] : colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.button]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={[styles.text, textStyle]}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fontSemi,
    color: "#fff",
    fontWeight: "600",
  },
});

export default GradientButton;
