// src/components/AppLayout.tsx
import React from "react";
import { View, StyleSheet, StatusBar, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "../theme";

type Props = {
  children: React.ReactNode;
  scroll?: boolean; // allow scroll if needed
  center?: boolean; // center vertically
};

const AppLayout = ({ children, scroll = false, center = false }: Props) => {
  const Container = scroll ? ScrollView : View;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      <Container
        style={[
          styles.container,
          center && { justifyContent: "center", alignItems: "center" },
        ]}
        contentContainerStyle={scroll ? styles.scrollContent : undefined}
      >
        {children}
      </Container>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
});

export default AppLayout;
