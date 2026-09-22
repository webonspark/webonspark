import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { FloatingContact, ScrollToTop, Loader } from './components/Common';

// Each page is code-split → visitors download only the page they open.
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const ServiceCategory = lazy(() => import('./pages/ServiceCategory'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Careers = lazy(() => import('./pages/Careers'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Privacy = lazy(() => import('./pages/Misc').then((m) => ({ default: m.Privacy })));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <ScrollToTop />
      <Header />
      <main id="main">
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/app-development" element={<ServiceCategory type="app" />} />
            <Route path="/services/website-development" element={<ServiceCategory type="web" />} />
            <Route path="/services/app-development/:slug" element={<ServiceDetail type="app" />} />
            <Route path="/services/website-development/:slug" element={<ServiceDetail type="web" />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/privacy-policy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
