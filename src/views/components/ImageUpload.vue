<template>
  <div class="image-upload">
    <div class="image-section">
      <h5 class="section-title">{{ sectionTitle }}</h5>
      <p class="section-description">{{ sectionDescription }}</p>
      
      <!-- Current image -->
      <div v-if="currentImageUrl" class="current-image-container">
        <div class="image-preview">
          <img :src="currentImageUrl" :alt="sectionTitle" class="uploaded-image" />
          <div class="image-overlay">
            <v-btn
              size="small"
              color="error"
              class="remove-btn"
              @click="removeImage"
              :loading="isRemoving"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </div>
      </div>

      <!-- Upload section -->
      <div class="upload-section">
        <div v-if="selectedFiles && selectedFiles.length" class="file-selected">
          <div class="file-info">
            <v-icon color="primary">mdi-file-image</v-icon>
            <span class="file-name">{{ selectedFiles[0].name }}</span>
            <span v-if="selectedFiles.length > 1" class="file-more">+{{ selectedFiles.length - 1 }}</span>
            <span class="file-size">({{ formatFileSize(selectedFiles[0].size) }})</span>
          </div>
          <v-btn size="small" variant="text" @click="clearSelection">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <div class="upload-buttons">
          <v-btn
            variant="outlined"
            color="primary"
            prepend-icon="mdi-paperclip"
            @click="triggerFileInput"
            :disabled="isUploading"
            class="select-image-btn"
          >
            <span class="select-image-text">{{ $t("select-image") }}</span>
          </v-btn>

          <v-btn
            v-if="selectedFiles && selectedFiles.length"
            color="primary"
            @click="uploadImage"
            :loading="isUploading"
          >
            {{ multiple ? $t('upload-images') : $t('upload-image') }}
          </v-btn>
        </div>

        <input
          ref="fileInput"
          type="file"
          :multiple="multiple"
          accept="image/*"
          style="display: none"
          @change="onFileSelected"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { validateFile, formatFileSize } from '@/utils/fileValidation';

export interface ImageUploadService {
  uploadImage(id: string, file: File): Promise<any>;
  removeImage(id: string): Promise<any>;
}

export default defineComponent({
  name: 'ImageUpload',
  props: {
    entityId: {
      type: String,
      required: true,
    },
    sectionTitle: {
      type: String,
      required: true,
    },
    sectionDescription: {
      type: String,
      required: true,
    },
    currentImageUrl: {
      type: String,
      default: null,
    },
    service: {
      type: Object as PropType<ImageUploadService>,
      required: true,
    },
    storeModule: {
      type: String,
      required: true,
    },
    fetchAction: {
      type: String,
      required: true,
    },
    maxSize: {
      type: Number,
      default: 10 * 1024 * 1024, // 10MB
    },
    allowedTypes: {
      type: Array as PropType<string[]>,
      default: () => ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['image-uploaded', 'image-removed'],
  setup(props, { emit }) {
    const { t } = useI18n();
    const store = useStore();
  const fileInput = ref<HTMLInputElement | null>(null);
  const selectedFiles = ref<File[]>([]);
    const isUploading = ref(false);
    const isRemoving = ref(false);

    const triggerFileInput = () => {
      fileInput.value?.click();
    };

    const onFileSelected = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const files = target.files ? Array.from(target.files) : [];

      if (!files.length) return;

      for (const file of files) {
        const validation = validateFile(file, {
          maxSize: props.maxSize,
          allowedTypes: props.allowedTypes,
        });

        if (!validation.isValid) {
          store.dispatch('notificator/error', t(validation.error!));
          return;
        }
      }

      selectedFiles.value = files;
    };

    const clearSelection = () => {
      selectedFiles.value = [];
      if (fileInput.value) {
        fileInput.value.value = '';
      }
    };

    const uploadImage = async () => {
      if ((!selectedFiles.value || selectedFiles.value.length === 0) || !props.entityId) return;

      try {
        isUploading.value = true;

        if (props.multiple) {
          await (props.service as any).uploadImages(props.entityId, selectedFiles.value);
        } else {
          await (props.service as any).uploadImage(props.entityId, selectedFiles.value[0]);
        }

        const updatedEntity = await store.dispatch(`${props.storeModule}/${props.fetchAction}`, props.entityId);

        store.dispatch('notificator/success', t('image-uploaded-successfully'));
        emit('image-uploaded', updatedEntity);

        clearSelection();
      } catch (error: any) {
        store.dispatch('notificator/errorResponse', error);
      } finally {
        isUploading.value = false;
      }
    };

    const removeImage = async () => {
      if (!props.entityId) return;

      try {
        isRemoving.value = true;
        
        await props.service.removeImage(props.entityId);
        
        await store.dispatch(`${props.storeModule}/${props.fetchAction}`, props.entityId);
        
        store.dispatch('notificator/success', t('image-removed-successfully'));
        emit('image-removed');
      } catch (error: any) {
        store.dispatch('notificator/errorResponse', error);
      } finally {
        isRemoving.value = false;
      }
    };

    return {
      fileInput,
      selectedFiles,
      isUploading,
      isRemoving,
      triggerFileInput,
      onFileSelected,
      clearSelection,
      uploadImage,
      removeImage,
      formatFileSize,
      t,
    };
  },
});
</script>

<style scoped lang="scss">
.image-upload {
  .image-section {
    .section-title {
      font-weight: 600;
      margin-bottom: 4px;
      color: #1a1a1a;
    }

    .section-description {
      font-size: 14px;
      color: #666;
      margin-bottom: 16px;
    }

    .current-image-container {
      margin-bottom: 16px;

      .image-preview {
        position: relative;
        display: inline-block;
        border-radius: 8px;
        overflow: hidden;
        border: 2px solid #e0e0e0;

        .uploaded-image {
          width: 100%;
          height: auto;
          max-width: 300px;
          max-height: 300px;
          object-fit: contain;
          display: block;
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s ease;

          .remove-btn {
            background-color: #f44336 !important;
            color: white !important;
          }
        }

        &:hover .image-overlay {
          opacity: 1;
        }
      }
    }

    .upload-section {
      .file-selected {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        background: #f5f5f5;
        border-radius: 8px;
        margin-bottom: 16px;

        .file-info {
          display: flex;
          align-items: center;
          gap: 8px;

          .file-name {
            font-weight: 500;
            color: #1a1a1a;
          }

          .file-size {
            font-size: 12px;
            color: #666;
          }
        }
      }

      .upload-buttons {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }
    }
  }
}
</style>