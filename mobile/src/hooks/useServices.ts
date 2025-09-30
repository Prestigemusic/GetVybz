// src/hooks/useServices.ts
import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import { PROFESSIONAL_CATEGORIES } from "../constants/categories";

export function useServices() {
  const [services, setServices] = useState<string[]>(PROFESSIONAL_CATEGORIES);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "services"), (snap) => {
      const dynamic = snap.docs.map((d) => d.data().name as string);
      // merge + dedupe
      setServices([...new Set([...PROFESSIONAL_CATEGORIES, ...dynamic])]);
    });
    return () => unsub();
  }, []);

  return services;
}
