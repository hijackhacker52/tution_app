// கற்றல் மையம் (Learning Hub) - Master Dataset & Public Portal Data

export const initialTuitionData = {
  centerInfo: {
    name: "கற்றல் மையம் (Learning Hub)",
    tagline: "Distraction-Free 1-on-1 Learning & Academy Management",
    curriculum: "Multi-Board (Tamil Nadu State Board, CBSE, ICSE, Cambridge & IB)",
    adminEmail: "naveenpanneerselvam78@gmail.com",
    establishedYear: 2026,
    activeAcademicYear: "2026-2027",
    academicYearExpiryDate: "2027-03-31",
    supportedBoards: [
      "Tamil Nadu State Board (Samacheer Kalvi)",
      "CBSE (Central Board of Secondary Education)",
      "ICSE / ISC (CISCE)",
      "Cambridge International (IGCSE / A-Levels)",
      "IB (International Baccalaureate)",
      "NIOS (National Institute of Open Schooling)"
    ]
  },

  // Major Educational Boards & Curricula recognized across India & International
  boardsList: [
    { 
      id: "tn-state", 
      code: "TN-STATE", 
      name: "Tamil Nadu State Board (Samacheer Kalvi)", 
      shortName: "TN State Board", 
      curriculum: "State Board (TNSCHOOL)",
      description: "Tamil Nadu State Board Samacheer Kalvi syllabus for Class 6 to 12."
    },
    { 
      id: "cbse", 
      code: "CBSE", 
      name: "CBSE (Central Board of Secondary Education)", 
      shortName: "CBSE (NCERT)", 
      curriculum: "NCERT Framework",
      description: "National curriculum aligned with NCERT standards, JEE & NEET foundation."
    },
    { 
      id: "icse", 
      code: "ICSE", 
      name: "ICSE / ISC (CISCE)", 
      shortName: "ICSE / ISC", 
      curriculum: "CISCE Framework",
      description: "In-depth analytical and English-centric holistic curriculum."
    },
    { 
      id: "cambridge", 
      code: "IGCSE", 
      name: "Cambridge International (IGCSE / A-Levels)", 
      shortName: "Cambridge IGCSE", 
      curriculum: "CIE Cambridge",
      description: "Globally recognized inquiry-based International General Certificate."
    },
    { 
      id: "ib", 
      code: "IB", 
      name: "IB (International Baccalaureate)", 
      shortName: "IB World School", 
      curriculum: "IB PYP / MYP / DP",
      description: "International baccalaureate inquiry-driven academic framework."
    },
    { 
      id: "nios", 
      code: "NIOS", 
      name: "NIOS (National Institute of Open Schooling)", 
      shortName: "NIOS Open", 
      curriculum: "National Open Board",
      description: "Flexible national self-paced open board curriculum."
    }
  ],

  // Class Matrix (Class 6 to 12) with Admin-Configured Tuition Fees
  standardsList: [
    { id: "std-6", name: "Class 6", description: "6th Standard Middle School Foundation", feeAmount: 150 },
    { id: "std-7", name: "Class 7", description: "7th Standard Core Academic Concept Build", feeAmount: 165 },
    { id: "std-8", name: "Class 8", description: "8th Standard Upper Primary Board Prep", feeAmount: 180 },
    { id: "std-9", name: "Class 9", description: "9th Standard High School Foundation & Entrance Prep", feeAmount: 200 },
    { id: "std-10", name: "Class 10 (SSLC / Secondary)", description: "10th Standard Secondary Public Examination Special", feeAmount: 250 },
    { id: "std-11", name: "Class 11 (HSC / Senior Sec 1)", description: "11th Standard Higher Secondary 1st Year / Foundation", feeAmount: 300 },
    { id: "std-12", name: "Class 12 (HSC / Senior Sec 2)", description: "12th Standard Final Board Examination Special", feeAmount: 350 }
  ],

  // Admin Configured Coupon Codes
  coupons: [
    { code: "EARLYBIRD50", discountPercent: 50, description: "50% Early Admission Discount" },
    { code: "APEX20", discountPercent: 20, description: "20% Academic Excellence Discount" },
    { code: "SCHOLAR100", discountPercent: 100, description: "100% Full Merit Scholarship" }
  ],

  // Subjects Matrix (Configured by Board and Class Standard)
  subjects: [
    // --- Tamil Nadu State Board (Samacheer Kalvi) ---
    {
      code: "TN6-MAT",
      standard: "Class 6",
      board: "Tamil Nadu State Board (Samacheer Kalvi)",
      name: "Mathematics (கணிதம்)",
      description: "Basic Numbers, Arithmetic, Mensuration & Geometry Foundation.",
      assignedTeacherId: "",
      imagePresentation: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80"
    },
    {
      code: "TN6-SCI",
      standard: "Class 6",
      board: "Tamil Nadu State Board (Samacheer Kalvi)",
      name: "Science (அறிவியல்)",
      description: "Living World, Matter, Energy & Environmental Science.",
      assignedTeacherId: "",
      imagePresentation: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80"
    },
    {
      code: "TN10-MAT",
      standard: "Class 10 (SSLC / Secondary)",
      board: "Tamil Nadu State Board (Samacheer Kalvi)",
      name: "Mathematics (கணிதம்)",
      nameTamil: "கணிதம்",
      description: "Algebra, Geometry, Trigonometry, Mensuration & Matrices (TNSCHOOL Board Pattern).",
      assignedTeacherId: "",
      imagePresentation: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80"
    },
    {
      code: "TN10-SCI",
      standard: "Class 10 (SSLC / Secondary)",
      board: "Tamil Nadu State Board (Samacheer Kalvi)",
      name: "Science (அறிவியல்)",
      nameTamil: "அறிவியல்",
      description: "Physics, Chemistry, Botany & Zoology Laws and Practical Experiments.",
      assignedTeacherId: "",
      imagePresentation: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80"
    },
    {
      code: "TN10-SOC",
      standard: "Class 10 (SSLC / Secondary)",
      board: "Tamil Nadu State Board (Samacheer Kalvi)",
      name: "Social Science (சமூக அறிவியல்)",
      nameTamil: "சமூக அறிவியல்",
      description: "History of Tamil Nadu & India, Geography, Civics & Economics.",
      assignedTeacherId: "",
      imagePresentation: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80"
    },
    {
      code: "TN10-TAM",
      standard: "Class 10 (SSLC / Secondary)",
      board: "Tamil Nadu State Board (Samacheer Kalvi)",
      name: "Tamil (தமிழ்)",
      nameTamil: "தமிழ்",
      description: "இலக்கணம், செய்யுள், உரைநடை மற்றும் இலக்கிய வரலாறு.",
      assignedTeacherId: "",
      imagePresentation: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80"
    },
    {
      code: "TN10-ENG",
      standard: "Class 10 (SSLC / Secondary)",
      board: "Tamil Nadu State Board (Samacheer Kalvi)",
      name: "English",
      nameTamil: "ஆங்கிலம்",
      description: "Prose, Poetry, Supplementary, Grammar & Creative Writing skills.",
      assignedTeacherId: "",
      imagePresentation: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80"
    },
    {
      code: "TN12-PHY",
      standard: "Class 12 (HSC / Senior Sec 2)",
      board: "Tamil Nadu State Board (Samacheer Kalvi)",
      name: "Physics (இயற்பியல்)",
      nameTamil: "இயற்பியல்",
      description: "Electrostatics, Magnetism, Optics & Modern Quantum Physics.",
      assignedTeacherId: "",
      imagePresentation: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80"
    },
    {
      code: "TN12-CHE",
      standard: "Class 12 (HSC / Senior Sec 2)",
      board: "Tamil Nadu State Board (Samacheer Kalvi)",
      name: "Chemistry (வேதியியல்)",
      nameTamil: "வேதியியல்",
      description: "Organic Chemistry, Metallurgy, Coordination Compounds & Electrochemistry.",
      assignedTeacherId: "",
      imagePresentation: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80"
    },
    {
      code: "TN12-CSC",
      standard: "Class 12 (HSC / Senior Sec 2)",
      board: "Tamil Nadu State Board (Samacheer Kalvi)",
      name: "Computer Science (கணினி அறிவியல்)",
      nameTamil: "கணினி அறிவியல்",
      description: "Python Programming, Data Structures, SQL Database & OOPs Concepts.",
      assignedTeacherId: "",
      imagePresentation: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80"
    },

    // --- CBSE (Central Board of Secondary Education - NCERT) ---
    {
      code: "CBSE10-MAT",
      standard: "Class 10 (SSLC / Secondary)",
      board: "CBSE (Central Board of Secondary Education)",
      name: "CBSE Mathematics (Standard & Basic)",
      description: "Real Numbers, Polynomials, Quadratic Equations, Coordinate Geometry, Trigonometry & Statistics (NCERT).",
      assignedTeacherId: "",
      imagePresentation: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80"
    },
    {
      code: "CBSE10-SCI",
      standard: "Class 10 (SSLC / Secondary)",
      board: "CBSE (Central Board of Secondary Education)",
      name: "CBSE Science (Physics, Chemistry & Biology)",
      description: "Chemical Reactions, Acids Bases & Salts, Life Processes, Light Reflection & Electricity (NCERT).",
      assignedTeacherId: "",
      imagePresentation: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80"
    },
    {
      code: "CBSE10-SOC",
      standard: "Class 10 (SSLC / Secondary)",
      board: "CBSE (Central Board of Secondary Education)",
      name: "CBSE Social Science",
      description: "India and Contemporary World, Contemporary India (Geography), Democratic Politics & Economics.",
      assignedTeacherId: "",
      imagePresentation: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80"
    },
    {
      code: "CBSE12-PHY",
      standard: "Class 12 (HSC / Senior Sec 2)",
      board: "CBSE (Central Board of Secondary Education)",
      name: "CBSE Physics (JEE / NEET Prep)",
      description: "Electric Charges & Fields, Electrostatic Potential, Current Electricity, Optics, Atoms & Nuclei.",
      assignedTeacherId: "",
      imagePresentation: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80"
    },
    {
      code: "CBSE12-CHE",
      standard: "Class 12 (HSC / Senior Sec 2)",
      board: "CBSE (Central Board of Secondary Education)",
      name: "CBSE Chemistry (JEE / NEET Prep)",
      description: "Solutions, Electrochemistry, Chemical Kinetics, Coordination Compounds, Aldehydes Ketones & Amines.",
      assignedTeacherId: "",
      imagePresentation: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80"
    },
    {
      code: "CBSE12-MAT",
      standard: "Class 12 (HSC / Senior Sec 2)",
      board: "CBSE (Central Board of Secondary Education)",
      name: "CBSE Mathematics (Calculus & Vectors)",
      description: "Relations & Functions, Matrices, Continuity & Differentiability, Integrals, Differential Equations, Vectors.",
      assignedTeacherId: "",
      imagePresentation: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80"
    }
  ],

  // Faculty Database (Reset to clean state - ready for Admin appointment)
  teachers: [],

  // Student Database (Reset to clean state - ready for Admin enrolment)
  students: [],

  // Public Announcements & Notices
  notices: [
    {
      id: "not-1",
      title: "Admissions Open for Academic Year 2026-2027",
      category: "Admission",
      date: "2026-08-25",
      content: "Admissions open for Tamil Nadu State Board, CBSE, ICSE, and Cambridge curricula (Class 6 to 12). Use coupon code EARLYBIRD50.",
      targetRole: "public",
      isPublished: true
    },
    {
      id: "not-2",
      title: "Class 10 Board Mock Exam Schedule",
      category: "Exam",
      date: "2026-08-28",
      content: "All Class 10 State Board & CBSE students must participate in the mandatory diagnostic mock test starting September 5th.",
      targetRole: "student",
      isPublished: true
    }
  ],

  // Gallery Showcase Items
  gallery: [
    {
      id: "gal-1",
      title: "State Board & CBSE Rank Holder Felicitation 2026",
      category: "Events",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
      caption: "Celebrating top achievers in SSLC, HSC, and CBSE board examinations."
    },
    {
      id: "gal-2",
      title: "Interactive Science Practical Lab",
      category: "Academics",
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
      caption: "Students performing physics and chemistry experiments under faculty guidance."
    }
  ],

  exams: [
    {
      id: "ex-101",
      title: "Class 10 Mathematics Weekly Test 1 (Matrices & Algebra)",
      standard: "Class 10 (SSLC / Secondary)",
      subject: "Mathematics (கணிதம்)",
      durationMinutes: 45,
      totalQuestions: 10,
      studentAttempts: {},
      questions: [
        {
          id: 1,
          question: "If matrix A has order 3x2 and matrix B has order 2x4, what is the order of matrix AB?",
          options: ["3x4", "2x2", "3x2", "Not Possible"],
          correctIndex: 0
        }
      ]
    }
  ],

  // Video Notes (YouTube Link System - Ready for Admin & Teachers to publish real lectures)
  videoNotes: []
};
