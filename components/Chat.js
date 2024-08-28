import { useState, useEffect, useRef } from 'react'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'

const API_KEY = 'app-3VlBQgR45jfaiJEY80yil2vq'
const API_URL = 'https://api.dify.ai/v1/chat-messages'

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const [showOverlay, setShowOverlay] = useState(true)
  const messagesEndRef = useRef(null)
  const userId = useRef(`user_${Math.random().toString(36).substr(2, 9)}`)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const addMessage = (sender, content) => {
    setMessages(prev => [...prev, { sender, content, timestamp: new Date() }])
  }

  const sendMessage = async (message) => {
    if (!message.trim()) return

    addMessage('User', message)
    setInput('')
    setIsTyping(true)

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: {},
          query: message,
          user: userId.current,
          response_mode: 'blocking',
          conversation_id: conversationId
        })
      })

      const data = await response.json()
      setIsTyping(false)

      if (response.ok) {
        if (data.answer) {
          addMessage('Elf R', data.answer)
          setConversationId(data.conversation_id)
        } else {
          addMessage('Elf R', '抱歉，我没有得到有效的回答。')
        }
      } else {
        addMessage('Elf R', `错误: ${data.message || '未知错误'}`)
      }
    } catch (error) {
      console.error('Error:', error)
      setIsTyping(false)
      addMessage('Elf R', '发生网络错误，请稍后再试。')
    }
  }

  const startChat = async () => {
    setShowOverlay(false)
    setIsTyping(true)
    await sendMessage("开始聊天")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <div className="bg-[#faf6f0] rounded-3xl shadow-lg overflow-hidden flex flex-col h-[90vh]">
      <div className="bg-[#8b4513] text-white p-4 text-center text-xl font-medium">
        🧝‍♂️ R语言小精灵 📈 v0.1
      </div>
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 bg-[#faf6f0] flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow p-3 border border-[#e6ccb2] rounded-full text-base bg-white shadow-md"
          placeholder="输入消息..."
        />
        <button
          type="submit"
          className="ml-2 bg-[#8b4513] text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-[#a0522d] transition-colors"
        >
          <PaperAirplaneIcon className="h-6 w-6" />
        </button>
      </form>
      <div className="text-xs text-gray-500 p-2">by Tyler Coman</div>
      {showOverlay && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <button
            onClick={startChat}
            className="px-8 py-4 text-2xl bg-[#faf6f0] text-[#8b4513] border