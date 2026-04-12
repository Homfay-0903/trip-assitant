<template>
  <div class="my-favorites">
    <div class="header">
      <h2>我的收藏</h2>
    </div>

    <div class="filter-bar">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索景点名称"
        class="search-input"
        @input="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <el-select v-model="cityFilter" placeholder="按城市筛选" clearable @change="handleFilter">
        <el-option
          v-for="city in cities"
          :key="city"
          :label="city"
          :value="city"
        />
      </el-select>
    </div>

    <div class="favorites-grid" v-loading="loading">
      <el-empty v-if="filteredFavorites.length === 0" description="暂无收藏数据" />
      
      <el-card
        v-for="favorite in filteredFavorites"
        :key="favorite.id"
        class="favorite-card"
        :body-style="{ padding: '0px' }"
      >
        <div class="favorite-image">
          <img :src="getPoiImage(favorite.poi_name)" :alt="favorite.poi_name" />
          <div class="poi-type-tag">
            <el-tag size="small" type="success">{{ favorite.poi_type }}</el-tag>
          </div>
        </div>
        
        <div class="favorite-content">
          <h3 class="poi-name">{{ favorite.poi_name }}</h3>
          
          <div class="poi-info">
            <div class="info-item">
              <el-icon><Location /></el-icon>
              <span>{{ favorite.poi_address }}</span>
            </div>
            
            <div class="info-item">
              <el-icon><MapLocation /></el-icon>
              <span>{{ favorite.city }}</span>
            </div>
            
            <div class="info-item">
              <el-icon><Clock /></el-icon>
              <span>收藏于 {{ formatDate(favorite.created_at) }}</span>
            </div>
          </div>

          <div class="favorite-actions">
            <el-button type="primary" size="small" @click="addToTrip(favorite)">
              <el-icon><Plus /></el-icon>
              添加到行程
            </el-button>
            <el-button type="danger" size="small" @click="removeFavorite(favorite.id)">
              <el-icon><Delete /></el-icon>
              取消收藏
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <el-dialog
      v-model="tripDialogVisible"
      title="添加到行程"
      width="500px"
    >
      <el-form :model="tripForm" label-width="80px">
        <el-form-item label="选择行程">
          <el-select v-model="tripForm.trip_id" placeholder="请选择行程" style="width: 100%">
            <el-option
              v-for="trip in trips"
              :key="trip.id"
              :label="trip.trip_name"
              :value="trip.id"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="tripDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAddToTrip">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search,
  Location,
  MapLocation,
  Clock,
  Plus,
  Delete
} from '@element-plus/icons-vue'
import { getFavoriteList, deleteFavorite } from '@/api/favorite'
import { getTripList } from '@/api/trip'
import { useUserStore } from '@/stores/UserStore'

const userStore = useUserStore()

const loading = ref(false)
const favorites = ref([])
const trips = ref([])
const searchKeyword = ref('')
const cityFilter = ref('')
const tripDialogVisible = ref(false)
const currentFavorite = ref(null)
const tripForm = reactive({
  trip_id: ''
})

const cities = computed(() => {
  const citySet = new Set(favorites.value.map(f => f.city))
  return Array.from(citySet)
})

const filteredFavorites = computed(() => {
  let result = favorites.value

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(favorite => 
      favorite.poi_name.toLowerCase().includes(keyword)
    )
  }

  if (cityFilter.value) {
    result = result.filter(favorite => favorite.city === cityFilter.value)
  }

  return result
})

const loadFavorites = async () => {
  if (!userStore.id) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }

  loading.value = true
  try {
    const res = await getFavoriteList({ user_id: userStore.id })
    if (res && res.status === 0) {
      favorites.value = res.data.favorites || []
    } else {
      favorites.value = []
    }
  } catch (error) {
    console.error('加载收藏列表失败:', error)
    ElMessage.error('加载收藏列表失败，请稍后重试')
    favorites.value = []
  } finally {
    loading.value = false
  }
}

const loadTrips = async () => {
  if (!userStore.id) {
    return
  }

  try {
    const res = await getTripList({ user_id: userStore.id })
    if (res && res.status === 0) {
      trips.value = res.data.trips || []
    } else {
      trips.value = []
    }
  } catch (error) {
    console.error('加载行程列表失败:', error)
    trips.value = []
  }
}

const addToTrip = (favorite) => {
  currentFavorite.value = favorite
  tripForm.trip_id = ''
  tripDialogVisible.value = true
}

const confirmAddToTrip = () => {
  if (!tripForm.trip_id) {
    ElMessage.warning('请选择行程')
    return
  }
  
  ElMessage.success('已添加到行程')
  tripDialogVisible.value = false
}

const removeFavorite = async (id) => {
  try {
    await ElMessageBox.confirm('确定要取消收藏吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await deleteFavorite(id)
    if (res.status === 0) {
      ElMessage.success('取消收藏成功')
      loadFavorites()
    } else {
      ElMessage.error(res.message)
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

const handleSearch = () => {
}

const handleFilter = () => {
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN')
}

const getPoiImage = (poiName) => {
  return `https://picsum.photos/400/250?random=${poiName.length}`
}

onMounted(() => {
  loadFavorites()
  loadTrips()
})
</script>

<style scoped lang="scss">
.my-favorites {
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

  .favorites-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;

    .favorite-card {
      transition: all 0.3s;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .favorite-image {
        position: relative;
        height: 200px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .poi-type-tag {
          position: absolute;
          top: 10px;
          right: 10px;
        }
      }

      .favorite-content {
        padding: 16px;

        .poi-name {
          margin: 0 0 12px 0;
          font-size: 18px;
          color: #303133;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .poi-info {
          margin-bottom: 16px;

          .info-item {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            font-size: 14px;
            color: #606266;

            .el-icon {
              margin-right: 8px;
              color: #909399;
              flex-shrink: 0;
            }

            span {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }

        .favorite-actions {
          display: flex;
          gap: 10px;
        }
      }
    }
  }
}
</style>
