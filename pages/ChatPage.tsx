

import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GoogleGenAI, Chat, FunctionDeclaration, Type, GenerateContentResponse } from '@google/genai';
import { useAppContext } from '../contexts/AppContext';
import { Message, Subject, MindmapNode, Quiz, ImmersiveText, KeyTerm, ToolSuggestion } from '../types';
import { MicIcon, SendIcon, TextIcon, AudioIcon, MindmapIcon, QuizIcon, BookOpenIcon, LogoIcon, LightbulbIcon, SparklesIcon } from '../components/IconComponents';
import { MascotIllustration } from '../components/IconComponents';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { generateAudioLessonAndScript, generateMindmap, generateQuiz, generateImmersiveText, generateSubtopics, generateImageForQuery } from '../services/geminiService';
import { SkeletonText, SkeletonBlock } from '../components/SkeletonLoader';


// --- Reusable Components defined within ChatPage for simplicity ---
const ChatView: React.FC<{ 
    messages: Message[], 
    messagesEndRef: React.RefObject<HTMLDivElement>,
    onGenerateImage: (messageId: string, prompt: string) => void;
    onExplainDifferently: (messageId: string) => void;
    onToolSuggestion: (toolName: ToolSuggestion['toolName']) => void;
}> = ({ messages, messagesEndRef, onGenerateImage, onExplainDifferently, onToolSuggestion }) => (
  <div className="flex-grow overflow-y-auto mb-4 space-y-6">
    {messages.map((message) => (
      <div key={message.id} className={`flex items-start gap-4 ${message.sender === 'user' ? 'justify-end' : ''}`}>
        {message.sender === 'ai' && <LogoIcon className="w-8 h-8 rounded-full flex-shrink-0" />}
        <div className={`group relative p-4 rounded-xl max-w-lg ${message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200'}`}>
          {message.isTyping ? <div className="typing-indicator"><span></span><span></span><span></span></div> : <p>{message.text}</p>}
          
          {message.imageSuggestionPrompt && (
            <button
              onClick={() => onGenerateImage(message.id, message.imageSuggestionPrompt!)}
              className="mt-3 w-full text-left bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              ✨ Visualize: "{message.imageSuggestionPrompt}"
            </button>
          )}

          {message.toolSuggestions && message.toolSuggestions.length > 0 && (
            <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Here's an idea:</p>
                <div className="space-y-2">
                    {message.toolSuggestions.map((suggestion, index) => (
                        <button key={index} onClick={() => onToolSuggestion(suggestion.toolName)} className="w-full text-left bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                           {suggestion.toolName === 'Quiz' ? '📝' : '🧠'} Take a {suggestion.toolName}
                           <span className="block text-xs font-normal opacity-70 mt-1">{suggestion.reason}</span>
                        </button>
                    ))}
                </div>
            </div>
          )}

          {message.isImageLoading && (
            <div className="mt-3">
              <SkeletonBlock className="w-full aspect-video" />
              <p className="text-sm text-center text-gray-500 mt-1">Generating image, please wait...</p>
            </div>
          )}
          {message.generatedImageUrl && (
            <img src={message.generatedImageUrl} alt={message.text} className="mt-3 rounded-lg shadow-md w-full" />
          )}
          
          {message.sender === 'ai' && !message.isTyping && (
             <button onClick={() => onExplainDifferently(message.id)} title="Explain differently" className="absolute -right-2 -top-2 p-1.5 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-yellow-100 dark:hover:bg-yellow-800 hover:text-yellow-600 dark:hover:text-yellow-400">
                <LightbulbIcon className="w-4 h-4"/>
             </button>
          )}

        </div>
      </div>
    ))}
    <div ref={messagesEndRef} />
  </div>
);

// Helper function to decode raw PCM data into an AudioBuffer
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length; // Assuming mono
  const buffer = ctx.createBuffer(1, frameCount, 24000); // Live API returns 24kHz mono
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
}


const AudioLessonView: React.FC<{ 
    lesson: { script: string; audio: AudioBuffer | null } | null;
    isLoading: boolean;
    onGenerate: () => void;
    canGenerate: boolean 
}> = ({ lesson, isLoading, onGenerate, canGenerate }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
    
    useEffect(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return () => {
            if (audioSourceRef.current) audioSourceRef.current.stop();
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close().catch(e => console.error("Error closing AudioContext", e));
            }
        };
    }, []);

    const handlePlayPause = () => {
        if (!lesson?.audio || !audioContextRef.current) return;
        if (isPlaying) {
            if(audioSourceRef.current) {
                audioSourceRef.current.stop();
                setIsPlaying(false);
            }
        } else {
            if (audioContextRef.current.state === 'suspended') audioContextRef.current.resume();
            const source = audioContextRef.current.createBufferSource();
            source.buffer = lesson.audio;
            source.connect(audioContextRef.current.destination);
            source.onended = () => setIsPlaying(false);
            source.start(0);
            audioSourceRef.current = source;
            setIsPlaying(true);
        }
    };

    if (isLoading) return (
        <div className="text-center p-8 flex flex-col items-center justify-center">
             <MascotIllustration className="w-40 h-40 mb-4 animate-pulse" />
            <h2 className="text-xl font-semibold mb-2">Generating your audio lesson...</h2>
            <p className="text-gray-600 dark:text-gray-400">This may take a moment.</p>
        </div>
    );
    if (!lesson) {
        return (
            <div className="text-center p-8">
                <h2 className="text-xl font-semibold mb-4">Generate an Audio Lesson</h2>
                <p className="mb-6 text-gray-600 dark:text-gray-400">Create a high-quality spoken lesson based on your conversation so far.</p>
                <button onClick={onGenerate} disabled={!canGenerate} className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                    {canGenerate ? 'Generate Now' : 'Continue your chat to enable'}
                </button>
            </div>
        )
    }

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Audio Lesson</h2>
            <div className="flex items-center space-x-4 mb-4">
                <button onClick={handlePlayPause} className="px-4 py-2 bg-blue-600 text-white rounded-lg" disabled={!lesson.audio}>{isPlaying ? 'Stop' : 'Play'}</button>
            </div>
            <div className="prose dark:prose-invert max-w-none">
                <p>{lesson.script}</p>
            </div>
        </div>
    );
};

const MindmapRenderer: React.FC<{ node: MindmapNode; level?: number }> = ({ node, level = 0 }) => (
  <li className={`ml-${level * 4}`}>
    <div className="flex items-center">
      <span className={`w-2 h-2 rounded-full mr-2 ${level === 0 ? 'bg-blue-500' : 'bg-gray-400'}`}></span>
      <span className={level === 0 ? 'font-bold text-lg' : 'text-md'}>{node.topic}</span>
    </div>
    {node.children && node.children.length > 0 && (
      <ul className="pl-6 pt-2 border-l border-gray-200 dark:border-gray-700">
        {node.children.map((child, index) => (
          <MindmapRenderer key={index} node={child} level={level + 1} />
        ))}
      </ul>
    )}
  </li>
);

const MindmapView: React.FC<{ data: MindmapNode | null; isLoading: boolean; onGenerate: () => void; canGenerate: boolean }> = ({ data, isLoading, onGenerate, canGenerate }) => {
    if (isLoading) return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <SkeletonText className="h-8 w-1/2 mb-6" />
          <div className="space-y-4">
            <div className="flex items-center"><SkeletonBlock className="w-2 h-2 rounded-full mr-2" /><SkeletonText className="h-6 w-1/3" /></div>
            <div className="pl-6 space-y-3"><SkeletonText className="h-5 w-1/2" /><SkeletonText className="h-5 w-2/5" /></div>
            <div className="flex items-center"><SkeletonBlock className="w-2 h-2 rounded-full mr-2" /><SkeletonText className="h-6 w-1/4" /></div>
          </div>
      </div>
    );
    if (!data) {
        return (
            <div className="text-center p-8">
                <h2 className="text-xl font-semibold mb-4">Generate a Mindmap</h2>
                <p className="mb-6 text-gray-600 dark:text-gray-400">Visualize the key concepts from your conversation.</p>
                <button onClick={onGenerate} disabled={!canGenerate} className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                     {canGenerate ? 'Generate Now' : 'Continue your chat to enable'}
                </button>
            </div>
        )
    }
    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Conversation Mindmap</h2>
            <ul className="space-y-2">
                <MindmapRenderer node={data} />
            </ul>
        </div>
    );
};

const QuizView: React.FC<{ data: Quiz | null; isLoading: boolean; onGenerate: () => void; canGenerate: boolean }> = ({ data, isLoading, onGenerate, canGenerate }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
    const [quizCompleted, setQuizCompleted] = useState(false);

    if (isLoading) return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <SkeletonText className="h-8 w-1/3 mb-2" />
            <SkeletonText className="h-4 w-1/4 mb-6" />
            <SkeletonText className="h-6 w-3/4 mb-6" />
            <div className="space-y-3">
                <SkeletonBlock className="h-12 w-full rounded-lg" />
                <SkeletonBlock className="h-12 w-full rounded-lg" />
                <SkeletonBlock className="h-12 w-full rounded-lg" />
                <SkeletonBlock className="h-12 w-full rounded-lg" />
            </div>
        </div>
    );
    if (!data) {
        return (
            <div className="text-center p-8">
                <h2 className="text-xl font-semibold mb-4">Generate a Quiz</h2>
                <p className="mb-6 text-gray-600 dark:text-gray-400">Test your knowledge on what you've learned so far.</p>
                <button onClick={onGenerate} disabled={!canGenerate} className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                    {canGenerate ? 'Generate Now' : 'Continue your chat to enable'}
                </button>
            </div>
        );
    }

    const handleSubmitAnswer = () => {
        if (currentQuestionIndex < data.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setQuizCompleted(true);
        }
    };

    const handleSelectAnswer = (option: string) => {
        setSelectedAnswers(prev => ({ ...prev, [currentQuestionIndex]: option }));
    };

    const score = data.questions.reduce((acc, question, index) => {
        return selectedAnswers[index] === question.correctAnswer ? acc + 1 : acc;
    }, 0);

    if (quizCompleted) {
        return (
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
                <div className="text-center text-lg mb-6">
                    You scored <span className="font-bold text-blue-600">{score}</span> out of <span className="font-bold">{data.questions.length}</span>
                </div>
                <div>
                    {data.questions.map((q, index) => (
                        <div key={index} className="mb-4 p-4 border dark:border-gray-700 rounded-lg">
                            <p className="font-semibold">{q.question}</p>
                            <p className={`mt-2 ${selectedAnswers[index] === q.correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
                                Your answer: {selectedAnswers[index] || "Not answered"}
                            </p>
                            <p className="text-green-700">Correct answer: {q.correctAnswer}</p>
                            <p className="text-sm text-gray-500 mt-1">{q.explanation}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const currentQuestion = data.questions[currentQuestionIndex];
    const selectedOption = selectedAnswers[currentQuestionIndex];

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-2">Quiz Time!</h2>
            <p className="text-gray-500 mb-6">Question {currentQuestionIndex + 1} of {data.questions.length}</p>

            <div className="mb-6">
                <p className="text-lg font-semibold">{currentQuestion.question}</p>
            </div>
            <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleSelectAnswer(option)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                            selectedOption === option
                                ? 'bg-blue-100 dark:bg-blue-900 border-blue-500'
                                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-transparent'
                        }`}
                    >
                        {option}
                    </button>
                ))}
            </div>
            <button
                onClick={handleSubmitAnswer}
                disabled={!selectedOption}
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {currentQuestionIndex < data.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
        </div>
    );
};

const ImmersiveTextView: React.FC<{ data: ImmersiveText | null; isLoading: boolean; onGenerate: (subtopic?: string) => void; subjectName: string; }> = ({ data, isLoading, onGenerate, subjectName }) => {
    const [subtopics, setSubtopics] = useState<string[] | null>(null);
    const [isLoadingSubtopics, setIsLoadingSubtopics] = useState(false);
    const [activeTerm, setActiveTerm] = useState<KeyTerm | null>(null);

    useEffect(() => {
        const fetchSubtopics = async () => {
            setIsLoadingSubtopics(true);
            try {
                const result = await generateSubtopics(subjectName);
                setSubtopics(result);
            } catch (error) {
                console.error("Failed to fetch subtopics:", error);
            } finally {
                setIsLoadingSubtopics(false);
            }
        };
        fetchSubtopics();
    }, [subjectName]);
    
    const generateAndSetImmersiveText = (subtopic?: string) => {
        setSubtopics(null); // Hide subtopics after one is chosen
        onGenerate(subtopic);
    };

    const renderContentWithKeyTerms = (content: string, termMap: Map<string, KeyTerm>) => {
        const terms = Array.from(termMap.keys());
        if (terms.length === 0) return <p>{content}</p>;
        const regex = new RegExp(`(${terms.join('|')})`, 'gi');
        const parts = content.split(regex);

        return parts.map((part, index) => {
            const lowerPart = part.toLowerCase();
            const termData = termMap.get(lowerPart);
            if (termData) {
                return (
                    <span key={index} className="relative">
                        <span 
                          className="font-bold text-blue-500 cursor-pointer hover:underline"
                          onClick={(e) => { e.stopPropagation(); setActiveTerm(termData); }}
                        >
                          {part}
                        </span>
                        {activeTerm && activeTerm.term === termData.term && (
                             <div 
                                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-800 text-white rounded-lg shadow-lg z-10"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {termData.definition}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-gray-800"></div>
                            </div>
                        )}
                    </span>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };
    
    const ImageBlock: React.FC<{ query: string; caption?: string }> = ({ query, caption }) => {
        const [imageUrl, setImageUrl] = useState<string | null>(null);
        const [isLoadingImage, setIsLoadingImage] = useState(true);

        useEffect(() => {
            const fetchImage = async () => {
                setIsLoadingImage(true);
                try {
                    const url = await generateImageForQuery(query);
                    setImageUrl(url);
                } catch (error) {
                    console.error(`Failed to generate image for "${query}":`, error);
                    setImageUrl(null);
                } finally {
                    setIsLoadingImage(false);
                }
            };

            fetchImage();
        }, [query]);

        return (
            <figure className="my-6">
                {isLoadingImage && <SkeletonBlock className="w-full h-64 rounded-lg" />}
                {!isLoadingImage && imageUrl && <img src={imageUrl} alt={caption || query} className="w-full h-auto rounded-lg shadow-md" />}
                {caption && <figcaption className="text-center text-sm text-gray-500 mt-2">{caption}</figcaption>}
            </figure>
        )
    };


    if (isLoading) return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <SkeletonText className="h-10 w-3/4 mb-6" />
          <SkeletonBlock className="h-24 w-full mb-6" />
          <SkeletonText className="h-5 w-full mb-3" />
          <SkeletonText className="h-5 w-full mb-3" />
          <SkeletonText className="h-5 w-5/6 mb-8" />
          <SkeletonBlock className="w-full h-64 rounded-lg mb-8" />
           <SkeletonText className="h-5 w-full mb-3" />
          <SkeletonText className="h-5 w-2/3 mb-3" />
      </div>
    );

    if (!data) {
        return (
            <div className="text-center p-8">
                <h2 className="text-xl font-semibold mb-4">Explore a Topic</h2>
                <p className="mb-6 text-gray-600 dark:text-gray-400">Choose a starting point for a deep-dive article.</p>
                <div className="space-y-3 max-w-md mx-auto">
                    <button onClick={() => generateAndSetImmersiveText()} className="w-full bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700">
                        Give me a general overview
                    </button>
                    <div className="my-4 text-gray-500">OR</div>
                    {isLoadingSubtopics && <p>Loading subtopics...</p>}
                    {subtopics?.map(subtopic => (
                        <button key={subtopic} onClick={() => generateAndSetImmersiveText(subtopic)} className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                           Tell me about "{subtopic}"
                        </button>
                    ))}
                </div>
            </div>
        );
    }
    
    const termMap: Map<string, KeyTerm> = new Map(
      (data.keyTerms || [])
        .filter(kt => kt && typeof kt.term === 'string')
        .map(kt => [kt.term.toLowerCase(), kt])
    );

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md" onClick={() => setActiveTerm(null)}>
            <article className="prose dark:prose-invert max-w-none">
                 <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
                 <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/50 border-l-4 border-blue-500 rounded-r-lg">
                    <h3 className="font-semibold text-lg">Learning Objectives</h3>
                    <ul className="list-disc pl-5 mt-2">
                        {data.learningObjectives.map((obj, i) => <li key={i}>{obj}</li>)}
                    </ul>
                 </div>
                 
                 {data.content.map((block, index) => {
                     if (block.type === 'paragraph' && block.text) {
                         return <p key={index}>{renderContentWithKeyTerms(block.text, termMap)}</p>;
                     }
                     if (block.type === 'image' && block.imageQuery) {
                         return <ImageBlock key={index} query={block.imageQuery} caption={block.caption} />;
                     }
                     return null;
                 })}
            </article>
        </div>
    );
};


const suggestToolFunctionDeclaration: FunctionDeclaration = {
  name: 'suggestTool',
  parameters: {
    type: Type.OBJECT,
    description: 'Suggest a learning tool to the user when they have shown a good grasp of a topic or a sub-topic is complete.',
    properties: {
      toolName: {
        type: Type.STRING,
        description: 'The name of the tool to suggest. Must be either "Quiz" or "Mindmap".',
        enum: ['Quiz', 'Mindmap'],
      },
      reason: {
        type: Type.STRING,
        description: 'A short, encouraging reason for the suggestion, explaining why it is a good next step. E.g., "to test your knowledge" or "to visualize the concepts".',
      },
    },
    required: ['toolName', 'reason'],
  },
};


const ChatPage: React.FC = () => {
    const { subjectId } = useParams<{ subjectId: string }>();
    const { subjects, addRecentSubject, addToast } = useAppContext();
    const subject = subjects.find(s => s.id === subjectId) as Subject;

    const [messages, setMessages] = useState<Message[]>([]);
    const [chat, setChat] = useState<Chat | null>(null);
    const [currentInput, setCurrentInput] = useState('');
    const [isAiTyping, setIsAiTyping] = useState(false);
    
    const [activeView, setActiveView] = useState('chat');

    const [audioLesson, setAudioLesson] = useState<{ script: string; audio: AudioBuffer | null } | null>(null);
    const [isAudioLoading, setIsAudioLoading] = useState(false);

    const [mindmapData, setMindmapData] = useState<MindmapNode | null>(null);
    const [isMindmapLoading, setIsMindmapLoading] = useState(false);

    const [quizData, setQuizData] = useState<Quiz | null>(null);
    const [isQuizLoading, setIsQuizLoading] = useState(false);
    
    const [immersiveTextData, setImmersiveTextData] = useState<ImmersiveText | null>(null);
    const [isImmersiveTextLoading, setIsImmersiveTextLoading] = useState(false);


    const chatInitialized = useRef(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleTranscript = async (transcript: string) => {
        if(transcript) {
            setCurrentInput(transcript);
            await handleSendMessage(transcript);
        }
    };

    const { isListening, startListening, stopListening } = useSpeechRecognition(handleTranscript);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isAiTyping]);

    useEffect(() => {
        if (chatInitialized.current || !subject) return;
        chatInitialized.current = true;
        
        addRecentSubject(subject.id);
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
        const initialPrompt = `Hello! I'm your AI tutor. I'm ready to have a Socratic dialogue with you about "${subject.name}". To begin, what's something you already know or find interesting about this topic?`;
        
        setMessages([{ id: 'initial', text: initialPrompt, sender: 'ai' }]);
        
        const chatSession = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: `You are an expert AI Tutor engaging a K-12 student in a Socratic dialogue about "${subject.name}". Your primary goal is to guide the student's learning by asking thought-provoking questions, not just giving answers. Adapt your language and question difficulty based on the user's responses; simplify for struggling users, and introduce complexity for those who are excelling.

Keep your responses concise, encouraging, and conversational. Ask one question at a time. Never reveal you are an AI.

When you discuss a concept that is highly visual (like a historical artifact or a scientific process), suggest an image by embedding a special tag: [Generate Image: "a descriptive prompt for an image"].

After a few conversational turns (4-6 messages), if the student seems to understand a concept, use the 'suggestTool' function to proactively recommend a 'Quiz' to test their knowledge or a 'Mindmap' to visualize the connections. Do not use the function on every response, only when it feels like a natural next step to solidify learning.`,
                 tools: [{functionDeclarations: [suggestToolFunctionDeclaration]}],
            },
        });
        setChat(chatSession);

    }, [subject, addRecentSubject]);
    
    const handleGenerateImageForMessage = async (messageId: string, prompt: string) => {
        setMessages(prev => prev.map(msg => 
            msg.id === messageId ? { ...msg, isImageLoading: true, imageSuggestionPrompt: undefined } : msg
        ));

        try {
            const imageUrl = await generateImageForQuery(prompt);
            setMessages(prev => prev.map(msg => 
                msg.id === messageId ? { ...msg, isImageLoading: false, generatedImageUrl: imageUrl } : msg
            ));
        } catch (error) {
            console.error("Failed to generate image for message:", error);
            addToast("Sorry, I couldn't create an image for this.", 'error');
            setMessages(prev => prev.map(msg => 
                msg.id === messageId ? { ...msg, isImageLoading: false } : msg
            ));
        }
    };
    
    const handleExplainDifferently = (messageId: string) => {
        const messageToExplain = messages.find(m => m.id === messageId);
        if (messageToExplain) {
            handleSendMessage(`Can you explain this part differently? "${messageToExplain.text}"`);
        }
    }
    
    const processApiResponse = (response: GenerateContentResponse) => {
        let cleanText = response.text;
        let toolSuggestions: ToolSuggestion[] | undefined = undefined;

        // Handle function calls for tool suggestions
        if (response.functionCalls && response.functionCalls.length > 0) {
            toolSuggestions = response.functionCalls.map(fc => ({
                toolName: fc.args.toolName as ToolSuggestion['toolName'],
                // FIX: Cast the 'reason' property from the function call arguments to a string to match the ToolSuggestion type.
                reason: fc.args.reason as string,
            }));
        }

        // Handle image suggestions
        const imageSuggestionRegex = /\[Generate Image: "([^"]+)"\]/;
        const match = cleanText.match(imageSuggestionRegex);
        let imageSuggestionPrompt: string | undefined = undefined;
        if (match?.[1]) {
            imageSuggestionPrompt = match[1];
            cleanText = cleanText.replace(imageSuggestionRegex, '').trim();
        }

        setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if(lastMessage.isTyping) {
               newMessages[newMessages.length - 1] = { 
                   ...lastMessage, 
                   id: `ai-${Date.now()}`, 
                   isTyping: false,
                   text: cleanText,
                   imageSuggestionPrompt: imageSuggestionPrompt,
                   toolSuggestions: toolSuggestions,
                };
            }
            return newMessages;
        });
    }

    const handleSendMessage = async (textToSend?: string) => {
        const messageText = (textToSend || currentInput).trim();
        if (!messageText || !chat || isAiTyping) return;

        const newUserMessage: Message = { id: Date.now().toString(), text: messageText, sender: 'user' };
        setMessages(prev => [...prev, newUserMessage]);
        setCurrentInput('');
        setIsAiTyping(true);
        setMessages(prev => [...prev, { id: 'ai-typing', text: '', sender: 'ai', isTyping: true }]);

        try {
            const response = await chat.sendMessage({ message: messageText });
            processApiResponse(response);
        } catch (error) {
            console.error('Error sending message:', error);
            addToast('Sorry, I encountered an error. Please try again.', 'error');
            const errorMessage: Message = { id: `err-${Date.now()}`, text: 'Sorry, I encountered an error. Please try again.', sender: 'ai' };
            setMessages(prev => [...prev.slice(0, -1), errorMessage]);
        } finally {
            setIsAiTyping(false);
        }
    };
    
    const handleToolSuggestion = (toolName: ToolSuggestion['toolName']) => {
        if (toolName === 'Quiz') {
            setActiveView('quiz');
            handleGenerateQuiz();
        } else if (toolName === 'Mindmap') {
            setActiveView('mindmap');
            handleGenerateMindmap();
        }
    };

    const handleGenerateAudioLesson = async () => {
        setIsAudioLoading(true);
        try {
            const { script, audio } = await generateAudioLessonAndScript(messages);
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const audioBuffer = await decodeAudioData(audio, audioContext);
            setAudioLesson({ script, audio: audioBuffer });
        } catch (error) {
            console.error("Failed to generate audio lesson:", error);
            addToast(`Failed to generate audio: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
        } finally {
            setIsAudioLoading(false);
        }
    };
    
    const handleGenerateMindmap = async () => {
        setIsMindmapLoading(true);
        try {
            const data = await generateMindmap(messages);
            setMindmapData(data);
        } catch(error) {
             console.error("Failed to generate mindmap:", error);
             addToast('Failed to generate the mindmap. Please try again.', 'error');
        } finally {
            setIsMindmapLoading(false);
        }
    };
    
    const handleGenerateQuiz = async () => {
        setIsQuizLoading(true);
         try {
            const data = await generateQuiz(messages);
            setQuizData(data);
        } catch(error) {
             console.error("Failed to generate quiz:", error);
             addToast('Failed to build the quiz. Please try again.', 'error');
        } finally {
            setIsQuizLoading(false);
        }
    };
    
    const handleGenerateImmersiveText = async (subtopic?: string) => {
        setIsImmersiveTextLoading(true);
        try {
            const data = await generateImmersiveText(subject.name, subtopic);
            setImmersiveTextData(data);
        } catch (error) {
            console.error("Failed to generate immersive text:", error);
            addToast('Failed to create the lesson text. Please try again.', 'error');
        } finally {
            setIsImmersiveTextLoading(false);
        }
    };

    const renderViewContent = () => {
        const canGenerateContent = messages.length > 3;
        const animationClass = "transition-opacity duration-300 opacity-100";
        return (
          <div key={activeView} className={animationClass}>
            {activeView === 'chat' && <ChatView messages={messages} messagesEndRef={messagesEndRef} onGenerateImage={handleGenerateImageForMessage} onExplainDifferently={handleExplainDifferently} onToolSuggestion={handleToolSuggestion} />}
            {activeView === 'audio' && <AudioLessonView lesson={audioLesson} isLoading={isAudioLoading} onGenerate={handleGenerateAudioLesson} canGenerate={canGenerateContent} />}
            {activeView === 'mindmap' && <MindmapView data={mindmapData} isLoading={isMindmapLoading} onGenerate={handleGenerateMindmap} canGenerate={canGenerateContent} />}
            {activeView === 'quiz' && <QuizView data={quizData} isLoading={isQuizLoading} onGenerate={handleGenerateQuiz} canGenerate={canGenerateContent} />}
            {activeView === 'text' && <ImmersiveTextView data={immersiveTextData} isLoading={isImmersiveTextLoading} onGenerate={handleGenerateImmersiveText} subjectName={subject.name} />}
          </div>
        );
    };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <aside className="w-20 bg-white dark:bg-gray-800 p-2 flex flex-col items-center space-y-4 border-r border-gray-200 dark:border-gray-700">
        <Link to="/dashboard" className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
          <LogoIcon className="h-8 w-8 text-blue-600" />
        </Link>
        <div className="flex-grow space-y-2">
            {[
                { id: 'chat', icon: TextIcon, label: 'Chat' },
                { id: 'text', icon: BookOpenIcon, label: 'Immersive Text' },
                { id: 'audio', icon: AudioIcon, label: 'Audio Lesson' },
                { id: 'mindmap', icon: MindmapIcon, label: 'Mindmap' },
                { id: 'quiz', icon: QuizIcon, label: 'Quiz' },
            ].map(view => (
                <button
                    key={view.id}
                    onClick={() => setActiveView(view.id)}
                    className={`w-14 h-14 flex items-center justify-center rounded-lg transition-colors ${
                        activeView === view.id ? 'bg-blue-100 dark:bg-blue-900 text-blue-600' : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    title={view.label}
                    aria-label={view.label}
                >
                    <view.icon className="h-6 w-6" />
                </button>
            ))}
        </div>
      </aside>

      <main className="flex-1 flex flex-col p-6 overflow-hidden">
        <header className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{subject?.name}</h1>
          <p className="text-gray-500 dark:text-gray-400">Engage in a Socratic dialogue to explore this topic.</p>
        </header>
        <div className={`flex-1 flex flex-col bg-gray-200 dark:bg-gray-800/50 rounded-xl p-6 overflow-hidden`}>
            <div className="flex-1 overflow-y-auto pr-2">
                {renderViewContent()}
            </div>
            {activeView === 'chat' && (
                <div className="mt-4 flex-shrink-0">
                    <div className="relative">
                        <textarea
                            value={currentInput}
                            onChange={(e) => setCurrentInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                                }
                            }}
                            placeholder="Type your message or use the mic..."
                            className="w-full p-4 pr-24 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-700 resize-none"
                            rows={1}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                            <button onClick={isListening ? stopListening : startListening} className={`p-2 rounded-full ${isListening ? 'bg-red-500 text-white animate-pulse' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                                <MicIcon className="w-6 h-6"/>
                            </button>
                            <button onClick={() => handleSendMessage()} disabled={!currentInput.trim() || isAiTyping} className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400">
                                <SendIcon className="w-6 h-6"/>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default ChatPage;