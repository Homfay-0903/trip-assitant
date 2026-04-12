<template>
  <div class="trip-detail-container" v-loading="loading">
    <el-page-header @back="goBack" content="行程详情" />

    <div v-if="tripDetail" class="detail-content">
      <el-card class="info-card">
        <template #header>
          <div class="card-header">
            <h3>{{ tripDetail.trip_name }}</h3>
            <div class="header-actions">
              <el-button type="primary" @click="editTrip">
                <el-icon>
                  <Edit />
                </el-icon>
                编辑
              </el-button>
              <el-button type="danger" @click="handleDelete">
                <el-icon>
                  <Delete />
                </el-icon>
                删除
              </el-button>
              <el-button type="success" @click="handleShare">
                <el-icon>
                  <Share />
                </el-icon>
                分享
              </el-button>
            </div>
          </div>
        </template>

        <el-descriptions :column="2" border>
          <el-descriptions-item label="出发地">
            <el-icon>
              <Location />
            </el-icon>
            {{ tripDetail.origin }}
          </el-descriptions-item>
          <el-descriptions-item label="目的地">
            <el-icon>
              <Location />
            </el-icon>
            {{ tripDetail.destination }}
          </el-descriptions-item>
          <el-descriptions-item label="开始日期">
            <el-icon>
              <Calendar />
            </el-icon>
            {{ formatDate(tripDetail.start_date) }}
          </el-descriptions-item>
          <el-descriptions-item label="结束日期">
            <el-icon>
              <Calendar />
            </el-icon>
            {{ formatDate(tripDetail.end_date) }}
          </el-descriptions-item>
          <el-descriptions-item label="出行人数">
            <el-icon>
              <User />
            </el-icon>
            {{ tripDetail.travelers }}人
          </el-descriptions-item>
          <el-descriptions-item label="预算">
            <el-icon>
              <Money />
            </el-icon>
            ¥{{ tripDetail.budget }}
          </el-descriptions-item>
          <el-descriptions-item label="交通方式">
            <el-icon>
              <Van />
            </el-icon>
            {{ tripDetail.transport }}
          </el-descriptions-item>
          <el-descriptions-item label="行程状态">
            <el-tag :type="getStatusType(tripDetail.status)">
              {{ tripDetail.status }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <el-tabs v-model="activeTab" class="detail-tabs">
        <el-tab-pane label="日程安排" name="schedule">
          <ScheduleTimeline :trip-id="tripId" />
        </el-tab-pane>

        <el-tab-pane label="预算管理" name="budget">
          <BudgetManager :trip-id="tripId" :budget="tripDetail.budget" />
        </el-tab-pane>

        <el-tab-pane label="游记" name="travel-log">
          <div class="travel-log-section">
            <el-button type="primary" @click="createTravelLog">
              <el-icon>
                <Edit />
              </el-icon>
              发布游记
            </el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Edit,
  Delete,
  Share,
  Location,
  Calendar,
  User,
  Money,
  Van
} from '@element-plus/icons-vue'
import { getTripDetail, deleteTrip } from '@/api/trip'
import ScheduleTimeline from '@/components/ScheduleTimeline/index.vue'
import BudgetManager from '@/components/BudgetManager/index.vue'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const tripId = ref(route.params.id)
const tripDetail = ref(null)
const activeTab = ref('schedule')

const loadTripDetail = async () => {
  loading.value = true
  try {
    const res = await getTripDetail(tripId.value)
    if (res && res.status === 0) {
      tripDetail.value = res.data.trip
    } else {
      ElMessage.error(res?.message || '加载行程详情失败')
    }
  } catch (error) {
    console.error('加载行程详情失败:', error)
    ElMessage.error('加载行程详情失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.back()
}

const editTrip = () => {
  router.push(`/my-trips?edit=${tripId.value}`)
}

const handleDelete = async () => {
  try {
    await ElMessageBox.confirm('确定要删除这个行程吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await deleteTrip(tripId.value)
    if (res && res.status === 0) {
      ElMessage.success('删除成功')
      router.push('/my-trips')
    } else {
      ElMessage.error(res?.message || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败，请稍后重试')
    }
  }
}

const handleShare = async () => {
  ElMessage.success('分享功能开发中')
}

const createTravelLog = () => {
  router.push({
    path: '/travel-log/create',
    query: { trip_id: tripId.value }
  })
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN')
}

const getStatusType = (status) => {
  const typeMap = {
    '进行中': 'success',
    '已完成': 'primary',
    '已取消': 'danger'
  }
  return typeMap[status] || 'info'
}

onMounted(() => {
  loadTripDetail()
})
</script>

<style scoped lang="scss">
.trip-detail-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  .detail-content {
    margin-top: 20px;

    .info-card {
      margin-bottom: 20px;

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        h3 {
          margin: 0;
          font-size: 20px;
        }

        .header-actions {
          display: flex;
          gap: 10px;
        }
      }
    }

    .detail-tabs {
      margin-top: 20px;
    }

    .travel-log-section {
      padding: 20px;
      text-align: center;
    }
  }
}
</style>
