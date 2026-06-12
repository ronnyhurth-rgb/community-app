// UserProfileSchema.js - MVP Definition
const UserProfileSchema = {
  // 1. Die harte Identität (Lastenheft S. 5)
  identity: {
    verification_status: "pending_manual_review", // Manuelle Prüfung der Handschrift-Zettel
    handwritten_date_verified: "boolean",
  },
  
  // 2. Deine "Scanner"-Checkboxen (Direkt & Trocken)
  lifestyle_filters: {
    diet: ["vegan", "vegetarian", "omnivore"],
    health_habits: ["gluten_free", "sugar_free"],
    substances: {
      alcohol_free: "boolean",
      cannabis_ok: "boolean",
      drugs_hard_no: "boolean" // Hartes Filterkriterium
    },
    nature_affinity: "boolean", // inkl. Barfuß/Nacktheit-Einstellung
    nudism_active: "boolean"
  },
  
  // 3. Mentale Filter (Deine 3 Tiefen-Fragen)
  deep_dive_prompts: [
    {
      id: "perfect_sunday",
      question: "Beschreibe deinen perfekten Sonntag ohne 'chillen' oder 'entspannen'.",
      min_length: 50
    },
    {
      id: "health_habit",
      question: "Welche Gesundheits-Gewohnheit hält dich für andere 'seltsam'?",
      min_length: 50
    },
    {
      id: "nature_connection",
      question: "Wann hast du dich zuletzt barfuß in der Natur wirklich 'verbunden' gefühlt?",
      min_length: 50
    }
  ]
};