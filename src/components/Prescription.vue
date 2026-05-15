<template>
  <div class="panel">
    <div class="prescription-header">
      <h2><i class="fas fa-file-prescription"></i> Mua thuốc theo đơn</h2>
      <p class="section-subtitle">Gửi đơn thuốc để được tư vấn và xử lý nhanh chóng</p>
    </div>

    <div class="prescription-form">
      <div class="upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleDrop">
        <div v-if="!prescriptionFile" class="upload-placeholder">
          <i class="fas fa-cloud-upload-alt"></i>
          <p>Kéo thả hoặc nhấn để tải đơn thuốc</p>
          <span>Hỗ trợ: JPG, PNG, PDF</span>
        </div>
        <div v-else class="upload-preview">
          <i class="fas fa-file-image"></i>
          <span>{{ prescriptionFile.name }}</span>
          <button @click.stop="removeFile" class="remove-file-btn" aria-label="Xóa file">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <input
          ref="fileInput"
          id="prescription-file"
          type="file"
          @change="e => prescriptionFile = e.target.files[0]"
          accept="image/*"
          class="file-input-hidden"
        />
      </div>

      <div class="form-group">
        <label for="prescription-note"><i class="fas fa-sticky-note"></i> Ghi chú cho dược sĩ</label>
        <textarea id="prescription-note" v-model="prescriptionNote" placeholder="Ví dụ: cần giao gấp, thay thế thuốc tương đương nếu hết..." rows="3"></textarea>
      </div>

      <button @click="uploadPrescription" class="submit-btn" :disabled="!prescriptionFile">
        <i class="fas fa-paper-plane"></i> Gửi đơn thuốc
      </button>

      <div v-if="prescriptionStatus" class="status-message" :class="{ error: prescriptionStatus.includes('failed') }">
        <i :class="prescriptionStatus.includes('failed') ? 'fas fa-exclamation-circle' : 'fas fa-check-circle'"></i>
        {{ prescriptionStatus }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const base = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const prescriptionFile = ref(null);
const prescriptionNote = ref('');
const prescriptionStatus = ref('');
const fileInput = ref(null);

function triggerFileInput() {
  fileInput.value?.click();
}

function handleDrop(e) {
  const file = e.dataTransfer.files[0];
  if (file) prescriptionFile.value = file;
}

function removeFile() {
  prescriptionFile.value = null;
  if (fileInput.value) fileInput.value.value = '';
}

async function uploadPrescription() {
  if (!prescriptionFile.value) return;
  const form = new FormData();
  form.append('prescription', prescriptionFile.value);
  form.append('userId', 'user1');
  form.append('note', prescriptionNote.value);
  try {
    const res = await axios.post(`${base}/prescriptions`, form, { headers: {'Content-Type':'multipart/form-data'} });
    prescriptionStatus.value = 'Đã gửi đơn thuốc thành công! Mã: ' + res.data.id;
    prescriptionNote.value = '';
    prescriptionFile.value = null;
    if (fileInput.value) fileInput.value.value = '';
  } catch (error) {
    prescriptionStatus.value = 'Gửi thất bại. Vui lòng thử lại.';
    console.error(error);
  }
}
</script>

<style scoped>
.prescription-header {
  text-align: center;
  margin-bottom: 32px;
}

.prescription-header h2 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.prescription-header h2 i {
  color: var(--primary);
}

.section-subtitle {
  color: var(--text-muted);
  font-size: 1rem;
}

.prescription-form {
  max-width: 560px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.upload-area {
  border: 2px dashed var(--border);
  border-radius: var(--radius-lg);
  padding: 40px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--bg-subtle);
}

.upload-area:hover {
  border-color: var(--primary);
  background: rgba(21, 128, 61, 0.04);
}

.upload-placeholder i {
  font-size: 2.5rem;
  color: var(--primary);
  margin-bottom: 12px;
}

.upload-placeholder p {
  font-weight: 600;
  color: var(--text-heading);
  margin-bottom: 4px;
}

.upload-placeholder span {
  font-size: 0.8125rem;
  color: var(--text-muted);
}

.upload-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.upload-preview i {
  color: var(--primary);
  font-size: 1.25rem;
}

.upload-preview span {
  font-weight: 500;
  color: var(--text-heading);
}

.remove-file-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid var(--accent-red);
  background: none;
  color: var(--accent-red);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  min-height: unset;
  font-size: 0.75rem;
  transition: all 0.2s ease;
}

.remove-file-btn:hover {
  background: var(--accent-red);
  color: white;
  box-shadow: none;
}

.file-input-hidden {
  display: none;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: var(--text-heading);
  font-size: 0.9375rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.form-group label i {
  color: var(--primary);
}

.submit-btn {
  padding: 14px 28px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  background: var(--primary-dark);
  box-shadow: var(--shadow-md);
  color: white;
}

.submit-btn:disabled {
  background: var(--border);
  color: var(--text-muted);
  cursor: not-allowed;
}

.status-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 18px;
  border-radius: var(--radius-md);
  font-size: 0.9375rem;
  font-weight: 500;
  background: #ECFDF5;
  color: #065F46;
  border: 1px solid #A7F3D0;
}

.status-message.error {
  background: #FEF2F2;
  color: #991B1B;
  border-color: #FECACA;
}

.status-message i {
  font-size: 1.1rem;
}
</style>
