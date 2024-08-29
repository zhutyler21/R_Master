import React from 'react';
import styled from '@emotion/styled';

const Header = styled.div`
  background-color: #8b4513;
  color: white;
  padding: 10px;
  text-align: center;
  font-size: 20px;
  font-weight: 500;
`;

const ChatHeader: React.FC = () => {
  return <Header>📈 R语言小精灵v0.2</Header>;
};

export default ChatHeader;