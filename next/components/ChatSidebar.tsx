import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';

const Sidebar = styled.div`
  width: 250px;
  min-width: 250px;
  background-color: #f5e6d3;
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  position: relative;
`;

const SidebarContent = styled.div`
  margin-top: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NewChatButton = styled.button`
  padding: 8px;
  background-color: #d4b08c;
  color: #8b4513;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 20px;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80%;
  box-sizing: border-box;

  &:hover {
    background-color: #e6ccb2;
  }

  span {
    margin-right: 8px;
    font-size: 20px;
  }
`;

const ChatHistoryList = styled.div`
  width: 80%;
`;

const HistoryNote = styled.div`
  font-size: 12px;
  color: #999;
  text-align: center;
  margin-top: 5px;
  padding: 0 20px;
`;

const Author = styled.div`
  position: absolute;
  bottom: 10px;
  left: 20px;
  font-size: 14px;
  color: #8b4513;
`;

const ChatHistoryItem = styled.div`
  padding: 8px;
  padding-left: 16px;
  margin-bottom: 8px;
  background-color: #e6ccb2;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 14px;
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    background-color: #d4b08c;
  }

  &.active {
    background-color: #8b4513;
    color: white;
  }

  .edit-title {
    display: none;
    width: calc(100% - 20px);
    padding: 2px;
    font-size: 14px;
    border: 1px solid #8b4513;
    border-radius: 4px;
  }
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 2px;
  right: 2px;
  background-color: rgba(255, 255, 255, 0.7);
  border: none;
  font-size: 14px;
  cursor: pointer;
  color: #8b4513;
  opacity: 0.7;
  transition: opacity 0.3s;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;

  &:hover {
    opacity: 1;
    background-color: rgba(255, 255, 255, 0.9);
  }
`;

interface ChatSidebarProps {
  currentChatId: string | null;
  setCurrentChatId: (id: string | null) => void;
  createNewChat: () => Promise<string>;
  chatHistory: Array<{ id: string; title: string }>;
  setChatHistory: React.Dispatch<React.SetStateAction<Array<{ id: string; title: string }>>>;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ 
  currentChatId, 
  setCurrentChatId, 
  createNewChat, 
  chatHistory, 
  setChatHistory 
}) => {
  const handleNewChat = async () => {
    const newChatId = await createNewChat();
    setCurrentChatId(newChatId);
  };

  const deleteChat = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setChatHistory(chatHistory.filter(chat => chat.id !== id));
    if (currentChatId === id) {
      setCurrentChatId(null);
    }
    localStorage.removeItem(`messages_${id}`);
  };

  const editChatTitle = (id: string, newTitle: string) => {
    setChatHistory(chatHistory.map(chat => 
      chat.id === id ? { ...chat, title: newTitle } : chat
    ));
  };

  return (
    <Sidebar>
      <SidebarContent>
        <NewChatButton onClick={handleNewChat}>
          <span>📝</span> 新对话
        </NewChatButton>
        <ChatHistoryList>
          {chatHistory.map((chat) => (
            <ChatHistoryItem
              key={chat.id}
              className={currentChatId === chat.id ? 'active' : ''}
              onClick={() => setCurrentChatId(chat.id)}
              onDoubleClick={(e) => {
                const titleElement = e.currentTarget.querySelector('.title') as HTMLElement;
                const inputElement = e.currentTarget.querySelector('.edit-title') as HTMLInputElement;
                if (titleElement && inputElement) {
                  titleElement.style.display = 'none';
                  inputElement.style.display = 'block';
                  inputElement.focus();
                }
              }}
            >
              <span className="title">{chat.title}</span>
              <input
                type="text"
                className="edit-title"
                defaultValue={chat.title}
                onBlur={(e) => {
                  editChatTitle(chat.id, e.target.value);
                  e.target.style.display = 'none';
                  const titleElement = e.currentTarget.parentElement?.querySelector('.title') as HTMLElement;
                  if (titleElement) titleElement.style.display = 'inline';
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    (e.target as HTMLInputElement).blur();
                  }
                }}
              />
              <DeleteButton onClick={(e) => deleteChat(chat.id, e)}>×</DeleteButton>
            </ChatHistoryItem>
          ))}
        </ChatHistoryList>
        <HistoryNote>
          历史记录将在关闭窗口后清空
          <br />
          双击可修改名称
        </HistoryNote>
      </SidebarContent>
      <Author>© Tyler Coman 2024</Author>
    </Sidebar>
  );
};

export default ChatSidebar;