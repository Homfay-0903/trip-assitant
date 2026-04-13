<template>
  <div class="travel-log-create">
    <el-page-header @back="goBack" content="发布游记" />

    <el-card class="form-card">
      <el-form :model="logForm" :rules="rules" ref="logFormRef" label-width="100px">
        <el-form-item label="游记标题" prop="title">
          <el-input v-model="logForm.title" placeholder="请输入游记标题" maxlength="50" show-word-limit />
        </el-form-item>

        <el-form-item label="关联行程" prop="trip_id">
          <el-select v-model="logForm.trip_id" placeholder="请选择关联行程" style="width: 100%">
            <el-option v-for="trip in trips" :key="trip.id" :label="trip.trip_name" :value="trip.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="目的地" prop="destination">
          <el-input v-model="logForm.destination" placeholder="请输入目的地" />
        </el-form-item>

        <el-form-item label="封面图片">
          <el-upload class="cover-uploader" :show-file-list="false" :before-upload="beforeCoverUpload"
            :http-request="handleCoverUpload">
            <img v-if="logForm.cover_image" :src="logForm.cover_image" class="cover-image" />
            <el-icon v-else class="cover-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item label="游记内容" prop="content">
          <el-input v-model="logForm.content" type="textarea" :rows="15" placeholder="请输入游记内容，分享你的旅行故事..."
            maxlength="5000" show-word-limit />
        </el-form-item>

        <el-form-item label="图片">
          <el-upload :file-list="fileList" list-type="picture-card" :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove" :before-upload="beforeUpload" :http-request="handleUpload" multiple>
            <el-icon>
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item label="标签">
          <el-tag v-for="tag in logForm.tags" :key="tag" closable @close="handleTagClose(tag)"
            style="margin-right: 8px">
            {{ tag }}
          </el-tag>
          <el-input v-if="tagInputVisible" ref="tagInputRef" v-model="tagInputValue" class="tag-input" size="small"
            @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
          <el-button v-else size="small" @click="showTagInput">
            + 添加标签
          </el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="submitting" size="large">
            发布游记
          </el-button>
          <el-button @click="saveDraft" :loading="savingDraft" size="large">
            保存草稿
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-dialog v-model="dialogVisible">
      <img :src="dialogImageUrl" alt="preview" style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { createTravelLog } from '@/api/travellog'
import { getTripList } from '@/api/trip'
import { useUserStore } from '@/stores/UserStore'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const submitting = ref(false)
const savingDraft = ref(false)
const logFormRef = ref(null)
const trips = ref([])
const fileList = ref([])
const dialogVisible = ref(false)
const dialogImageUrl = ref('')
const tagInputVisible = ref(false)
const tagInputValue = ref('')
const tagInputRef = ref(null)

const logForm = reactive({
  title: '',
  trip_id: route.query.trip_id || '',
  destination: '',
  cover_image: '',
  content: '',
  images: [],
  tags: []
})

const rules = {
  title: [{ required: true, message: '请输入游记标题', trigger: 'blur' }],
  destination: [{ required: true, message: '请输入目的地', trigger: 'blur' }],
  content: [{ required: true, message: '请输入游记内容', trigger: 'blur' }]
}

const loadTrips = async () => {
  if (!userStore.id) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }

  try {
    const res = await getTripList({ user_id: userStore.id })
    if (res && res.status === 0) {
      trips.value = res.data.list || []
    } else {
      trips.value = []
    }
  } catch (error) {
    console.error('加载行程列表失败:', error)
    ElMessage.error('加载行程列表失败，请稍后重试')
    trips.value = []
  }
}

const beforeCoverUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB!')
    return false
  }
  return true
}

const handleCoverUpload = async (options) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    logForm.cover_image = e.target.result
  }
  reader.readAsDataURL(options.file)
}

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB!')
    return false
  }
  return true
}

const handleUpload = async (options) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    logForm.images.push(e.target.result)
    fileList.value.push({
      name: options.file.name,
      url: e.target.result
    })
  }
  reader.readAsDataURL(options.file)
}

const handleRemove = (file) => {
  const index = fileList.value.findIndex(f => f.uid === file.uid)
  if (index !== -1) {
    fileList.value.splice(index, 1)
    logForm.images.splice(index, 1)
  }
}

const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url
  dialogVisible.value = true
}

const showTagInput = () => {
  tagInputVisible.value = true
  nextTick(() => {
    tagInputRef.value?.input?.focus()
  })
}

const handleInputConfirm = () => {
  if (tagInputValue.value) {
    if (!logForm.tags.includes(tagInputValue.value)) {
      logForm.tags.push(tagInputValue.value)
    } else {
      ElMessage.warning('标签已存在')
    }
  }
  tagInputVisible.value = false
  tagInputValue.value = ''
}

const handleTagClose = (tag) => {
  logForm.tags.splice(logForm.tags.indexOf(tag), 1)
}

const submitForm = async () => {
  if (!logFormRef.value) return

  if (!userStore.id) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }

  await logFormRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        const data = {
          ...logForm,
          user_id: userStore.id,
          images: JSON.stringify(logForm.images),
          tags: JSON.stringify(logForm.tags)
        }

        const res = await createTravelLog(data)
        if (res && res.status === 0) {
          ElMessage.success('发布成功')
          router.push('/travel-log/list')
        } else {
          ElMessage.error(res?.message || '发布失败')
        }
      } catch (error) {
        console.error('发布失败:', error)
        ElMessage.error('发布失败，请稍后重试')
      } finally {
        submitting.value = false
      }
    }
  })
}

const saveDraft = async () => {
  savingDraft.value = true
  try {
    ElMessage.success('草稿已保存')
  } finally {
    savingDraft.value = false
  }
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  loadTrips()
})
</script>

<style scoped lang="scss">
.travel-log-create {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;

  .form-card {
    margin-top: 20px;

    .cover-uploader {
      :deep(.el-upload) {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: border-color 0.3s;

        &:hover {
          border-color: #409eff;
        }
      }

      .cover-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        text-align: center;
        line-height: 178px;
      }

      .cover-image {
        width: 178px;
        height: 178px;
        display: block;
        object-fit: cover;
      }
    }

    .tag-input {
      width: 100px;
      margin-right: 8px;
      vertical-align: bottom;
    }
  }
}
</style>
