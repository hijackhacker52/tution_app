import React, { useState, useEffect } from 'react';
import PublicLayout from './layouts/PublicLayout';
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import ClassesPage from './pages/public/ClassesPage';
import SubjectsPage from './pages/public/SubjectsPage';
import TeachersPage from './pages/public/TeachersPage';
import GalleryPage from './pages/public/GalleryPage';
import NoticesPage from './pages/public/NoticesPage';

import DedicatedAuthScreen from './components/auth/DedicatedAuthScreen';
import BirthdayModal from './components/common/BirthdayModal';
import ClassLearningSpace from './components/student/ClassLearningSpace';
import DistractionFreeChat from './components/student/DistractionFreeChat';
import ExamCenter from './components/student/ExamCenter';
import StudentIdeasLab from './components/student/StudentIdeasLab';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import { initialTuitionData } from './data/tuitionData';
import Header from './components/common/Header';
import { authService } from './services/authService';

export default function App() {
  // Navigation & View state
  const [activeTab, setActiveTab] = useState('home');
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Authentication & User Role state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentRole, setCurrentRole] = useState('student'); // 'student' | 'teacher' | 'admin'
  const [activeUser, setActiveUser] = useState({
    id: 'std-103',
    name: 'Arun Kumar',
    role: 'Student',
    gender: 'Male',
    standard: 'Class 6',
    rollNo: 'STU0003',
    feePaid: false
  });

  const [data, setData] = useState(initialTuitionData);

  // Restore session from localStorage on mount
  useEffect(() => {
    const session = authService.getStoredSession();
    if (session && session.user) {
      setActiveUser(session.user);
      setCurrentRole(session.role || 'student');
      setIsAuthenticated(true);
    }
  }, []);

  // Materials & Video Notes state
  const [materials, setMaterials] = useState([
    {
      id: 'mat-1',
      title: 'Class 10 SSLC Maths Matrices Term 1 Question Paper',
      standard: 'Class 10 (SSLC)',
      subject: 'Mathematics (கணிதம்)',
      fileType: 'Question Paper',
      fileName: 'Class10_Maths_Matrices_Term1.pdf',
      uploadedBy: 'Prof. K. Arumugam',
      uploadedAt: '2026-07-30'
    },
    {
      id: 'mat-2',
      title: 'Class 6 Science Living World Notes',
      standard: 'Class 6',
      subject: 'Science (அறிவியல்)',
      fileType: 'Study Notes',
      fileName: 'Class6_Science_LivingWorld_Notes.pdf',
      uploadedBy: 'Dr. V. Malathi',
      uploadedAt: '2026-07-31'
    }
  ]);

  const [videoNotes, setVideoNotes] = useState(initialTuitionData.videoNotes || []);

  // Student Sub-view state
  const [studentView, setStudentView] = useState('dashboard');

  // Birthday modal state
  const [isBirthdayModalOpen, setIsBirthdayModalOpen] = useState(false);

  const handleLoginSuccess = (user, role) => {
    setActiveUser(user);
    setCurrentRole(role.toLowerCase());
    setIsAuthenticated(true);
    setIsAuthOpen(false);
    setActiveTab('dashboard');
  };

  const handleLogout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setActiveTab('home');
  };

  const handleUploadMaterial = (newMat) => {
    setMaterials((prev) => [newMat, ...prev]);
  };

  const handleDeleteMaterial = (id) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  const handleUploadVideoNote = (newVid) => {
    setVideoNotes((prev) => [newVid, ...prev]);
  };

  const handleDeleteVideoNote = (id) => {
    setVideoNotes((prev) => prev.filter((v) => v.id !== id));
  };

  const handleClockInToggle = (teacherId) => {
    setData((prev) => ({
      ...prev,
      teachers: prev.teachers.map((t) => {
        if (t.id === teacherId) {
          const newClocked = !t.clockedIn;
          return {
            ...t,
            clockedIn: newClocked,
            status: newClocked ? 'Active Online' : 'Clocked Out',
            clockedInTime: newClocked ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null
          };
        }
        return t;
      })
    }));
  };

  const handleSubstituteStaff = (teacherId, substituteId) => {
    setData((prev) => ({
      ...prev,
      teachers: prev.teachers.map((t) => {
        if (t.id === teacherId) {
          const newLeave = !t.onLeave;
          return {
            ...t,
            onLeave: newLeave,
            status: newLeave ? 'On Leave' : 'Clocked Out',
            substituteAssignedId: newLeave ? substituteId : null
          };
        }
        return t;
      })
    }));
  };

  // Render Public Page view
  const renderPublicContent = () => {
    switch (activeTab) {
      case 'about':
        return <AboutPage setActiveTab={setActiveTab} />;
      case 'classes':
        return <ClassesPage />;
      case 'subjects':
        return <SubjectsPage />;
      case 'teachers':
        return <TeachersPage />;
      case 'gallery':
        return <GalleryPage />;
      case 'notices':
        return <NoticesPage onOpenAuth={() => setIsAuthOpen(true)} />;
      case 'home':
      default:
        return <HomePage setActiveTab={setActiveTab} onOpenAuth={() => setIsAuthOpen(true)} />;
    }
  };

  // Render Portal Dashboard View
  const renderDashboardContent = () => {
    if (currentRole === 'student') {
      if (studentView === 'chat') {
        return (
          <DistractionFreeChat
            activeUser={activeUser}
            onBack={() => setStudentView('dashboard')}
          />
        );
      }
      if (studentView === 'exams') {
        return (
          <ExamCenter
            activeUser={activeUser}
            data={data}
            setData={setData}
            onBack={() => setStudentView('dashboard')}
          />
        );
      }
      if (studentView === 'ideas') {
        return (
          <StudentIdeasLab
            activeUser={activeUser}
            onBack={() => setStudentView('dashboard')}
          />
        );
      }
      return (
        <ClassLearningSpace
          student={activeUser}
          standardsList={data.standardsList}
          subjects={data.subjects}
          materials={materials}
          videoNotes={videoNotes}
          teachers={data.teachers}
          notices={data.notices}
          onLogout={handleLogout}
        />
      );
    }

    if (currentRole === 'teacher') {
      return (
        <TeacherDashboard
          activeUser={activeUser}
          data={data}
          materials={materials}
          onUploadMaterial={handleUploadMaterial}
          onDeleteMaterial={handleDeleteMaterial}
          onClockInToggle={handleClockInToggle}
          onSubstituteStaff={handleSubstituteStaff}
        />
      );
    }

    if (currentRole === 'admin') {
      return (
        <AdminDashboard
          centerInfo={data.centerInfo}
          teachers={data.teachers}
          students={data.students}
          exams={data.exams}
          notices={data.notices}
          materials={materials}
          videoNotes={videoNotes}
          standardsList={data.standardsList}
          coupons={data.coupons}
          onUploadVideoNote={handleUploadVideoNote}
          onDeleteVideoNote={handleDeleteVideoNote}
        />
      );
    }

    return null;
  };

  // Dedicated Auth Modal Screen
  if (isAuthOpen) {
    return (
      <DedicatedAuthScreen
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  // Dashboard View Container
  if (activeTab === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header
          currentRole={currentRole}
          setCurrentRole={setCurrentRole}
          activeUser={activeUser}
          onLogout={handleLogout}
          onBackToPublic={() => setActiveTab('home')}
          onOpenBirthdayModal={() => setIsBirthdayModalOpen(true)}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {renderDashboardContent()}
        </main>

        {isBirthdayModalOpen && (
          <BirthdayModal
            user={activeUser}
            onClose={() => setIsBirthdayModalOpen(false)}
          />
        )}
      </div>
    );
  }

  // Default Public Website View
  return (
    <PublicLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onOpenAuth={() => setIsAuthOpen(true)}
      isAuthenticated={isAuthenticated}
      currentRole={currentRole}
      onLogout={handleLogout}
    >
      {renderPublicContent()}
    </PublicLayout>
  );
}
