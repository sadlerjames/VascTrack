import { View, Text, TextInput, Button, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import Markdown from 'react-native-markdown-display';
import React, { useState, useRef } from 'react'
import { GEMINI_API_KEY } from '@env';
import ScreenWrapper from '../../../components/ScreenWrapper'
const { GoogleGenerativeAI } = require("@google/generative-ai");

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { role: "model", text: "Hi, how can I help you?", isWelcomeMessage: true } // Adds initial welcome message
  ]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef();
  
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
    if (!userInput.trim()) return;
    setLoading(true);
    const newMessages = [...messages, { role: "user", text: userInput }];
    setMessages(newMessages);
    setUserInput("");
    
    try {
      // Inform the chatbot that patients using this are vasculitis patients so responses are tailoured
      // Filter out welcome messages when sending to API
      const apiMessages = [
        {
          role: "user",
          text: "Note: This chatbot is being used by individuals with vasculitis. Please tailor all responses to be relevant, clear, and supportive for people managing this condition.",
        },
        ...newMessages.filter(msg => !msg.isWelcomeMessage)
      ];
      
      
      const chatSession = model.startChat({
        generationConfig,
        history: apiMessages.map(({ role, text }) => ({
          role,
          parts: [{ text }],
        })),
      });
      
      const result = await chatSession.sendMessage(userInput);
      const botResponse = result.response.text();
      setMessages([...newMessages, { role: "model", text: botResponse }]);
      
      // Scroll to bottom after new message
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
    }
    setLoading(false);
  };
  
  return (
    <ScreenWrapper enableScroll={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 200 : 0}
      >
        <View className="flex-1 p-3">
          {/* Chat History */}
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{ paddingBottom: 10 }}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            keyboardShouldPersistTaps="handled"
            style={{ flex: 1 }}
          >
            {messages.map((msg, index) => (
              <View key={index} style={{ marginBottom: 8, alignSelf: msg.role === "user" ? "flex-end" : "flex-start" }}>
                <View style={{
                  backgroundColor: msg.role === "user" ? "#3b82f6" : "#e5e7eb",
                  padding: 10,
                  borderRadius: 10,
                  maxWidth: "80%",
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start"
                }}>
                  <Markdown
                    style={{
                      body: { color: msg.role === "user" ? "white" : "black", fontSize: 16 },
                      strong: { fontWeight: "bold" },
                      list_item: { marginVertical: 5 }
                    }}
                  >
                    {msg.text}
                  </Markdown>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Input & Send Button */}
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
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
              multiline={true}
              autoCorrect={true}
              autoComplete="sentence"
              spellCheck={true}
              textContentType="none"
              keyboardType="default"
            />
            <Button title={loading ? "..." : "Send"} onPress={handleSendMessage} disabled={loading} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  )
}

export default ChatBot