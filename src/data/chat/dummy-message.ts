// data/chat/dummy-messages.ts
import { v4 as uuidv4 } from 'uuid';

const conversationId = uuidv4();

export const dummyMessages = [
  {
    id: '1',
    text: "Hello! How can I help you with your studies today?",
    isUser: false,
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
    conversationId
  },
  {
    id: '2',
    text: "Can you explain quantum physics in simple terms?",
    isUser: true,
    timestamp: new Date(Date.now() - 86300000),
    conversationId
  },
  {
    id: '3',
    text: "Quantum physics is the study of matter and energy at the smallest scale. It's like looking at the building blocks of everything around us. Here are some key concepts:\n\n1. Wave-Particle Duality: Everything can behave as both a wave and a particle\n2. Uncertainty Principle: We can't know both the position and momentum of a particle exactly\n3. Superposition: Particles can exist in multiple states at once until observed",
    isUser: false,
    timestamp: new Date(Date.now() - 86200000),
    conversationId
  },
  {
    id: '4',
    text: "That's interesting! Can you give me a real-world example?",
    isUser: true,
    timestamp: new Date(Date.now() - 86100000),
    conversationId
  },
  {
    id: '5',
    text: "Here's a great example: Solar panels! They work because of the quantum photoelectric effect. When light (which shows wave-particle duality) hits the solar panel, it causes electrons to jump from one energy level to another. This quantum behavior is what generates electricity.\n\nAnother example is LED lights, which use quantum mechanics to emit specific colors of light when electrons change energy levels.",
    isUser: false,
    timestamp: new Date(Date.now() - 86000000),
    conversationId
  }
];