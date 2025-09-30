// FILE: src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged, User, getIdToken } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { setAuthToken as clientSetAuthToken, detectBestHost } from "../api/client";

type Role = "pro" | "customer" | null;

interface AuthContextType {
  user: any | null;
  token: string | null;
  role: Role;
  loading: boolean;
  login: (
    token: string,
    userData: any,
    role?: "pro" | "customer"
  ) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (u: any | null) => Promise<void>;
  switchRole: (r: "pro" | "customer") => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUserState] = useState<any | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [role, setRoleState] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  // Restore state from AsyncStorage + detect Firebase user
  useEffect(() => {
    (async () => {
      try {
        detectBestHost().catch(() => {
          /* non-blocking */
        });

        const savedToken = await AsyncStorage.getItem("token");
        const savedUser = await AsyncStorage.getItem("user");
        const savedRole = await AsyncStorage.getItem("role");

        if (savedToken) {
          setTokenState(savedToken);
          clientSetAuthToken(savedToken);
        }
        if (savedUser) setUserState(JSON.parse(savedUser));
        if (savedRole) setRoleState(savedRole as Role);
      } catch (err) {
        console.warn("Failed to restore auth state:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 🔑 Firebase auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        try {
          const idToken = await getIdToken(firebaseUser, true);
          setTokenState(idToken);
          clientSetAuthToken(idToken);

          const userData = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
          };

          setUserState(userData);
          await AsyncStorage.setItem("token", idToken);
          await AsyncStorage.setItem("user", JSON.stringify(userData));

          // Fetch role from Firestore or default to "customer"
          const userRef = doc(db, "users", firebaseUser.uid);
          const snap = await getDoc(userRef);
          let userRole: Role = "customer";
          if (snap.exists()) {
            userRole = (snap.data().role as Role) || "customer";
          } else {
            await setDoc(userRef, { role: "customer" }, { merge: true });
          }
          setRoleState(userRole);
          await AsyncStorage.setItem("role", userRole);
        } catch (err) {
          console.error("Error handling Firebase auth state:", err);
        }
      } else {
        // signed out
        setTokenState(null);
        setUserState(null);
        setRoleState(null);
        clientSetAuthToken(null);
        await AsyncStorage.multiRemove(["token", "user", "role"]);
      }
    });

    return () => unsub();
  }, []);

  // Manual login (API-driven, keep for backend tokens)
  const login = async (
    newToken: string,
    userData: any,
    userRole: "pro" | "customer" = "customer"
  ) => {
    setTokenState(newToken);
    setUserState(userData);
    setRoleState(userRole);

    clientSetAuthToken(newToken);
    await AsyncStorage.setItem("token", newToken);
    await AsyncStorage.setItem("user", JSON.stringify(userData));
    await AsyncStorage.setItem("role", userRole);

    // Mirror role in Firestore for Firebase accounts
    if (userData?.uid) {
      const userRef = doc(db, "users", userData.uid);
      await setDoc(userRef, { role: userRole }, { merge: true });
    }
  };

  const logout = async () => {
    setTokenState(null);
    setUserState(null);
    setRoleState(null);
    clientSetAuthToken(null);
    await AsyncStorage.multiRemove(["token", "user", "role"]);
    await auth.signOut().catch(() => {}); // Firebase logout if used
  };

  const setUser = async (newUser: any | null) => {
    setUserState(newUser);
    if (newUser) await AsyncStorage.setItem("user", JSON.stringify(newUser));
    else await AsyncStorage.removeItem("user");
  };

  const switchRole = async (r: "pro" | "customer") => {
    setRoleState(r);
    await AsyncStorage.setItem("role", r);

    if (user?.uid) {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { role: r }, { merge: true });
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, role, loading, login, logout, setUser, switchRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
