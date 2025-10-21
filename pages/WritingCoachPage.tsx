
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getWritingFeedback } from '../services/geminiService';
import { FeedbackCategory, FeedbackItem, WritingFeedbackResponse } from '../types';
import { useAppContext } from '../contexts/AppContext';


const WritingCoachPage: React.FC = () => {
  const [text, setText] = useState('');
  const [feedback, setFeedback] = useState<FeedbackItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useAppContext();
  const [activeTab, setActiveTab] = useState<FeedbackCategory>(FeedbackCategory.Clarity);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    setFeedback(null);
    try {
      const response = await getWritingFeedback(text);
      const jsonResponse = JSON.parse(response.text) as WritingFeedbackResponse;
      setFeedback(jsonResponse.feedback);
      if(jsonResponse.feedback.length > 0) {
        setActiveTab(jsonResponse.feedback[0].category);
      }
    } catch (err) {
      console.error('Failed to get writing feedback:', err);
      addToast('An error occurred while analyzing your text. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  const getTabPills = () => {
    if (!feedback) return null;
    const presentCategories = new Set(feedback.map(f => f.category));
    return (Object.values(FeedbackCategory) as FeedbackCategory[]).filter(cat => presentCategories.has(cat));
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/dashboard" className="text-blue-600 hover:underline">
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Writing Coach</h1>
          <div></div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex flex-col h-full">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Your Text</h2>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your essay, report, or any other writing here..."
            className="w-full flex-grow p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 resize-none min-h-[400px]"
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading || !text.trim()}
            className="mt-4 w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isLoading && (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isLoading ? 'Analyzing...' : 'Get Feedback'}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md h-full">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Feedback</h2>
          {isLoading && (
            <div className="flex justify-center items-center h-full min-h-[400px]">
                <p className="text-gray-500 dark:text-gray-400">Analyzing your text, please wait...</p>
            </div>
          )}
          {!isLoading && !feedback && (
            <div className="flex justify-center items-center h-full min-h-[400px]">
                <p className="text-gray-500 dark:text-gray-400">Your feedback will appear here.</p>
            </div>
          )}
          {feedback && (
            <div>
              <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                  {getTabPills()?.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`${
                        activeTab === tab
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'
                      } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>
              <div className="prose prose-blue dark:prose-invert max-w-none">
                {feedback.find(f => f.category === activeTab)?.feedback.split('\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default WritingCoachPage;
