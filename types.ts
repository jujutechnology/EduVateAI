// FIX: Define and export all necessary types for the application.

export interface User {
  name: string;
  avatarUrl: string;
}

export interface Subject {
  id: string;
  name: string;
  category: string;
  description: string;
  graphicId: string;
}

export interface TutoringMode {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  path: string;
}

export interface ToolSuggestion {
    toolName: 'Quiz' | 'Mindmap';
    reason: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  isTyping?: boolean;
  imageSuggestionPrompt?: string;
  isImageLoading?: boolean;
  generatedImageUrl?: string;
  toolSuggestions?: ToolSuggestion[];
}

export enum FeedbackCategory {
  Clarity = 'Clarity',
  Conciseness = 'Conciseness',
  Engagement = 'Engagement',
  Grammar = 'Grammar',
  Structure = 'Structure',
}

export interface FeedbackItem {
  category: FeedbackCategory;
  feedback: string;
}

export interface WritingFeedbackResponse {
  feedback: FeedbackItem[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface Quiz {
  questions: QuizQuestion[];
}

export interface MindmapNode {
  topic: string;
  children?: MindmapNode[];
}

export interface KeyTerm {
  term: string;
  definition: string;
}

export interface ImmersiveTextContentBlock {
  type: 'paragraph' | 'image';
  text?: string;
  imageQuery?: string;
  caption?: string;
}

export interface ImmersiveText {
  title: string;
  learningObjectives: string[];
  content: ImmersiveTextContentBlock[];
  keyTerms: KeyTerm[];
}