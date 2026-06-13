import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { Dashboard, ApplicationDetails, NewApplication } from './pages';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center space-x-2">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    TrackJob
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/applications/new" element={<NewApplication />} />
            <Route path="/applications/:id" element={<ApplicationDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
