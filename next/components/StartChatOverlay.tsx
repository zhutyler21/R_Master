import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const Overlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Button = styled(motion.button)`
  padding: 15px 30px;
  font-size: 20px;
  background: linear-gradient(135deg, #faf6f0, #e6ccb2);
  color: #8b4513;
  border: 2px solid #8b4513;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background: linear-gradient(135deg, #e6ccb2, #d4b08c);
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
`;

interface StartChatOverlayProps {
  onStart: () => void;
}

const StartChatOverlay: React.FC<StartChatOverlayProps> = ({ onStart }) => {
  return (
    <Overlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Button
        onClick={onStart}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        开始聊天
      </Button>
    </Overlay>
  );
};

export default StartChatOverlay;