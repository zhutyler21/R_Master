import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import ChatSidebar from './ChatSidebar';
import ChatMain from './ChatMain';
import StartChatOverlay from './StartChatOverlay';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  height: 90vh;
  background-color: #faf6f0;
  border-radius: 20px;
  box-shadow: 0 12px 28px 0 rgba(0, 0, 0, 0.1), 0 2px 4px 0 rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin: 5vh auto;
`;

const Header = styled.div`
  background-color: #8b4513;
  color: white;
  padding: 10px;
  text-align: center;
  font-size: 20px;
  font-weight: 500;
`;

const Body = styled.div`
  display: flex;
  flex-grow: 1;
  overflow: hidden;
`;

const API_KEY = 'app-3VlBQgR45jfaiJEY80yil2vq';
const API_URL = 'https://api.dify.ai/v1/chat-messages';

const ChatContainer: React.FC = () => {
  const [showOverlay, setShowOverlay] = useState(true);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [userId] = useState('user_' + Math.random().toString(36).substr(2, 9));
  const [chatHistory, setChatHistory] = useState<Array<{ id: string; title: string }>>([]);
  const [initialMessage, setInitialMessage] = useState<{ sender: string; content: string; timestamp: string } | null>(null);

  useEffect(() => {
    const storedHistory = localStorage.getItem('chatHistory');
    if (storedHistory) {
      setChatHistory(JSON.parse(storedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);

  const startChat = async () => {
    setShowOverlay(false);
    await createNewChat();
  };

  const createNewChat = async () => {
    const newChatId = `chat_${Date.now()}`;
    setCurrentChatId(newChatId);
    setConversationId(null);
    const message = await sendInitialMessage(newChatId);
    if (message) {
      const newChat = { id: newChatId, title: `对话 ${new Date().toLocaleString()}` };
      setChatHistory(prevHistory => [newChat, ...prevHistory]);
      setInitialMessage(message);
    }
    return newChatId;
  };

  const sendInitialMessage = async (chatId: string) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: {},
          query: "开始聊天",
          user: userId,
          response_mode: 'blocking'
        })
      });

      const data = await response.json();

      if (response.ok && data.answer) {
        const message = { sender: 'Elf R', content: data.answer, timestamp: new Date().toLocaleTimeString() };
        localStorage.setItem(`messages_${chatId}`, JSON.stringify([message]));
        setConversationId(data.conversation_id);
        return message;
      }
    } catch (error) {
      console.error('Error starting chat:', error);
    }
    return null;
  };

  return (
    <Container>
      <Header>🧝‍♂️ R语言小精灵 📈 v0.2</Header>
      <Body>
        <ChatSidebar 
          currentChatId={currentChatId} 
          setCurrentChatId={setCurrentChatId}
          createNewChat={createNewChat}
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
        />
        <ChatMain
          currentChatId={currentChatId}
          conversationId={conversationId}
          setConversationId={setConversationId}
          userId={userId}
          initialMessage={initialMessage}
          setInitialMessage={setInitialMessage}
        />
      </Body>
      {showOverlay && <StartChatOverlay onStart={startChat} />}
    </Container>
  );
};

export default ChatContainer;