<template>
  <div class="my-trips-container">
    <div class="header">
      <el-page-header @back="goBack">
        <template #content>
          <h2>我的行程</h2>
        </template>
      </el-page-header>
      <el-button type="primary" @click="showCreateDialog">
        <el-icon>
          <Plus />
        </el-icon>
        创建新行程
      </el-button>
    </div>

    <div class="filter-bar">
      <el-input v-model="searchKeyword" placeholder="搜索行程名称或目的地" class="search-input" @input="handleSearch">
        <template #prefix>
          <el-icon>
            <Search />
          </el-icon>
        </template>
      </el-input>

      <el-select v-model="statusFilter" placeholder="行程状态" @change="handleFilter">
        <el-option label="全部" value="" />
        <el-option label="规划中" value="planning" />
        <el-option label="进行中" value="ongoing" />
        <el-option label="已完成" value="completed" />
        <el-option label="已取消" value="cancelled" />
      </el-select>
    </div>

    <div class="trips-grid" v-loading="loading">
      <el-empty v-if="filteredTrips.length === 0" description="暂无行程数据" />

      <el-card v-for="trip in filteredTrips" :key="trip.id" class="trip-card" :body-style="{ padding: '0px' }"
        @click="goToDetail(trip.id)">
        <!-- 图片
        <div class="trip-image">
           
          <img :src="getTripImage(trip.destination)" :alt="trip.trip_name" />
          
          <div class="trip-status" :class="getStatusClass(trip.status)">
            {{ getStatusText(trip.status) }}
          </div>
        </div>
        -->

        <div class="trip-content">
          <h3 class="trip-title">{{ trip.trip_name }}</h3>

          <div class="trip-info">
            <div class="info-item">
              <div class="trip-status" :class="getStatusClass(trip.status)">
                {{ getStatusText(trip.status) }}
              </div>
            </div>

            <div class="info-item">
              <el-icon>
                <Location />
              </el-icon>
              <span>{{ trip.destination }}</span>
            </div>

            <div class="info-item">
              <el-icon>
                <Calendar />
              </el-icon>
              <span>{{ formatDate(trip.start_date) }} - {{ formatDate(trip.end_date) }}</span>
            </div>

            <div class="info-item">
              <el-icon>
                <User />
              </el-icon>
              <span>{{ trip.travelers }}人</span>
            </div>

            <div class="info-item">
              <el-icon>
                <Money />
              </el-icon>
              <span>预算: ¥{{ trip.budget }}</span>
            </div>
          </div>

          <div class="trip-actions">
            <el-button text type="primary" @click.stop="editTrip(trip)">
              <el-icon>
                <Edit />
              </el-icon>
              编辑
            </el-button>
            <el-button text type="danger" @click.stop="deleteTrip(trip.id)">
              <el-icon>
                <Delete />
              </el-icon>
              删除
            </el-button>
            <el-button text type="success" @click.stop="shareTrip(trip.id)">
              <el-icon>
                <Share />
              </el-icon>
              分享
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <TripEditDialog v-model:visible="editDialogVisible" :trip="editingTrip" @success="loadTrips" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  Search,
  Location,
  Calendar,
  User,
  Money,
  Edit,
  Delete,
  Share
} from '@element-plus/icons-vue'
import { getTripList, deleteTrip as deleteTripApi } from '@/api/trip'
import { useUserStore } from '@/stores/UserStore'
import TripEditDialog from '@/components/TripEditDialog/index.vue'

const router = useRouter()
const userStore = useUserStore()

const STATUS_MAP = {
  planning: '规划中',
  ongoing: '进行中',
  completed: '已完成',
  cancelled: '已取消'
}

const STATUS_CLASS_MAP = {
  planning: 'status-planning',
  ongoing: 'status-ongoing',
  completed: 'status-completed',
  cancelled: 'status-cancelled'
}

const loading = ref(false)
const trips = ref([])
const searchKeyword = ref('')
const statusFilter = ref('')
const editDialogVisible = ref(false)
const editingTrip = ref(null)

const filteredTrips = computed(() => {
  let result = trips.value

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(trip =>
      trip.trip_name.toLowerCase().includes(keyword) ||
      trip.destination.toLowerCase().includes(keyword)
    )
  }

  if (statusFilter.value) {
    result = result.filter(trip => trip.status === statusFilter.value)
  }

  return result
})

const goBack = () => {
  router.push('/travel_plan')
}

const loadTrips = async () => {
  if (!userStore.id) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }

  loading.value = true
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
  } finally {
    loading.value = false
  }
}

const showCreateDialog = () => {
  editingTrip.value = null
  editDialogVisible.value = true
}

const editTrip = (trip) => {
  editingTrip.value = trip
  editDialogVisible.value = true
}

const deleteTrip = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这个行程吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await deleteTripApi(id)
    if (res.status === 0) {
      ElMessage.success('删除成功')
      loadTrips()
    } else {
      ElMessage.error(res.message)
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const shareTrip = async (id) => {
  try {
    const res = await shareTrip(id)
    if (res.status === 0) {
      ElMessage.success('分享链接已复制到剪贴板')
    }
  } catch (error) {
    ElMessage.error('分享失败')
  }
}

const goToDetail = (id) => {
  router.push(`/trip/detail/${id}`)
}

const handleSearch = () => {
}

const handleFilter = () => {
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN')
}

//const getTripImage = (destination) => {
//  const images = {
//    '北京': 'https://picsum.photos/400/200?random=1',
//    '上海': 'https://picsum.photos/400/200?random=2',
//    '广州': 'https://picsum.photos/400/200?random=3',
//    '深圳': 'https://picsum.photos/400/200?random=4'
//  }
//  return images[destination] || 'https://picsum.photos/400/200?random=5'
//}

const getStatusClass = (status) => {
  return STATUS_CLASS_MAP[status] || ''
}

const getStatusText = (status) => {
  return STATUS_MAP[status] || status
}

onMounted(() => {
  loadTrips()
})
</script>

<style scoped lang="scss">
.my-trips-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2 {
      margin: 0;
      font-size: 24px;
      color: #303133;
    }
  }

  .filter-bar {
    display: flex;
    gap: 16px;
    margin-bottom: 20px;

    .search-input {
      width: 300px;
    }
  }

  .trips-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;

    .trip-card {
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .trip-image {
        position: relative;
        height: 180px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .trip-status {
          position: absolute;
          top: 10px;
          right: 10px;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          color: white;
          font-weight: 500;

          &.status-planning {
            background-color: #e6a23c;
          }

          &.status-ongoing {
            background-color: #67c23a;
          }

          &.status-completed {
            background-color: #409eff;
          }

          &.status-cancelled {
            background-color: #f56c6c;
          }
        }
      }

      .trip-content {
        padding: 16px;

        .trip-title {
          margin: 0 0 12px 0;
          font-size: 18px;
          color: #303133;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .trip-info {
          margin-bottom: 12px;

          .info-item {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            font-size: 14px;
            color: #606266;

            .el-icon {
              margin-right: 8px;
              color: #909399;
            }

            .trip-status {
              padding: 4px 12px;
              border-radius: 12px;
              font-size: 12px;
              color: white;
              font-weight: 500;

              &.status-planning {
                background-color: #e6a23c;
              }

              &.status-ongoing {
                background-color: #67c23a;
              }

              &.status-completed {
                background-color: #409eff;
              }

              &.status-cancelled {
                background-color: #f56c6c;
              }
            }
          }
        }

        .trip-actions {
          display: flex;
          justify-content: space-around;
          border-top: 1px solid #ebeef5;
          padding-top: 12px;
        }
      }
    }
  }
}
</style>
