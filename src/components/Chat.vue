<template>
  <!-- Floating Chat Icon -->
  <div class="chat-icon" @click="toggleChat" v-if="!isOpen">
    <i class="fas fa-comments"></i>
  </div>

  <!-- Chat Dialog -->
  <div class="chat-dialog" v-if="isOpen">
    <div class="chat-header">
      <span class="chat-title">AI Chatbot</span>
      <button class="close-btn" @click="toggleChat">&times;</button>
    </div>
    <div class="chat-body">
      <div class="chat-messages">
        <div v-for="(msg, idx) in chatLog" :key="idx" :class="['chat-line', msg.role]">
          <strong>{{ msg.role === 'user' ? 'Bạn' : 'Dược sĩ AI' }}:</strong> {{ msg.text }}
        </div>
      </div>
    </div>
    <div class="chat-input">
      <textarea v-model="userMessage" rows="2" placeholder="Nhập câu hỏi"></textarea>
      <button @click="sendChat">Gửi</button>
    </div>
    <p class="chat-status">{{ chatStatus }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const base = 'http://localhost:3000/api';
const userMessage = ref('');
const chatLog = ref([]);
const chatStatus = ref('');
const isOpen = ref(false);

function toggleChat() {
  isOpen.value = !isOpen.value;
}

async function sendChat() {
  if (!userMessage.value) return;
  chatStatus.value = 'Sending...';
  try {
    const res = await axios.post(`${base}/chat/pharmacist`, { userId: 'user1', message: userMessage.value });
    chatLog.value.push({ role: 'user', text: userMessage.value });
    chatLog.value.push({ role: 'assistant', text: res.data.answer });
    userMessage.value = '';
    chatStatus.value = '';
  } catch (error) {
    chatStatus.value = 'Chat failed';
    console.error(error);
  }
}
</script>

<style scoped>
.chat-icon {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background-color: #007bff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.chat-icon i {
  color: white;
  font-size: 24px;
}

.chat-dialog {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 350px;
  height: 500px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border-radius: 10px 10px 0 0;
}

.chat-title {
  font-weight: bold;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.chat-body {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
}

.chat-messages {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chat-line {
  padding: 8px 12px;
  border-radius: 8px;
  max-width: 80%;
}

.chat-line.user {
  align-self: flex-end;
  background-color: #007bff;
  color: white;
}

.chat-line.assistant {
  align-self: flex-start;
  background-color: #f1f1f1;
  color: black;
}

.chat-input {
  display: flex;
  padding: 10px;
  gap: 10px;
}

.chat-input textarea {
  flex: 1;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 8px;
  resize: none;
}

.chat-input button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.chat-status {
  margin: 0;
  padding: 0 10px 10px;
  font-size: 12px;
  color: #666;
}
</style>