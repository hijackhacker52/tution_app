// NDT Tuition Academy - Master Dataset (Restored & Reset to Clean State)

export const initialTuitionData = {
  centerInfo: {
    name: "NDT Tuition Academy",
    tagline: "Distraction-Free 1-on-1 Learning & AI-Powered Academy Management",
    curriculum: "TNSCHOOL.com (Class 6 to 12 State Board)",
    adminEmail: "naveenpanneerselvam78@gmail.com",
    establishedYear: 2026,
    activeAcademicYear: "2026-2027"
  },

  // TNSCHOOL Class Matrix (Class 6 to 12)
  standardsList: [
    { id: "std-6", name: "Class 6", description: "6th Standard TNSCHOOL Samacheer Kalvi Foundation" },
    { id: "std-7", name: "Class 7", description: "7th Standard TNSCHOOL Samacheer Kalvi Core" },
    { id: "std-8", name: "Class 8", description: "8th Standard TNSCHOOL Upper Primary Board Prep" },
    { id: "std-9", name: "Class 9", description: "9th Standard TNSCHOOL High School Foundation" },
    { id: "std-10", name: "Class 10 (SSLC)", description: "10th Standard SSLC Public Examination Special" },
    { id: "std-11", name: "Class 11 (HSC)", description: "11th Standard HSC Higher Secondary 1st Year" },
    { id: "std-12", name: "Class 12 (HSC)", description: "12th Standard HSC State Board Public Special" }
  ],

  // TNSCHOOL State Board Subjects
  subjects: [
    // Class 10 SSLC Subjects
    {
      code: "TN10-MAT",
      standard: "Class 10 (SSLC)",
      name: "Mathematics (கணிதம்)",
      nameTamil: "கணிதம்",
      description: "Algebra, Geometry, Trigonometry, Mensuration & Matrices (TNSCHOOL Board Pattern).",
      assignedTeacherId: "tch-1",
      imagePresentation: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80"
    },
    {
      code: "TN10-SCI",
      standard: "Class 10 (SSLC)",
      name: "Science (அறிவியல்)",
      nameTamil: "அறிவியல்",
      description: "Physics, Chemistry, Botany & Zoology Laws and Practical Experiments.",
      assignedTeacherId: "tch-2",
      imagePresentation: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80"
    },
    {
      code: "TN10-SOC",
      standard: "Class 10 (SSLC)",
      name: "Social Science (சமூக அறிவியல்)",
      nameTamil: "சமூக அறிவியல்",
      description: "History of Tamil Nadu & India, Geography, Civics & Economics.",
      assignedTeacherId: "tch-3",
      imagePresentation: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80"
    },
    {
      code: "TN10-TAM",
      standard: "Class 10 (SSLC)",
      name: "Tamil (தமிழ்)",
      nameTamil: "தமிழ்",
      description: "இலக்கணம், செய்யுள், உரைநடை மற்றும் இலக்கிய வரலாறு.",
      assignedTeacherId: "tch-4",
      imagePresentation: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80"
    },
    {
      code: "TN10-ENG",
      standard: "Class 10 (SSLC)",
      name: "English",
      nameTamil: "ஆங்கிலம்",
      description: "Prose, Poetry, Supplementary, Grammar & Creative Writing skills.",
      assignedTeacherId: "tch-5",
      imagePresentation: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80"
    },

    // Class 12 HSC Subjects
    {
      code: "TN12-PHY",
      standard: "Class 12 (HSC)",
      name: "Physics (இயற்பியல்)",
      nameTamil: "இயற்பியல்",
      description: "Electrostatics, Magnetism, Optics & Modern Quantum Physics.",
      assignedTeacherId: "tch-2",
      imagePresentation: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80"
    },
    {
      code: "TN12-CHE",
      standard: "Class 12 (HSC)",
      name: "Chemistry (வேதியியல்)",
      nameTamil: "வேதியியல்",
      description: "Organic Chemistry, Metallurgy, Coordination Compounds & Electrochemistry.",
      assignedTeacherId: "tch-2",
      imagePresentation: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80"
    },
    {
      code: "TN12-CSC",
      standard: "Class 12 (HSC)",
      name: "Computer Science (கணினி அறிவியல்)",
      nameTamil: "கணினி அறிவியல்",
      description: "Python Programming, Data Structures, SQL Database & OOPs Concepts.",
      assignedTeacherId: "tch-1",
      imagePresentation: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80"
    }
  ],

  // Faculty Database
  teachers: [
    {
      id: "tch-1",
      name: "Prof. K. Arumugam",
      email: "teacher1@ndt.com",
      phone: "+91 98401 11223",
      gender: "Male",
      dob: "1985-05-14",
      role: "Senior Mathematics & CS Faculty",
      specialization: "Mathematics & Computer Science",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
      hourlyRate: 45,
      hoursThisMonth: 124,
      clockedIn: true,
      clockedInTime: "08:30 AM",
      activeSessionSeconds: 14400,
      status: "Active Online",
      rating: 4.9,
      doubtsSolved: 142,
      onLeave: false,
      substituteAssignedId: null,
      passwordSetByAdmin: "Teacher1#2026"
    },
    {
      id: "tch-2",
      name: "Dr. V. Malathi",
      email: "malathi.sci@ndt.com",
      phone: "+91 98402 33445",
      gender: "Female",
      dob: "1988-08-20",
      role: "Science Lead Specialist",
      specialization: "Physics & Chemistry",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      hourlyRate: 50,
      hoursThisMonth: 110,
      clockedIn: false,
      clockedInTime: null,
      activeSessionSeconds: 0,
      status: "Clocked Out",
      rating: 4.95,
      doubtsSolved: 188,
      onLeave: false,
      substituteAssignedId: null,
      passwordSetByAdmin: "Malathi#2026!"
    },
    {
      id: "tch-3",
      name: "Prof. S. Ranganathan",
      email: "ranga.soc@ndt.com",
      phone: "+91 98403 55667",
      gender: "Male",
      dob: "1982-03-10",
      role: "Social Science & History Lead",
      specialization: "Social Science",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      hourlyRate: 40,
      hoursThisMonth: 96,
      clockedIn: false,
      clockedInTime: null,
      activeSessionSeconds: 0,
      status: "Clocked Out",
      rating: 4.8,
      doubtsSolved: 94,
      onLeave: false,
      substituteAssignedId: null,
      passwordSetByAdmin: "Ranga#2026!"
    },
    {
      id: "tch-4",
      name: "Dr. M. Senthamizhan",
      email: "senthamizhan.tam@ndt.com",
      phone: "+91 98404 77889",
      gender: "Male",
      dob: "1980-11-25",
      role: "Tamil Literature Specialist",
      specialization: "Tamil Language",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      hourlyRate: 42,
      hoursThisMonth: 104,
      clockedIn: true,
      clockedInTime: "09:00 AM",
      activeSessionSeconds: 7200,
      status: "Active Online",
      rating: 4.92,
      doubtsSolved: 130,
      onLeave: false,
      substituteAssignedId: null,
      passwordSetByAdmin: "Tamil#2026!"
    },
    {
      id: "tch-5",
      name: "Prof. Alex Mercer",
      email: "alex.eng@ndt.com",
      phone: "+91 98405 99001",
      gender: "Male",
      dob: "1990-01-15",
      role: "English & Communication Coach",
      specialization: "English",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      hourlyRate: 45,
      hoursThisMonth: 118,
      clockedIn: false,
      clockedInTime: null,
      activeSessionSeconds: 0,
      status: "Available Substitute",
      rating: 4.88,
      doubtsSolved: 112,
      onLeave: false,
      substituteAssignedId: null,
      passwordSetByAdmin: "Alex#2026!"
    }
  ],

  // Student Database
  students: [
    {
      id: "std-101",
      name: "Naveen S",
      email: "student1@ndt.com",
      phone: "+91 98400 12345",
      gender: "Male",
      dob: "2010-08-14",
      role: "Student",
      standard: "Class 10 (SSLC)",
      school: "Government Higher Secondary School, Chennai",
      rollNo: "TN-2026-101",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
      parentName: "S. Paneerselvam",
      parentPhone: "+91 98400 99999",
      attendanceRate: 96,
      passwordSetByAdmin: "Student1#2026",
      resetRequested: false
    },
    {
      id: "std-102",
      name: "Kavitha R",
      email: "kavitha@ndt.com",
      phone: "+91 98400 54321",
      gender: "Female",
      dob: "2009-04-12",
      role: "Student",
      standard: "Class 12 (HSC)",
      school: "St. Joseph Matriculation School, Chennai",
      rollNo: "TN-2026-102",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
      parentName: "R. Ramachandran",
      parentPhone: "+91 98400 88888",
      attendanceRate: 98,
      passwordSetByAdmin: "Kavitha#2026",
      resetRequested: false
    }
  ],

  // Doubt Clearance Messages
  doubts: [
    {
      id: "dbt-301",
      studentId: "std-101",
      studentName: "Naveen S",
      subjectCode: "TN10-MAT",
      subjectName: "Mathematics (கணிதம்)",
      questionText: "Sir, in Class 10 Matrices Chapter 3, how do we solve 3x3 determinant expansion when two rows are identical?",
      imageUrl: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=600&q=80",
      timestamp: "10:15 AM Today",
      status: "Pending Answer",
      messages: [
        {
          sender: "student",
          text: "Sir, in Class 10 Matrices Chapter 3, how do we solve 3x3 determinant expansion when two rows are identical?",
          time: "10:15 AM"
        }
      ]
    }
  ],

  // Weekly & Full Test Exam Papers
  exams: [
    {
      id: "ex-101",
      title: "Class 10 SSLC Mathematics Weekly Test 1 (Matrices & Algebra)",
      standard: "Class 10 (SSLC)",
      subject: "Mathematics (கணிதம்)",
      durationMinutes: 45,
      totalQuestions: 10,
      studentAttempts: {
        "std-101": {
          status: "Not Started",
          attemptsUsed: 0,
          maxAllowedAttempts: 1,
          completedAt: null,
          score: 0,
          maxScore: 100,
          unlockedByAdmin: false
        }
      },
      questions: [
        {
          id: 1,
          question: "If matrix A has order 3x2 and matrix B has order 2x4, what is the order of matrix AB?",
          options: ["3x4", "2x2", "3x2", "Not Possible"],
          correctIndex: 0
        },
        {
          id: 2,
          question: "What is the value of the determinant of an Identity matrix I_3?",
          options: ["0", "1", "3", "-1"],
          correctIndex: 1
        },
        {
          id: 3,
          question: "Solve the quadratic equation x^2 - 5x + 6 = 0.",
          options: ["x = 2, 3", "x = -2, -3", "x = 1, 6", "x = 0, 5"],
          correctIndex: 0
        }
      ]
    }
  ],

  // Administrative Logs & Requests
  passwordResetRequests: [
    {
      id: "req-101",
      userId: "std-101",
      userName: "Naveen S",
      userType: "Student",
      email: "student1@ndt.com",
      requestedAt: "09:30 AM",
      reason: "Requested password update",
      status: "Pending Admin Action"
    }
  ],

  parentSMSLogs: [
    {
      id: "sms-501",
      studentName: "Naveen S",
      parentPhone: "+91 98400 99999",
      sentAt: "Yesterday 06:00 PM",
      status: "DISPATCHED SUCCESS 🟢",
      messageContent: "NDT ACADEMY NOTICE: Dear Parent, Naveen S scored 95/100 in Weekly Test 1 (Maths). Attendance: 96%."
    }
  ]
};
