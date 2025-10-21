

import { GoogleGenAI, GenerateContentResponse, Type, LiveServerMessage, Modality } from "@google/genai";
import { FeedbackCategory, Message, MindmapNode, Quiz, ImmersiveText, WritingFeedbackResponse } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const getWritingFeedbackSchema = {
    type: Type.OBJECT,
    properties: {
        feedback: {
            type: Type.ARRAY,
            description: "A list of feedback items for the user's text.",
            items: {
                type: Type.OBJECT,
                properties: {
                    category: {
                        type: Type.STRING,
                        description: `The category of feedback. Must be one of: ${Object.values(FeedbackCategory).join(', ')}.`,
                        enum: Object.values(FeedbackCategory),
                    },
                    feedback: {
                        type: Type.STRING,
                        description: "Specific feedback for the user on this category. Provide constructive and actionable advice. Use markdown for formatting if needed."
                    }
                },
                required: ["category", "feedback"]
            }
        }
    },
    required: ["feedback"]
};

export const getWritingFeedback = async (text: string): Promise<GenerateContentResponse> => {
  const systemInstruction = `You are a helpful writing coach. Analyze the user's text and provide feedback across these categories: ${Object.values(FeedbackCategory).join(', ')}. Your feedback should be constructive, clear, and aim to help the user improve their writing skills. Respond only with the requested JSON object.`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Please provide writing feedback for the following text:\n\n---\n\n${text}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: getWritingFeedbackSchema,
      },
    });
    return response;
  } catch (error) {
    console.error("Error getting writing feedback from Gemini API:", error);
    throw new Error("Failed to get writing feedback.");
  }
};

const formatChatHistoryForPrompt = (messages: Message[]): string => {
  // Exclude the initial AI greeting message for a cleaner context
  return messages.slice(1).map(msg => `${msg.sender === 'user' ? 'User' : 'Tutor'}: ${msg.text}`).join('\n');
};

const quizSchema = {
    type: Type.OBJECT,
    properties: {
        questions: {
            type: Type.ARRAY,
            description: "A list of quiz questions.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "The question text." },
                    options: {
                        type: Type.ARRAY,
                        description: "An array of 4 multiple-choice options.",
                        items: { type: Type.STRING }
                    },
                    correctAnswer: { type: Type.STRING, description: "The correct answer from the options list." },
                    explanation: { type: Type.STRING, description: "A brief explanation for why the answer is correct." }
                },
                required: ["question", "options", "correctAnswer", "explanation"]
            }
        }
    },
    required: ["questions"]
};

export const generateQuiz = async (messages: Message[]): Promise<Quiz> => {
    const chatHistory = formatChatHistoryForPrompt(messages);
    const systemInstruction = `You are an expert educator. Based on the provided conversation history, create a 5-question multiple-choice quiz to test the student's understanding. The questions should be relevant to the key topics discussed. For each question, provide 4 distinct options, clearly indicate the correct answer, and provide a short explanation for the correct answer.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Conversation History:\n\n${chatHistory}\n\nPlease generate the quiz now.`,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: quizSchema,
            },
        });
        // FIX: Add explicit type casting to the parsed JSON object to ensure type safety.
        const jsonResponse: Quiz = JSON.parse(response.text);
        if (!jsonResponse.questions || !Array.isArray(jsonResponse.questions)) {
             throw new Error("Invalid quiz format received from API.");
        }
        return jsonResponse;
    } catch (error) {
        console.error("Error generating quiz:", error);
        throw new Error("Failed to generate quiz data.");
    }
};

const immersiveTextContentBlockSchema = {
    type: Type.OBJECT,
    properties: {
        type: { type: Type.STRING, enum: ['paragraph', 'image'], description: "The type of content block." },
        text: { type: Type.STRING, description: "The text content for a 'paragraph' block. Should be null for 'image' blocks." },
        imageQuery: { type: Type.STRING, description: "A descriptive search query for a relevant image for an 'image' block. E.g., 'Roman aqueduct'. Should be null for 'paragraph' blocks." },
        caption: { type: Type.STRING, description: "A brief caption for an 'image' block. Should be null for 'paragraph' blocks." },
    },
    required: ["type"]
};

const immersiveTextSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "A concise, engaging title for the text." },
        learningObjectives: {
            type: Type.ARRAY,
            description: "A list of 3-4 key learning objectives for the student.",
            items: { type: Type.STRING }
        },
        content: {
            type: Type.ARRAY,
            description: "The main body of the text, structured as an array of content blocks. It should be comprehensive, around 600-800 words total, and interleave paragraphs with 2-3 relevant image blocks.",
            items: immersiveTextContentBlockSchema
        },
        keyTerms: {
            type: Type.ARRAY,
            description: "A list of key vocabulary terms found in the content.",
            items: {
                type: Type.OBJECT,
                properties: {
                    term: { type: Type.STRING, description: "The exact key term as it appears in the content." },
                    definition: { type: Type.STRING, description: "A simple, clear definition suitable for a K-12 student." }
                },
                required: ["term", "definition"]
            }
        }
    },
    required: ["title", "learningObjectives", "content", "keyTerms"]
};

export const generateSubtopics = async (subjectName: string): Promise<string[]> => {
    const systemInstruction = `You are a helpful learning assistant. For the given subject, generate a JSON array of 4-5 interesting subtopics that would be suitable for a K-12 student to explore. Keep the subtopic names concise and engaging. Respond ONLY with a JSON array of strings.`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Subject: "${subjectName}"`,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                },
            },
        });
        // FIX: Add explicit type casting to the parsed JSON object to ensure type safety.
        const jsonResponse: string[] = JSON.parse(response.text);
        return jsonResponse;
    } catch (error) {
        console.error("Error generating subtopics:", error);
        throw new Error("Failed to generate subtopics.");
    }
};


export const generateImmersiveText = async (subjectName: string, subtopic?: string): Promise<ImmersiveText> => {
    const systemInstruction = `You are an expert curriculum developer. Your task is to create a detailed and engaging "immersive text" article for a K-12 student. The response must be a single JSON object.

The article should include:
1.  A clear title. If a subtopic is provided, make it the main focus of the title.
2.  A list of 3-4 specific learning objectives.
3.  The main content, structured as an array of blocks. This content should be comprehensive (around 600-800 words in total text length) and should intersperse 2-3 relevant 'image' blocks within the 'paragraph' blocks to break up the text and provide visual context. For each 'image' block, provide a concise 'imageQuery' that can be used to find a photo (e.g., "ancient roman coins") and a descriptive 'caption'.
4.  A list of key vocabulary terms found within the text, along with their simple definitions.

Respond ONLY with the requested JSON object.`;

    const prompt = subtopic 
        ? `Please generate an immersive text article on the subject: "${subjectName}", with a specific focus on the subtopic: "${subtopic}".`
        : `Please generate an immersive text article on the subject: "${subjectName}".`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: immersiveTextSchema,
            },
        });
        // FIX: Add explicit type casting to the parsed JSON object to ensure type safety. This resolves a downstream error in ChatPage.tsx.
        const jsonResponse: ImmersiveText = JSON.parse(response.text);
        return jsonResponse;
    } catch (error) {
        console.error("Error generating immersive text:", error);
        throw new Error("Failed to generate immersive text data.");
    }
};

const decodeBase64 = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const attemptAudioGeneration = (script: string): Promise<{ script: string; audio: Uint8Array }> => {
  return new Promise((resolve, reject) => {
    let audioChunks: Uint8Array[] = [];

    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks: {
        onopen: () => {
          sessionPromise.then(session => {
            // Send the script to be synthesized into audio.
            session.sendRealtimeInput({ text: script });
            // Do NOT close the session here. Instead, we wait for the 'turnComplete'
            // signal from the server in the onmessage callback.
          });
        },
        onmessage: (message: LiveServerMessage) => {
          const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audioData) {
            audioChunks.push(decodeBase64(audioData));
          }
          // The 'turnComplete' flag indicates that the model has finished generating
          // its response (the audio). Now it is safe to close our side of the connection.
          if (message.serverContent?.turnComplete) {
            sessionPromise.then(session => session.close());
          }
        },
        onerror: (e: ErrorEvent) => {
          console.error("Live API Error during session:", e);
          const errorMessage = e.message || '';
          if (errorMessage.includes('The service is currently unavailable.')) {
            reject(new Error('Service Unavailable'));
          } else {
            reject(new Error("An unexpected error occurred during the audio session."));
          }
        },
        onclose: (e: CloseEvent) => {
          if (audioChunks.length === 0) {
            if (!e.wasClean) {
                 reject(new Error(`Audio generation connection closed unexpectedly. Code: ${e.code}, Reason: ${e.reason}`));
                 return;
            }
            // A clean close with no audio is a failure condition we can retry.
            reject(new Error("Audio generation finished but produced no audio data."));
            return;
          }
          const fullAudio = new Uint8Array(audioChunks.reduce((acc, chunk) => acc + chunk.length, 0));
          let offset = 0;
          for(const chunk of audioChunks) {
            fullAudio.set(chunk, offset);
            offset += chunk.length;
          }
          resolve({ script, audio: fullAudio });
        },
      },
      config: {
        systemInstruction: "You are a text-to-speech (TTS) engine. Your task is to read the user's text aloud, exactly as it is written. Do not add any extra words, comments, or conversational filler. Only narrate the provided text.",
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
        },
      },
    });

    // Handle failures in the initial connection promise itself.
    sessionPromise.catch((error: any) => {
        console.error("Live API Connection Error:", error);
        const errorMessage = (error.message || '').toString();
        if (errorMessage.includes('The service is currently unavailable.')) {
            reject(new Error('Service Unavailable'));
        } else {
            reject(new Error("Failed to connect to the audio generation service."));
        }
    });
  });
};

export const generateAudioLessonAndScript = async (messages: Message[]): Promise<{script: string, audio: Uint8Array}> => {
  // 1. Generate the script
  const chatHistory = formatChatHistoryForPrompt(messages);
  const scriptSystemInstruction = `You are an expert educator. Based on the following conversation between an AI tutor and a student, generate a detailed and engaging audio lesson script between 500 and 600 words. The script should be spoken in a friendly, encouraging tone, suitable for a K-12 student. It should expand on the key points of the conversation, provide deeper explanations, offer examples, and clarify any important concepts in a comprehensive way. Respond ONLY with the script text. Do not include any sound effect descriptions, stage directions, or non-narration text (e.g., '[Sound of music]').`;
  
  const scriptResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Here is the conversation history:\n\n${chatHistory}\n\nPlease generate the audio lesson script.`,
    config: {
      systemInstruction: scriptSystemInstruction,
    },
  });
  const script = scriptResponse.text;
  if (!script) {
      throw new Error("Failed to generate audio script text.");
  }

  // 2. Generate the audio from the script with a retry mechanism
  const MAX_RETRIES = 3;
  const INITIAL_DELAY_MS = 1000;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await attemptAudioGeneration(script);
    } catch (error: any) {
      lastError = error;
      // Define which errors are transient and worth retrying.
      const isRetriableError = 
        error.message === 'Service Unavailable' ||
        error.message === 'Audio generation finished but produced no audio data.';
      
      if (isRetriableError && attempt < MAX_RETRIES - 1) {
        const delay = INITIAL_DELAY_MS * Math.pow(2, attempt);
        console.log(`Audio generation attempt ${attempt + 1} failed: "${error.message}". Retrying in ${delay}ms...`);
        await new Promise(res => setTimeout(res, delay));
      } else {
        break; // Non-retriable error or max retries reached
      }
    }
  }

  console.error("Live API connection failed after multiple retries.", lastError);
  // Propagate the last specific error message for better debugging and user feedback.
  const finalErrorMessage = lastError?.message || "An unknown error occurred.";
  throw new Error(`Failed to generate audio: ${finalErrorMessage} Please try again later.`);
};


const mindmapSchema = {
    type: Type.OBJECT,
    properties: {
        topic: { type: Type.STRING, description: "The central topic of the mindmap." },
        children: {
            type: Type.ARRAY,
            description: "An array of sub-topics or nodes.",
            items: {
                type: Type.OBJECT,
                properties: {
                    topic: { type: Type.STRING, description: "The name of this sub-topic." },
                    children: {
                        type: Type.ARRAY,
                        description: "Nested children for this sub-topic.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                topic: { type: Type.STRING, description: "A nested sub-topic." },
                            }
                        }
                    }
                }
            }
        }
    },
    required: ["topic"]
};

export const generateMindmap = async (messages: Message[]): Promise<MindmapNode> => {
    const chatHistory = formatChatHistoryForPrompt(messages);
    const systemInstruction = `You are a helpful learning assistant. Analyze the following conversation and generate a JSON object representing a mindmap of the key topics and their relationships. The structure should be hierarchical, with a central topic and branching sub-topics. Keep the topic names concise. The central topic should be the main subject, and the children should be the key concepts discussed.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Here is the conversation history:\n\n${chatHistory}\n\nPlease generate the mindmap JSON.`,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: mindmapSchema,
            },
        });
        // FIX: Add explicit type casting to the parsed JSON object to ensure type safety.
        const jsonResponse: MindmapNode = JSON.parse(response.text);
        return jsonResponse;
    } catch (error) {
        console.error("Error generating mindmap:", error);
        throw new Error("Failed to generate mindmap data.");
    }
};

export const generateImageForQuery = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `A high-quality, photorealistic image of: ${prompt}. The image should be suitable for a K-12 educational context.`,
          },
        ],
      },
      config: {
          responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        const mimeType = part.inlineData.mimeType || 'image/png';
        return `data:${mimeType};base64,${base64ImageBytes}`;
      }
    }
    
    throw new Error("No image data found in the API response.");

  } catch (error) {
    console.error("Error generating image from Gemini API:", error);
    throw new Error("Failed to generate image.");
  }
};
