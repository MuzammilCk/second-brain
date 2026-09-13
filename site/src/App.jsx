import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PageTransition from './components/layout/PageTransition';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Garden from './pages/Garden';
import ConceptDetail from './pages/ConceptDetail';
import Now from './pages/Now';
import Playground from './pages/Playground';
import DSADashboard from './pages/DSADashboard';
import ParticleField from './components/three/ParticleField';

export default function App() {
  const location = useLocation();

  return (
    <div className="app">
      <ParticleField />
      <Navbar />
      <main style={{ paddingTop: 'var(--navbar-height)' }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/projects" element={<PageTransition><Projects /></PageTransition>} />
            <Route path="/projects/:slug" element={<PageTransition><ProjectDetail /></PageTransition>} />
            <Route path="/garden" element={<PageTransition><Garden /></PageTransition>} />
            <Route path="/garden/:slug" element={<PageTransition><ConceptDetail /></PageTransition>} />
            <Route path="/now" element={<PageTransition><Now /></PageTransition>} />
            <Route path="/playground" element={<PageTransition><Playground /></PageTransition>} />
            <Route path="/prep" element={<PageTransition><DSADashboard /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
