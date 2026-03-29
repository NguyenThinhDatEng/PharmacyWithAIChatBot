<template>
  <div class="panel">
    <h2>Tư vấn bởi dược sĩ</h2>
    <div class="chat-box">
      <div v-for="(msg, idx) in chatLog" :key="idx" :class="['chat-line', msg.role]">
        <strong>{{ msg.role === 'user' ? 'Bạn' : 'Dược sĩ AI' }}:</strong> {{ msg.text }}
      </div>
    </div>
    <textarea v-model="userMessage" rows="3" placeholder="Nhập câu hỏi"></textarea>
    <button @click="sendChat">Gửi</button>
    <p>{{ chatStatus }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const base = 'http://localhost:3000/api';
const userMessage = ref('');
const chatLog = ref([]);
const chatStatus = ref('');

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