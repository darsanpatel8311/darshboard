import React, { useEffect, useRef, useState } from 'react';
import { sendChatbotMessage } from '../services/chatbotService';
import '../css/Chatbot.css';

const quickPrompts = ['Services', 'Availability', 'Tech stack', 'Recent work', 'AI agents', 'Location'];
const CHAT_HISTORY_KEY = 'darshboard-chat-history';
const MAX_HISTORY_ITEMS = 20;

const getSavedMessages = () => {
  try {
    const savedMessages = JSON.parse(window.sessionStorage.getItem(CHAT_HISTORY_KEY));

    if (!Array.isArray(savedMessages)) return [];

    return savedMessages
      .filter(({ id, text, author }) => (
        typeof id === 'string'
        && typeof text === 'string'
        && (author === 'visitor' || author === 'assistant')
      ))
      .slice(-MAX_HISTORY_ITEMS);
  } catch (error) {
    return [];
  }
};

const ChatIcon = ({ close = false }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    {close ? <path d="M6 6l12 12M18 6L6 18" /> : <><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.7 8.7 0 0 1-3.7-.8L4 20l1.4-3.5A7.4 7.4 0 0 1 4 12a7.5 7.5 0 0 1 8-7.5 7.5 7.5 0 0 1 8 7Z" /><path d="M8 12h.01M12 12h.01M16 12h.01" /></>}
  </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 14-7-4 14-3-5-7-2Z" /><path d="m12 14 3-3" /></svg>
);

const TypingIndicator = () => (
  <div className="chatbot__typing" role="status" aria-label="Darshan is typing"><span /><span /><span /></div>
);

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(getSavedMessages);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages.slice(-MAX_HISTORY_ITEMS)));
    } catch (storageError) {
      // The chat still works if session storage is unavailable.
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) window.setTimeout(() => inputRef.current?.focus(), 150);
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, isSending]);

  const createMessage = (text, author) => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    text,
    author,
  });

  const sendMessage = async (text) => {
    const cleanText = text.trim();
    if (!cleanText || isSending) return;

    const visitorMessage = createMessage(cleanText, 'visitor');
    const history = [...messages, visitorMessage].slice(-MAX_HISTORY_ITEMS);

    setMessages(history);
    setError('');
    setIsSending(true);

    try {
      const { answer } = await sendChatbotMessage({
        message: cleanText,
        history: history.map(({ text: messageText, author }) => ({ text: messageText, author })),
      });
      setMessages((currentMessages) => [...currentMessages, createMessage(answer, 'assistant')].slice(-MAX_HISTORY_ITEMS));
    } catch (requestError) {
      setError(requestError.message || 'Unable to send your message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextMessage = message.trim();
    if (!nextMessage) return;

    setMessage('');
    sendMessage(nextMessage);
  };

  return (
    <aside className={`chatbot ${isOpen ? 'is-open' : ''}`} aria-label="Chat with Darshan">
      <section id="chatbot-panel" className="chatbot__panel" aria-hidden={!isOpen}>
        <header className="chatbot__header">
          <span className="chatbot__avatar"><ChatIcon /></span>
          <div className="chatbot__identity"><strong>Ask Darshan</strong><span><i /> Online · replies quickly</span></div>
          <button type="button" className="chatbot__close" aria-label="Close chat" onClick={() => setIsOpen(false)}><ChatIcon close /></button>
        </header>

        <div className="chatbot__body" aria-live="polite">
          <div className="chatbot__welcome"><p>Hi there <span aria-hidden="true">👋</span> I’m here to help with your next website or web app. Pick a question below, or send me a message.</p></div>
          {messages.map((chatMessage) => <p key={chatMessage.id} className={`chatbot__message chatbot__message--${chatMessage.author}`}>{chatMessage.text}</p>)}
          {isSending && <TypingIndicator />}
          <span ref={messagesEndRef} aria-hidden="true" />
        </div>

        <div className="chatbot__footer">
          <p className="chatbot__label">Quick prompts</p>
          <div className="chatbot__prompts">
            {quickPrompts.map((prompt) => <button key={prompt} type="button" disabled={isSending} onClick={() => sendMessage(prompt)}>{prompt}</button>)}
          </div>
          {error && <p className="chatbot__error" role="alert">{error}</p>}
          <form className="chatbot__form" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="chatbot-message">Your message</label>
            <input ref={inputRef} id="chatbot-message" type="text" value={message} disabled={isSending} onChange={(event) => setMessage(event.target.value)} placeholder="Ask anything..." autoComplete="off" />
            <button type="submit" disabled={isSending || !message.trim()} aria-label="Send message"><SendIcon /></button>
          </form>
        </div>
      </section>

      <button type="button" className="chatbot__launcher" aria-expanded={isOpen} aria-controls="chatbot-panel" aria-label={isOpen ? 'Close chat' : 'Open chat'} onClick={() => setIsOpen((currentState) => !currentState)}>
        <ChatIcon close={isOpen} /><span>{isOpen ? 'Close' : 'Ask me'}</span>
      </button>
    </aside>
  );
};

export default Chatbot;
