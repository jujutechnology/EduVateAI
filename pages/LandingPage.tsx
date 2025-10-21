
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { LogoIcon, MascotIllustration } from '../components/IconComponents';

const LandingPage: React.FC = () => {
  const { login } = useAppContext();

  const handleGetStarted = () => {
    // In a real app, this would go to a signup flow.
    // For this demo, we'll log in a default user.
    login('Sarah');
  };
  
  const handleLogin = () => {
    login('Sarah');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <header className="absolute top-0 left-0 right-0 p-6 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 text-blue-600">
              <LogoIcon className="h-10 w-10" />
              <span className="font-bold text-2xl text-gray-800 dark:text-white">AI Tutor</span>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={handleLogin} className="text-gray-600 dark:text-gray-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Log In</button>
            <button onClick={handleGetStarted} className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
              Get Started Free
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center container mx-auto px-6 py-12 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
                    Unlock Your Potential with <span className="text-blue-600 dark:text-blue-400">Socratic Learning</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
                    Your personalized AI companion, guiding you through any subject with the power of questioning. Explore, think critically, and discover knowledge in a new, interactive way.
                </p>
                <div className="flex justify-center lg:justify-start items-center space-x-4">
                    <button onClick={handleGetStarted} className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-lg">
                    Start Learning Now
                    </button>
                    <button onClick={handleLogin} className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white font-semibold px-8 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-transform transform hover:scale-105">
                    Explore Subjects
                    </button>
                </div>
                <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                    Already have an account? <button onClick={handleLogin} className="text-blue-600 dark:text-blue-400 font-medium hover:underline">Log In</button>
                </p>
            </div>
            <div className="flex justify-center items-center mt-8 lg:mt-0">
                 <MascotIllustration alt="AI Tutor Mascot" className="w-full max-w-md h-auto" />
            </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
