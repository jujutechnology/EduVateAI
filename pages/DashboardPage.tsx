
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import Header from '../components/Header';
import { Subject } from '../types';
import { SubjectGraphic } from '../components/SubjectGraphics';
import { generateCuriousSuggestion } from '../services/geminiService';
import { CompassIcon } from '../components/IconComponents';

const SubjectCard: React.FC<{ subject: Subject }> = ({ subject }) => (
  <Link to={`/chat/${subject.id}`} className="group block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{subject.category === 'CTE' ? 'Career' : subject.category}</p>
    </div>
    <div className="p-4 h-40 overflow-hidden">
      <h3 className="font-bold text-md text-gray-900 dark:text-white mb-2">{subject.name}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {subject.description}
      </p>
    </div>
    <div className="h-40 bg-gray-100 dark:bg-gray-700">
       <SubjectGraphic graphicId={subject.graphicId} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
    </div>
  </Link>
);

const CuriousSuggestionCard: React.FC = () => {
    const { recentSubjects } = useAppContext();
    const [suggestion, setSuggestion] = useState<Subject | null>(null);

    useEffect(() => {
        const getSuggestion = async () => {
            if (recentSubjects.length > 0) {
                const result = await generateCuriousSuggestion(recentSubjects);
                setSuggestion(result);
            }
        };
        getSuggestion();
    }, [recentSubjects]);

    if (!suggestion) return null;

    return (
        <Link to={`/chat/${suggestion.id}`} className="group block bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-white">
            <div className="p-4">
                <div className="flex items-center gap-2">
                    <CompassIcon className="w-5 h-5" />
                    <p className="text-xs font-semibold uppercase tracking-wider">Feeling Curious?</p>
                </div>
            </div>
            <div className="p-4 h-40 flex flex-col justify-center">
                <h3 className="font-bold text-lg mb-2">Explore something new:</h3>
                <p className="text-xl font-semibold">{suggestion.name}</p>
            </div>
            <div className="h-40 opacity-20">
                <SubjectGraphic graphicId={suggestion.graphicId} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
        </Link>
    );
};


const DashboardPage: React.FC = () => {
  const { user, subjects, recentSubjects } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = useMemo(() => {
    const allCategories = subjects.map(s => s.category);
    return ['All', ...Array.from(new Set(allCategories)).sort()];
  }, [subjects]);

  const filteredSubjects = useMemo(() => {
    let subjectsToFilter = subjects;
    if (selectedCategory !== 'All') {
      subjectsToFilter = subjectsToFilter.filter(s => s.category === selectedCategory);
    }
    if (searchQuery.trim()) {
        const lowercasedQuery = searchQuery.toLowerCase();
        subjectsToFilter = subjectsToFilter.filter(s => 
            s.name.toLowerCase().includes(lowercasedQuery) || 
            s.description.toLowerCase().includes(lowercasedQuery)
        );
    }
    return subjectsToFilter;
  }, [subjects, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header searchValue={searchQuery} onSearchChange={(e) => setSearchQuery(e.target.value)} />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Hi {user?.name}, what would you like to learn?
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">Choose a subject to start a conversation</p>
        </div>

        {recentSubjects.length > 0 && (
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Continue Learning</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {recentSubjects.map(subject => (
                        <SubjectCard key={subject.id} subject={subject} />
                    ))}
                </div>
            </section>
        )}

        <div className="flex justify-center mb-8 sticky top-[65px] z-30 py-2 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <div className="flex flex-wrap justify-center items-center gap-2 p-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                        selectedCategory === category
                            ? 'bg-blue-600 text-white shadow'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                    >
                        {category === 'CTE' ? 'Career' : category}
                    </button>
                ))}
            </div>
        </div>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">All Subjects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <CuriousSuggestionCard />
            {filteredSubjects.map(subject => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};

export default DashboardPage;
