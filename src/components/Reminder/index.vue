<template>
  <div class="reminder-container">
    <div class="reminder-header">
      <h3>出行提醒</h3>
      <el-button type="primary" @click="showAddDialog">
        <el-icon>
          <Plus />
        </el-icon>
        创建提醒
      </el-button>
    </div>

    <div class="notification-permission" v-if="!notificationPermission">
      <el-alert title="开启浏览器通知" type="info" :closable="false" show-icon>
        <template #default>
          <p>开启浏览器通知后，您将收到桌面提醒</p>
          <el-button type="primary" size="small" @click="requestNotificationPermission">
            开启通知
          </el-button>
        </template>
      </el-alert>
    </div>

    <el-empty v-if="reminders.length === 0" description="暂无提醒">
      <el-button type="primary" @click="showAddDialog">创建第一个提醒</el-button>
    </el-empty>

    <div v-else class="reminder-list">
      <el-card v-for="reminder in reminders" :key="reminder.id" class="reminder-card"
        :class="{ 'reminder-sent': reminder.is_sent === 1 }">
        <div class="reminder-content">
          <div class="reminder-icon">
            <el-icon :size="32" :color="getTypeColor(reminder.reminder_type)">
              <component :is="getTypeIcon(reminder.reminder_type)" />
            </el-icon>
          </div>

          <div class="reminder-info">
            <h4 class="reminder-title">{{ reminder.title }}</h4>
            <div class="reminder-meta">
              <el-tag :type="getTypeTagType(reminder.reminder_type)" size="small">
                {{ reminder.reminder_type }}
              </el-tag>
              <span class="reminder-time">
                <el-icon>
                  <Clock />
                </el-icon>
                {{ formatDateTime(reminder.reminder_time) }}
              </span>
            </div>
            <p class="reminder-desc" v-if="reminder.description">
              {{ reminder.description }}
            </p>
          </div>

          <div class="reminder-status">
            <el-tag :type="reminder.is_sent === 1 ? 'success' : 'warning'">
              {{ reminder.is_sent === 1 ? '已发送' : '待发送' }}
            </el-tag>
          </div>
        </div>

        <div class="reminder-actions">
          <el-button text type="primary" @click="editReminder(reminder)">
            <el-icon>
              <Edit />
            </el-icon>
            编辑
          </el-button>
          <el-button text type="danger" @click="deleteReminder(reminder.id)">
            <el-icon>
              <Delete />
            </el-icon>
            删除
          </el-button>
          <el-button v-if="reminder.is_sent === 0" text type="success" @click="sendNow(reminder)">
            <el-icon>
              <Bell />
            </el-icon>
            立即发送
          </el-button>
        </div>
      </el-card>
    </div>

    <el-dialog v-model="dialogVisible" :title="editingReminder ? '编辑提醒' : '创建提醒'" width="500px">
      <el-form :model="reminderForm" :rules="rules" ref="reminderFormRef" label-width="100px">
        <el-form-item label="提醒标题" prop="title">
          <el-input v-model="reminderForm.title" placeholder="请输入提醒标题" />
        </el-form-item>

        <el-form-item label="提醒类型" prop="reminder_type">
          <el-select v-model="reminderForm.reminder_type" placeholder="请选择提醒类型">
            <el-option label="出发提醒" value="出发" />
            <el-option label="酒店入住" value="住宿" />
            <el-option label="景点游览" value="景点" />
            <el-option label="餐饮预订" value="餐饮" />
            <el-option label="交通提醒" value="交通" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>

        <el-form-item label="提醒时间" prop="reminder_time">
          <el-date-picker v-model="reminderForm.reminder_time" type="datetime" placeholder="选择提醒时间"
            style="width: 100%" />
        </el-form-item>

        <el-form-item label="关联行程">
          <el-select v-model="reminderForm.trip_id" placeholder="选择关联行程（可选）" clearable>
            <el-option v-for="trip in trips" :key="trip.id" :label="trip.trip_name" :value="trip.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="提醒描述">
          <el-input v-model="reminderForm.description" type="textarea" :rows="3" placeholder="请输入提醒描述（可选）" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitReminder" :loading="submitting">
          {{ editingReminder ? '保存' : '创建' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  Edit,
  Delete,
  Bell,
  Clock,
  Van,
  House,
  Location,
  ForkSpoon,
  MoreFilled
} from '@element-plus/icons-vue'
import {
  getReminderList,
  createReminder,
  updateReminder,
  deleteReminder as deleteReminderApi
} from '@/api/reminder'
import { getTripList } from '@/api/trip'
import { useUserStore } from '@/stores/UserStore'

const userStore = useUserStore()

const loading = ref(false)
const submitting = ref(false)
const reminders = ref([])
const trips = ref([])
const dialogVisible = ref(false)
const editingReminder = ref(null)
const reminderFormRef = ref(null)
const notificationPermission = ref(false)

const reminderForm = reactive({
  title: '',
  reminder_type: '',
  reminder_time: '',
  trip_id: '',
  description: ''
})

const rules = {
  title: [{ required: true, message: '请输入提醒标题', trigger: 'blur' }],
  reminder_type: [{ required: true, message: '请选择提醒类型', trigger: 'change' }],
  reminder_time: [{ required: true, message: '请选择提醒时间', trigger: 'change' }]
}

const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    ElMessage.warning('您的浏览器不支持通知功能')
    return
  }

  try {
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      notificationPermission.value = true
      ElMessage.success('通知权限已开启')

      new Notification('通知已开启', {
        body: '您将收到出行提醒通知',
        icon: '/favicon.ico'
      })
    } else {
      ElMessage.warning('通知权限被拒绝')
    }
  } catch (error) {
    console.error('请求通知权限失败:', error)
    ElMessage.error('请求通知权限失败')
  }
}

const checkNotificationPermission = () => {
  if ('Notification' in window) {
    notificationPermission.value = Notification.permission === 'granted'
  }
}

const sendNotification = (reminder) => {
  if (!notificationPermission.value) return

  new Notification(reminder.title, {
    body: `${reminder.reminder_type} - ${reminder.description || '该出发了！'}`,
    icon: '/favicon.ico',
    tag: reminder.id,
    requireInteraction: true
  })
}

const loadReminders = async () => {
  loading.value = true
  try {
    const res = await getReminderList({ user_id: userStore.id })
    if (res && res.status === 0) {
      reminders.value = res.data.reminders || []
    } else {
      reminders.value = []
    }
  } catch (error) {
    console.error('加载提醒列表失败:', error)
    ElMessage.error('加载提醒列表失败')
    reminders.value = []
  } finally {
    loading.value = false
  }
}

const loadTrips = async () => {
  try {
    const res = await getTripList({ user_id: userStore.id })
    if (res && res.status === 0) {
      trips.value = res.data.list || []
    } else {
      trips.value = []
    }
  } catch (error) {
    console.error('加载行程列表失败:', error)
    trips.value = []
  }
}

const showAddDialog = () => {
  editingReminder.value = null
  resetForm()
  dialogVisible.value = true
}

const editReminder = (reminder) => {
  editingReminder.value = reminder
  Object.assign(reminderForm, {
    title: reminder.title,
    reminder_type: reminder.reminder_type,
    reminder_time: reminder.reminder_time,
    trip_id: reminder.trip_id,
    description: reminder.description
  })
  dialogVisible.value = true
}

const submitReminder = async () => {
  if (!reminderFormRef.value) return

  await reminderFormRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        const data = {
          ...reminderForm,
          user_id: userStore.id
        }

        let res
        if (editingReminder.value) {
          res = await updateReminder(editingReminder.value.id, data)
        } else {
          res = await createReminder(data)
        }

        if (res && res.status === 0) {
          ElMessage.success(editingReminder.value ? '更新成功' : '创建成功')
          dialogVisible.value = false
          loadReminders()
        } else {
          ElMessage.error(res?.message || '操作失败')
        }
      } catch (error) {
        console.error('操作失败:', error)
        ElMessage.error('操作失败')
      } finally {
        submitting.value = false
      }
    }
  })
}

const deleteReminder = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这个提醒吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await deleteReminderApi(id)
    if (res.status === 0) {
      ElMessage.success('删除成功')
      loadReminders()
    } else {
      ElMessage.error(res.message)
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const sendNow = async (reminder) => {
  sendNotification(reminder)
  try {
    await updateReminder(reminder.id, { is_sent: 1 })
    ElMessage.success('提醒已发送')
    loadReminders()
  } catch (error) {
    console.error('更新提醒状态失败:', error)
    ElMessage.error('更新提醒状态失败')
  }
}

const resetForm = () => {
  Object.assign(reminderForm, {
    title: '',
    type: '',
    reminder_time: '',
    trip_id: '',
    description: ''
  })
  if (reminderFormRef.value) {
    reminderFormRef.value.resetFields()
  }
}

const formatDateTime = (datetime) => {
  if (!datetime) return ''
  const date = new Date(datetime)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getTypeIcon = (type) => {
  const iconMap = {
    '出发': Van,
    '住宿': House,
    '景点': Location,
    '餐饮': ForkSpoon,
    '交通': Van,
    '其他': MoreFilled
  }
  return iconMap[type] || MoreFilled
}

const getTypeColor = (type) => {
  const colorMap = {
    '出发': '#409eff',
    '住宿': '#67c23a',
    '景点': '#e6a23c',
    '餐饮': '#f56c6c',
    '交通': '#909399',
    '其他': '#909399'
  }
  return colorMap[type] || '#909399'
}

const getTypeTagType = (type) => {
  const typeMap = {
    '出发': 'primary',
    '住宿': 'success',
    '景点': 'warning',
    '餐饮': 'danger',
    '交通': 'info',
    '其他': 'info'
  }
  return typeMap[type] || 'info'
}

let checkInterval = null

const checkReminders = async () => {
  const now = new Date()
  for (const reminder of reminders.value) {
    if (reminder.is_sent === 0) {
      const reminderTime = new Date(reminder.reminder_time)
      if (reminderTime <= now) {
        sendNotification(reminder)
        try {
          await updateReminder(reminder.id, { is_sent: 1 })
          loadReminders()
        } catch (error) {
          console.error('更新提醒状态失败:', error)
        }
      }
    }
  }
}

onMounted(() => {
  checkNotificationPermission()
  loadReminders()
  loadTrips()

  checkInterval = setInterval(checkReminders, 60000)
})

onUnmounted(() => {
  if (checkInterval) {
    clearInterval(checkInterval)
  }
})
</script>

<style scoped lang="scss">
.reminder-container {
  .reminder-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h3 {
      margin: 0;
      font-size: 18px;
    }
  }

  .notification-permission {
    margin-bottom: 20px;

    .el-alert {
      p {
        margin: 8px 0;
      }
    }
  }

  .reminder-list {
    .reminder-card {
      margin-bottom: 16px;
      transition: all 0.3s;

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      &.reminder-sent {
        opacity: 0.7;
        background-color: #f5f7fa;
      }

      .reminder-content {
        display: flex;
        align-items: flex-start;
        gap: 16px;
        margin-bottom: 12px;

        .reminder-icon {
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background-color: #f0f2f5;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .reminder-info {
          flex: 1;

          .reminder-title {
            margin: 0 0 8px 0;
            font-size: 16px;
            color: #303133;
          }

          .reminder-meta {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 8px;

            .reminder-time {
              display: flex;
              align-items: center;
              gap: 4px;
              font-size: 14px;
              color: #909399;
            }
          }

          .reminder-desc {
            margin: 0;
            font-size: 14px;
            color: #606266;
            line-height: 1.6;
          }
        }

        .reminder-status {
          flex-shrink: 0;
        }
      }

      .reminder-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        padding-top: 12px;
        border-top: 1px solid #ebeef5;
      }
    }
  }
}
</style>
