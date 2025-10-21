
import { Subject, TutoringMode } from './types';

export const SUBJECTS: Subject[] = [
  // History
  { id: 'human-migration', name: 'Early Human Evolution and Migration', category: 'History', description: 'Trace the journey of our earliest ancestors across the globe.', graphicId: 'history-abstract' },
  { id: 'roman-economy', name: 'The Ancient Roman Economy', category: 'History', description: 'Delve into the trade, currency, and commerce of ancient Rome.', graphicId: 'history-abstract' },
  { id: 'ancient-egypt', name: 'Ancient Egypt', category: 'History', description: 'Explore pyramids, pharaohs, and the civilization of the Nile.', graphicId: 'history-abstract' },
  { id: 'roman-empire', name: 'The Roman Empire', category: 'History', description: 'Learn about gladiators, emperors, and Roman engineering.', graphicId: 'history-abstract' },
  { id: 'world-war-2', name: 'World War II', category: 'History', description: 'Understand the key events and figures of the war.', graphicId: 'history-abstract' },
  { id: 'american-revolution', name: 'The American Revolution', category: 'History', description: 'Discover the birth of the United States.', graphicId: 'history-abstract' },

  // Social Studies
  { id: 'what-is-sociology', name: 'What is Sociology?', category: 'Social Studies', description: 'Study the development and structure of human society.', graphicId: 'sociology-abstract' },
  { id: 'self-development', name: 'Theories of Self-Development', category: 'Social Studies', description: 'Understand how our identity and personality are formed.', graphicId: 'psychology-abstract' },
  { id: 'what-is-learning', name: 'What is Learning?', category: 'Social Studies', description: 'Explore the cognitive processes behind how we acquire knowledge.', graphicId: 'psychology-abstract' },
  { id: 'us-government', name: 'Foundations of US Government', category: 'Social Studies', description: 'Learn how the U.S. government is structured and functions.', graphicId: 'history-abstract' },
  { id: 'world-geography', name: 'World Geography', category: 'Social Studies', description: 'Explore the continents, countries, and cultures of our planet.', graphicId: 'sociology-abstract' },

  // Science
  { id: 'immune-system', name: 'The Immune System', category: 'Science', description: 'Understand how your body defends itself against germs and illness.', graphicId: 'biology-abstract' },
  { id: 'atoms-molecules', name: 'Atoms and Molecules', category: 'Science', description: 'Learn about the fundamental building blocks of all matter.', graphicId: 'chemistry-abstract' },
  { id: 'carbon', name: 'The Element Carbon', category: 'Science', description: 'Explore the versatile element that is the basis of all life on Earth.', graphicId: 'chemistry-abstract' },
  { id: 'earth-sky', name: 'Earth and Sky', category: 'Science', description: 'Learn about our planet, its atmosphere, and place in the universe.', graphicId: 'astronomy-abstract' },
  { id: 'comets', name: 'The "Long-Haired" Comets', category: 'Science', description: 'Chase the icy travelers of our solar system and learn their secrets.', graphicId: 'astronomy-abstract' },
  { id: 'anatomy-physiology', name: 'Overview of Anatomy & Physiology', category: 'Science', description: 'A detailed look at the structure and function of the human body.', graphicId: 'biology-abstract' },
  { id: 'ecosystems', name: 'Ecosystems and Biomes', category: 'Science', description: 'Discover how living things interact with their environment.', graphicId: 'cte-life-sci' },
  { id: 'nutrition', name: 'Nutrition & Healthy Eating', category: 'Science', description: 'Learn about the food groups and what makes a balanced diet.', graphicId: 'cte-life-sci-2' },
  { id: 'genetics-basics', name: 'Genetics & Heredity', category: 'Science', description: 'Uncover the secrets of DNA and how traits are passed down.', graphicId: 'biology-abstract' },
  { id: 'mental-wellness', name: 'Intro to Mental Wellness', category: 'Science', description: 'Explore the importance of emotional and psychological health.', graphicId: 'psychology-abstract' },

  // Maths
  { id: 'algebra-basics', name: 'Algebra Basics', category: 'Maths', description: 'Grasp the fundamentals of variables and equations.', graphicId: 'maths-abstract' },
  { id: 'geometry-fundamentals', name: 'Geometry Fundamentals', category: 'Maths', description: 'Learn about shapes, lines, angles, and spaces.', graphicId: 'maths-abstract' },
  { id: 'algebra-trigonometry', name: 'Algebra and Trigonometry', category: 'Maths', description: 'Bridge algebra and geometry to solve new problems.', graphicId: 'maths-abstract' },
  { id: 'calculus', name: 'Calculus', category: 'Maths', description: 'Explore the mathematics of continuous change.', graphicId: 'maths-abstract' },
  { id: 'college-algebra', name: 'College Algebra', category: 'Maths', description: 'Prepare for higher-level mathematics courses.', graphicId: 'maths-abstract' },
  { id: 'contemporary-math', name: 'Contemporary Math', category: 'Maths', description: 'Apply mathematical concepts to modern-day problems.', graphicId: 'maths-abstract' },
  { id: 'developmental-math', name: 'Developmental Math', category: 'Maths', description: 'Build your foundational math skills from the ground up.', graphicId: 'maths-abstract' },
  { id: 'precalculus', name: 'Precalculus', category: 'Maths', description: 'Get ready for the world of calculus and advanced math.', graphicId: 'maths-abstract' },
  { id: 'data-science', name: 'Principles of Data Science', category: 'Maths', description: 'Learn to interpret, analyze, and visualize data.', graphicId: 'maths-abstract' },
  { id: 'secondary-math', name: 'Secondary Math', category: 'Maths', description: 'Core math concepts for middle and high school students.', graphicId: 'maths-abstract' },
  { id: 'statistics', name: 'Statistics', category: 'Maths', description: 'Understand data collection, analysis, and probability.', graphicId: 'maths-abstract' },
  { id: 'k-8-math', name: 'K-8 Math', category: 'Maths', description: 'Core concepts for elementary and middle school learners.', graphicId: 'maths-abstract' },
  
  // English Language Arts (ELA)
  { id: 'reading-respond', name: 'Reading to Understand & Respond', category: 'ELA', description: 'Improve your reading comprehension and critical analysis skills.', graphicId: 'ela-abstract' },
  { id: 'creative-writing', name: 'Creative Writing', category: 'ELA', description: 'Unleash your imagination and learn to write stories, poems, and more.', graphicId: 'ela-abstract' },
  { id: 'grammar-punctuation', name: 'Grammar and Punctuation', category: 'ELA', description: 'Master the essential rules of the English language for clear communication.', graphicId: 'ela-abstract' },
  { id: 'shakespeare', name: 'Introduction to Shakespeare', category: 'ELA', description: 'Explore the timeless stories and language of the world\'s most famous playwright.', graphicId: 'ela-abstract' },
  { id: 'phonics-foundations', name: 'Phonics Foundations', category: 'ELA', description: 'Master the sounds of letters and words for early readers.', graphicId: 'ela-abstract' },
  { id: 'literary-devices', name: 'Literary Devices', category: 'ELA', description: 'Understand metaphors, similes, and other tools of storytelling.', graphicId: 'ela-abstract' },
  { id: 'essay-writing', name: 'Essay Writing Structure', category: 'ELA', description: 'Learn to build a strong argument and write compelling essays.', graphicId: 'ela-abstract' },
  { id: 'public-speaking', name: 'Public Speaking and Debate', category: 'ELA', description: 'Build confidence in speaking, debating, and presenting ideas.', graphicId: 'ela-abstract' },
  
  // Computer Science
  { id: 'data-structures', name: 'Intro to Data Structures & Algorithms', category: 'Computer Science', description: 'Understand how data is organized and processed efficiently.', graphicId: 'cs-abstract' },
  { id: 'logical-statements', name: 'Logical Statements', category: 'Computer Science', description: 'Learn the building blocks of computer logic and reasoning.', graphicId: 'cs-abstract' },
  { id: 'intro-to-coding', name: 'Introduction to Coding', category: 'Computer Science', description: 'Learn the basic principles of programming and computational thinking.', graphicId: 'cs-abstract' },
  { id: 'how-internet-works', name: 'How the Internet Works', category: 'Computer Science', description: 'Discover the technology that connects the world.', graphicId: 'cs-abstract' },

  // Economics
  { id: 'econ-systems', name: 'An Overview of Economic Systems', category: 'Economics', description: 'Compare capitalism, socialism, and mixed economies.', graphicId: 'econ-abstract' },
  { id: 'micro-macro', name: 'Microeconomics & Macroeconomics', category: 'Economics', description: 'Understand economics on both small and large scales.', graphicId: 'econ-abstract' },
  { id: 'supply-demand', name: 'Supply and Demand', category: 'Economics', description: 'Learn the fundamental concept that drives market economies.', graphicId: 'econ-abstract' },
  { id: 'personal-finance', name: 'Personal Finance & Budgeting', category: 'Economics', description: 'Master the skills to manage your money effectively.', graphicId: 'econ-abstract' },

  // Career and Technical Education (CTE)
  { id: 'carpentry', name: 'Carpentry (HBI & NCCER Prep)', category: 'CTE', description: 'Prepare for industry certification exams in the construction trades.', graphicId: 'cte-trades' },
  { id: 'welding', name: 'Welding Fundamentals', category: 'CTE', description: 'Learn technical knowledge and hands-on skills for welding.', graphicId: 'cte-trades-2' },
  { id: 'safety-procedures', name: 'OSHA Safety Procedures', category: 'CTE', description: 'Understand OSHA regulations, proper tool handling, and safety protocols.', graphicId: 'cte-trades' },
  { id: 'robotics', name: 'Robotics: Design and Programming', category: 'CTE', description: 'Design, assemble, and program robotic systems, including breadboards and circuits.', graphicId: 'cte-tech' },
  { id: 'drone-operation', name: 'Drone Operation (FAA Prep)', category: 'CTE', description: 'Cover piloting skills and prepare for the FAA Remote Pilot certification test.', graphicId: 'cte-tech-2' },
  { id: 'agritech', name: 'AgriTech Innovations', category: 'CTE', description: 'Explore the intersection of technology and agriculture.', graphicId: 'cte-life-sci' },
  { id: 'vet-tech', name: 'Vet Tech Assistant Training', category: 'CTE', description: 'Gain the foundational knowledge for a career in veterinary technology.', graphicId: 'cte-life-sci-2' },
];

export const TUTORING_MODES: TutoringMode[] = [
  {
    id: 'socratic-dialogue',
    name: 'Socratic Dialogue',
    description: 'Engage in interactive, question-based learning to deepen your understanding of any subject.',
    imageUrl: 'https://picsum.photos/seed/socratic/800/400',
    path: '/chat/math', // Default to math, but could be any subject
  },
  {
    id: 'writing-coach',
    name: 'Writing Coach',
    description: 'Receive feedback and guidance on your essays, reports, and other writing assignments.',
    imageUrl: 'https://picsum.photos/seed/writing/800/400',
    path: '/writing-coach',
  },
];
