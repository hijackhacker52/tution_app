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
import Header from './components/common/Header';
import LoadingExperience from './components/common/LoadingExperience';
import ErrorExperience from './components/common/ErrorExperience';

import { initialTuitionData } from './data/tuitionData';
import { authService } from './services/authService';

export default function App() {
  // Navigation & View state
  const [activeTab, setActiveTab] = useState('home');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [appError, setAppError] = useState(null);

  // Authentication & User Role state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentRole, setCurrentRole] = useState('student'); // 'student' | 'teacher' | 'admin'
  const [activeUser, setActiveUser] = useState(null);

  // Master Data State
  const [data, setData] = useState(() => {
    const dynamicStudents = authService.getRegisteredStudents();
    const dynamicTeachers = authService.getRegisteredTeachers();
    return {
      ...initialTuitionData,
      students: dynamicStudents.length > 0 ? dynamicStudents : initialTuitionData.students,
      teachers: dynamicTeachers.length > 0 ? dynamicTeachers : initialTuitionData.teachers
    };
  });

  // Materials & Video Notes state (Ready for Admin & Teacher uploads)
  const [materials, setMaterials] = useState([]);

  const [videoNotes, setVideoNotes] = useState(initialTuitionData.videoNotes || []);

  // Student Sub-view state
  const [studentView, setStudentView] = useState('dashboard');

  // Birthday modal state
  const [isBirthdayModalOpen, setIsBirthdayModalOpen] = useState(false);

  // Restore session from localStorage on mount
  useEffect(() => {
    const session = authService.getStoredSession();
    if (session && session.user) {
      setActiveUser(session.user);
      setCurrentRole((session.role || 'student').toLowerCase());
      setIsAuthenticated(true);
    }
  }, []);

  // Keep auth registry in sync whenever students/teachers update
  useEffect(() => {
    if (data.students) {
      authService.saveRegisteredStudents(data.students);
    }
  }, [data.students]);

  useEffect(() => {
    if (data.teachers) {
      authService.saveRegisteredTeachers(data.teachers);
    }
  }, [data.teachers]);

  // Auth Handlers
  const handleLoginSuccess = (user, role) => {
    setLoadingMessage(`Preparing ${role.toUpperCase()} Dashboard...`);
    setIsLoading(true);
    setTimeout(() => {
      setActiveUser(user);
      setCurrentRole(role.toLowerCase());
      setIsAuthenticated(true);
      setIsAuthOpen(false);
      setActiveTab('dashboard');
      setIsLoading(false);
    }, 600);
  };

  const handleLogout = async () => {
    setLoadingMessage('Signing you out safely...');
    setIsLoading(true);
    setTimeout(async () => {
      await authService.logout();
      setIsAuthenticated(false);
      setActiveUser(null);
      setCurrentRole('student');
      setActiveTab('home');
      setIsLoading(false);
    }, 400);
  };

  // Student Management Handlers
  const handleAddStudent = (newStudent) => {
    setData((prev) => ({
      ...prev,
      students: [newStudent, ...prev.students]
    }));
  };

  const handleUpdateStudent = (updatedStudent) => {
    setData((prev) => ({
      ...prev,
      students: prev.students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    }));
    if (activeUser && activeUser.id === updatedStudent.id) {
      setActiveUser(updatedStudent);
    }
  };

  const handleDeleteStudent = (id) => {
    setData((prev) => ({
      ...prev,
      students: prev.students.filter((s) => s.id !== id)
    }));
  };

  // Teacher Management Handlers
  const handleAddTeacher = (newTeacher) => {
    setData((prev) => ({
      ...prev,
      teachers: [newTeacher, ...prev.teachers]
    }));
  };

  const handleUpdateTeacher = (updatedTeacher) => {
    setData((prev) => ({
      ...prev,
      teachers: prev.teachers.map((t) => (t.id === updatedTeacher.id ? updatedTeacher : t))
    }));
    if (activeUser && activeUser.id === updatedTeacher.id) {
      setActiveUser(updatedTeacher);
    }
  };

  const handleDeleteTeacher = (id) => {
    setData((prev) => ({
      ...prev,
      teachers: prev.teachers.filter((t) => t.id !== id)
    }));
  };

  // Subject Management Handlers
  const handleAddSubject = (newSubject) => {
    setData((prev) => ({
      ...prev,
      subjects: [newSubject, ...prev.subjects]
    }));
  };

  const handleUpdateSubject = (updatedSubject) => {
    setData((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) => (s.code === updatedSubject.code ? updatedSubject : s))
    }));
  };

  const handleDeleteSubject = (code) => {
    setData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((s) => s.code !== code)
    }));
  };

  // Study Materials Handlers
  const handleUploadMaterial = (newMat) => {
    setMaterials((prev) => [newMat, ...prev]);
  };

  const handleDeleteMaterial = (id) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  // Video Notes Handlers
  const handleUploadVideoNote = (newVid) => {
    setVideoNotes((prev) => [newVid, ...prev]);
  };

  const handleDeleteVideoNote = (id) => {
    setVideoNotes((prev) => prev.filter((v) => v.id !== id));
  };

  // Clock in toggle for teachers
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

  // Substitute staff for teachers
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
        return <SubjectsPage subjects={data.subjects} standardsList={data.standardsList} />;
      case 'teachers':
        return <TeachersPage teachers={data.teachers} />;
      case 'gallery':
        return <GalleryPage />;
      case 'notices':
        return <NoticesPage onOpenAuth={() => setIsAuthOpen(true)} />;
      case 'home':
      default:
        return <HomePage setActiveTab={setActiveTab} onOpenAuth={() => setIsAuthOpen(true)} />;
    }
  };

  // Render Portal Dashboard View with Strict Role Guarding
  const renderDashboardContent = () => {
    // Security check: Must be authenticated
    if (!isAuthenticated || !activeUser) {
      return (
        <div className="text-center py-16 space-y-4">
          <p className="text-sm text-slate-400">Please sign in to access your authorized academy dashboard.</p>
          <button
            onClick={() => setIsAuthOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
          >
            Open Portal Login
          </button>
        </div>
      );
    }

    // STUDENT PORTAL
    if (currentRole === 'student') {
      if (studentView === 'chat') {
        return (
          <DistractionFreeChat
            student={activeUser}
            subjects={data.subjects}
            teachers={data.teachers}
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

    // TEACHER PORTAL
    if (currentRole === 'teacher') {
      return (
        <TeacherDashboard
          teacher={activeUser}
          standardsList={data.standardsList}
          subjects={data.subjects}
          students={data.students}
          doubts={data.doubts || []}
          materials={materials}
          onUploadMaterial={handleUploadMaterial}
          onDeleteMaterial={handleDeleteMaterial}
          onClockInToggle={handleClockInToggle}
          onSubstituteStaff={handleSubstituteStaff}
          onAnswerDoubt={(doubtId, ans) => {
            console.log('Answer doubt:', doubtId, ans);
          }}
          onMarkAttendance={(att) => {
            console.log('Attendance marked:', att);
          }}
        />
      );
    }

    // ADMIN PORTAL (Only users with verified admin role)
    if (currentRole === 'admin') {
      return (
        <AdminDashboard
          centerInfo={data.centerInfo}
          teachers={data.teachers}
          students={data.students}
          subjects={data.subjects}
          exams={data.exams}
          notices={data.notices}
          materials={materials}
          videoNotes={videoNotes}
          standardsList={data.standardsList}
          coupons={data.coupons}
          onUploadVideoNote={handleUploadVideoNote}
          onDeleteVideoNote={handleDeleteVideoNote}
          onAddStudent={handleAddStudent}
          onUpdateStudent={handleUpdateStudent}
          onDeleteStudent={handleDeleteStudent}
          onAddTeacher={handleAddTeacher}
          onUpdateTeacher={handleUpdateTeacher}
          onDeleteTeacher={handleDeleteTeacher}
          onAddSubject={handleAddSubject}
          onUpdateSubject={handleUpdateSubject}
          onDeleteSubject={handleDeleteSubject}
        />
      );
    }

    // Fallback: unauthorized role
    return (
      <div className="text-center py-16 space-y-3">
        <h4 className="text-base font-bold text-white">Access Restricted</h4>
        <p className="text-xs text-slate-400">You do not possess the required credentials for this dashboard.</p>
        <button
          onClick={() => setActiveTab('home')}
          className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold"
        >
          Return to Public Website
        </button>
      </div>
    );
  };

  // Error boundary display
  if (appError) {
    return (
      <ErrorExperience
        error={appError}
        onRetry={() => {
          setAppError(null);
          window.location.reload();
        }}
        onGoHome={() => {
          setAppError(null);
          setActiveTab('home');
        }}
      />
    );
  }

  return (
    <>
      {/* Cute Dog/Cat Loading Screen */}
      {isLoading && <LoadingExperience message={loadingMessage} />}

      {/* Dedicated Auth Modal Screen */}
      {isAuthOpen && (
        <DedicatedAuthScreen
          onClose={() => setIsAuthOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* Dashboard View Container */}
      {activeTab === 'dashboard' ? (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
          <Header
            currentRole={currentRole}
            activeUser={activeUser || { name: 'Portal User', role: currentRole }}
            onLogout={handleLogout}
            onBackToPublic={() => setActiveTab('home')}
            onOpenBirthdayModal={() => setIsBirthdayModalOpen(true)}
          />

          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            {renderDashboardContent()}
          </main>

          {isBirthdayModalOpen && (
            <BirthdayModal
              user={activeUser || { name: 'Scholar' }}
              onClose={() => setIsBirthdayModalOpen(false)}
            />
          )}
        </div>
      ) : (
        /* Default Public Website View */
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
      )}
    </>
  );
}
