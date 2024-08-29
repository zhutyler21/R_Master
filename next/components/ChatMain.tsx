import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';

const Main = styled.div<{ showOverlay: boolean }>`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: #faf6f0;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 12px 28px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  width: ${props => props.showOverlay ? 'calc(100% - 250px)' : 'calc(100% - 250px)'};
  max-width: 950px;
`;

const Messages = styled.div`
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
  background: rgba(250, 246, 240, 0.8);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  color: #4a4a4a;
  padding-right: 20px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #d4b08c;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background-color: #faf6f0;
  }
`;

const Message = styled(motion.div)`
  max-width: 70%;
  margin-bottom: 20px;
  padding: 15px;
  border-radius: 20px;
  position: relative;
  line-height: 1.5;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  background-color: ${({ className }) => (className === 'ning' ? '#e6ccb2' : '#d4b08c')};
  margin-left: ${({ className }) => (className === 'ning' ? '0' : 'auto')};
  margin-right: ${({ className }) => (className === 'ning' ? 'auto' : '0')};
  border-bottom-left-radius: ${({ className }) => (className === 'ning' ? '20px' : '0')};
  border-bottom-right-radius: ${({ className }) => (className === 'ning' ? '0' : '20px')};
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

const Sender = styled.span`
  font-weight: 500;
  color: #4a76a8;
  margin-right: 10px;
`;

const Timestamp = styled.span`
  font-size: 12px;
  color: #999;
`;

const MessageContent = styled.div`
  white-space: pre-wrap;
`;

const MessageFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 10px;
`;

const CopyButton = styled.button`
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 12px;
  background-color: transparent;
  border: 1px solid #8b4513;
  color: #8b4513;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #8b4513;
    color: white;
  }
`;

const TypingIndicator = styled.div`
  padding: 10px;
  background-color: #e6ccb2;
  border-radius: 20px;
  margin-bottom: 10px;
  display: none;

  span {
    height: 10px;
    width: 10px;
    float: left;
    margin: 0 1px;
    background-color: #8b4513;
    display: block;
    border-radius: 50%;
    opacity: 0.4;

    &:nth-of-type(1) { animation: 1s blink infinite 0.3333s; }
    &:nth-of-type(2) { animation: 1s blink infinite 0.6666s; }
    &:nth-of-type(3) { animation: 1s blink infinite 0.9999s; }
  }

  @keyframes blink {
    50% { opacity: 1; }
  }
`;

const InputArea = styled.div`
  display: flex;
  padding: 20px;
  background-color: #faf6f0;
  border-top: 1px solid #e6ccb2;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 15px;
  border: 1px solid #e6ccb2;
  border-radius: 30px;
  font-size: 16px;
  background-color: #fff;
  color: #4a4a4a;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const SendButton = styled.button`
  width: 50px;
  height: 50px;
  margin-left: 10px;
  background-color: #8b4513;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  transition: background-color 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #a0522d;
  }
`;

const API_KEY = 'app-3VlBQgR45jfaiJEY80yil2vq';
const API_URL = 'https://api.dify.ai/v1/chat-messages';

interface ChatMainProps {
  currentChatId: string | null;
  conversationId: string | null;
  setConversationId: (id: string | null) => void;
  userId: string;
  initialMessage: { sender: string; content: string; timestamp: string } | null;
  setInitialMessage: React.Dispatch<React.SetStateAction<{ sender: string; content: string; timestamp: string } | null>>;
  showOverlay: boolean;
}

const ChatMain: React.FC<ChatMainProps> = ({ 
  currentChatId, 
  conversationId, 
  setConversationId, 
  userId, 
  initialMessage,
  setInitialMessage,
  showOverlay
}) => {
  const [messages, setMessages] = useState<Array<{ sender: string; content: string; timestamp: string }>>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentChatId) {
      const storedMessages = localStorage.getItem(`messages_${currentChatId}`);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      } else if (initialMessage) {
        setMessages([initialMessage]);
        setInitialMessage(null);
      } else {
        setMessages([]);
      }
    }
  }, [currentChatId, initialMessage]);

  useEffect(() => {
    if (currentChatId) {
      localStorage.setItem(`messages_${currentChatId}`, JSON.stringify(messages));
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChatId, messages]);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = { sender: '👤 User', content: inputValue, timestamp: new Date().toLocaleTimeString() };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: {},
          query: inputValue,
          user: userId,
          response_mode: 'blocking',
          conversation_id: conversationId
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.answer) {
        const botMessage = { 
          sender: '~ Elf R 🕊️', 
          content: data.answer, 
          timestamp: new Date().toLocaleTimeString() 
        };
        setMessages(prevMessages => [...prevMessages, botMessage]);
        setConversationId(data.conversation_id);
      } else {
        throw new Error('No answer received');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { 
        sender: '~ Elf R 🕊️', 
        content: '发生错误，请稍后再试。', 
        timestamp: new Date().toLocaleTimeString() 
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      // 可以添加一个提示，表示复制成功
    }).catch(err => {
      console.error('复制失败:', err);
    });
  };

  const getSenderClass = (sender: string) => {
    return sender.toLowerCase().includes('user') ? 'ning' : 'elf-r';
  };

  return (
    <Main showOverlay={showOverlay}>
      <Messages>
        <AnimatePresence>
          {messages.map((msg, index) => (
            <Message
              key={index}
              className={getSenderClass(msg.sender)}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
            >
              <MessageHeader>
                <Sender>{msg.sender}</Sender>
                <Timestamp>{msg.timestamp}</Timestamp>
              </MessageHeader>
              <MessageContent>
                {msg.content}
              </MessageContent>
              {msg.sender === '~ Elf R 🕊️' && (
                <MessageFooter>
                  <CopyButton onClick={() => copyMessage(msg.content)}>复制</CopyButton>
                </MessageFooter>
              )}
            </Message>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </Messages>
      <TypingIndicator style={{ display: isTyping ? 'block' : 'none' }}>
        <span></span>
        <span></span>
        <span></span>
      </TypingIndicator>
      <InputArea>
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="输入消息..."
        />
        <SendButton onClick={sendMessage}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
            <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </SendButton>
      </InputArea>
    </Main>
  );
};

export default ChatMain;