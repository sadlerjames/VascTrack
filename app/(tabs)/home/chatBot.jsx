import { View, Text, TextInput, Button, ScrollView } from 'react-native'
import React, { useState } from 'react'

import { GEMINI_API_KEY } from '@env';
import ScreenWrapper from '../../../components/ScreenWrapper'

const { GoogleGenerativeAI } = require("@google/generative-ai");

const ChatBot = () => {
  const [messages, setMessages] = useState([]); // Store chat history
  const [userInput, setUserInput] = useState(""); // Store user input
  const [loading, setLoading] = useState(false); // Loading state

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return; // Prevent empty messages
    setLoading(true);

    const newMessages = [...messages, { role: "user", text: userInput }];
    setMessages(newMessages);
    setUserInput("");

    try {
      const chatSession = model.startChat({
        generationConfig,
        history: newMessages.map(({ role, text }) => ({
          role,
          parts: [{ text }],
        })),
      });

      const result = await chatSession.sendMessage(userInput);
      const botResponse = result.response.text();

      setMessages([...newMessages, { role: "model", text: botResponse }]); // FIX: Use "model" instead of "bot"
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
    }

    setLoading(false);
  };

  return (
    <ScreenWrapper>
      <View className="flex-1 p-3">
        {/* Chat History */}
        <ScrollView style={{ flex: 1, marginBottom: 10 }}>
          {messages.map((msg, index) => (
            <View key={index} style={{ marginBottom: 8, alignSelf: msg.role === "user" ? "flex-end" : "flex-start" }}>
              <Text style={{ 
                backgroundColor: msg.role === "user" ? "#3b82f6" : "#e5e7eb",
                color: msg.role === "user" ? "white" : "black",
                padding: 10,
                borderRadius: 10,
                maxWidth: "80%",
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start"
              }}>
                {msg.text}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Input & Send Button */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TextInput
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 10,
              borderRadius: 8,
              marginRight: 10,
            }}
            placeholder="Ask me anything..."
            value={userInput}
            onChangeText={setUserInput}
          />
          <Button title={loading ? "..." : "Send"} onPress={handleSendMessage} disabled={loading} />
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default ChatBot
