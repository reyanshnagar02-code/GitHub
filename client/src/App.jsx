import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar.jsx';
import { Footer } from './components/Footer.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { Landing } from './pages/Landing.jsx';
import { Login } from './pages/Login.jsx';
import { Signup } from './pages/Signup.jsx';
import { Report } from './pages/Report.jsx';
import { MapPage } from './pages/MapPage.jsx';
import { IssueDetail } from './pages/IssueDetail.jsx';
import { AdminDashboard } from './pages/AdminDashboard.jsx';
import { Leaderboard } from './pages/Leaderboard.jsx';
import { About } from './pages/About.jsx';

function Layout({ children, noFooter }) {
  return (
    <div className="flex min-h-screen flex-col bg-navy-950">
      <Navbar />
      <main className="flex-1">{children}</main>
      {!noFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Landing /></Layout>} />
      <Route path="/login" element={<Layout><Login /></Layout>} />
      <Route path="/signup" element={<Layout><Signup /></Layout>} />
      <Route
        path="/report"
        element={
          <Layout>
            <ProtectedRoute>
              <Report />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route path="/map" element={<Layout noFooter><MapPage /></Layout>} />
      <Route path="/issue/:id" element={<Layout><IssueDetail /></Layout>} />
      <Route
        path="/admin"
        element={
          <Layout>
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route path="/leaderboard" element={<Layout><Leaderboard /></Layout>} />
      <Route path="/about" element={<Layout><About /></Layout>} />
      <Route
        path="*"
        element={
          <Layout>
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
              <h1 className="text-4xl font-bold text-white">404</h1>
              <p className="mt-2 text-white/60">Page not found.</p>
            </div>
          </Layout>
        }
      />
    </Routes>
  );
}
