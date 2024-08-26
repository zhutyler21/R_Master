import React from 'react';

const Message = ({ sender, content, isTeacher }) => (
  <div className={`message ${isTeacher ? 'teacher' : 'student'}`}>
    <div className="sender">{sender}</div>
    <div className="content">{content}</div>
  </div>
);

const ChatInterface = () => {
  const messages = [
    { sender: '学生10', content: '我是凯文,我对AI的潜力能力感到好奇。好的,Eric似乎更倾向于讨论架构差异和设计更好的模型,而不是上次课我们讨论的规模定律。我想知道你怎么看......', isTeacher: false },
    { sender: '斯坦福老师', content: '嗯,他提到了全部三个。你们还记得规模定律吗?它有三个部分。我记得我提到了Dario和他的团队的规模定律,要有更多的算力,更多的数据,以及算法的改进,例如增加参数。所有这三个部分......我认为我听到Eric说所有这三个部分都很重要,但是不要忽视最后一个部分,新的架构,所有这三个部分,我认为,都很重要。', isTeacher: true },
    { sender: '学生10', content: '我们离期有通用人工智能类型的系统,像这些脱离实际曲线的模型,有多近呢?这个问题可以吗?', isTeacher: false },
    // 可以根据需要添加更多消息
  ];

  return (
    <div className="chat-interface">
      {messages.map((message, index) => (
        <Message key={index} {...message} />
      ))}
    </div>
  );
};

export default ChatInterface;