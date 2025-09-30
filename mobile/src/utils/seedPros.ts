// src/utils/seedPros.ts
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const samplePros = [
  {
    name: "Jane Doe",
    profession: "Plumber",
    services: ["Leak Repair", "Pipe Installation"],
    rateCard: [{ label: "Leak Repair", price: 50 }, { label: "Pipe Installation", price: 100 }],
    rating: 4.7,
    location: "Lagos",
    bio: "10 years of experience fixing home plumbing issues.",
    profilePictureUrl: "https://via.placeholder.com/150",
  },
  {
    name: "John Smith",
    profession: "Electrician",
    services: ["Wiring", "Fan Installation"],
    rateCard: [{ label: "Wiring", price: 80 }, { label: "Fan Installation", price: 40 }],
    rating: 4.9,
    location: "Abuja",
    bio: "Certified electrician with fast service delivery.",
    profilePictureUrl: "https://via.placeholder.com/150",
  },
];

export const seedPros = async () => {
  try {
    for (const pro of samplePros) {
      await addDoc(collection(db, "pros"), pro);
    }
    console.log("Pros seeded successfully");
  } catch (err) {
    console.error("Error seeding pros:", err);
  }
};
