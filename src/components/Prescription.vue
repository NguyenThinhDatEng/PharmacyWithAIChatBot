<template>
  <div class="panel">
    <h2>Mua thuốc theo đơn</h2>
    <input id="prescription-file" type="file" @change="e => prescriptionFile = e.target.files[0]" accept="image/*" />
    <textarea v-model="prescriptionNote" placeholder="Ghi chú" rows="3"></textarea>
    <button @click="uploadPrescription">Gửi đơn</button>
    <p>{{ prescriptionStatus }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const base = 'http://localhost:3000/api';
const prescriptionFile = ref(null);
const prescriptionNote = ref('');
const prescriptionStatus = ref('');

async function uploadPrescription() {
  if (!prescriptionFile.value) return;
  const form = new FormData();
  form.append('prescription', prescriptionFile.value);
  form.append('userId', 'user1');
  form.append('note', prescriptionNote.value);
  try {
    const res = await axios.post(`${base}/prescriptions`, form, { headers: {'Content-Type':'multipart/form-data'} });
    prescriptionStatus.value = 'Uploaded: ' + res.data.id;
    prescriptionNote.value = '';
    prescriptionFile.value = null;
    document.getElementById('prescription-file').value = '';
  } catch (error) {
    prescriptionStatus.value = 'Upload failed';
    console.error(error);
  }
}
</script>