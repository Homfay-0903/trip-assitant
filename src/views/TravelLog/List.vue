<template>
  <div class="travel-log-list">
    <div class="header">
      <h2>游记广场</h2>
      <el-button type="primary" @click="createLog">
        <el-icon>
          <Edit />
        </el-icon>
        发布游记
      </el-button>
    </div>

    <div class="filter-bar">
      <el-input v-model="searchKeyword" placeholder="搜索游记标题或目的地" class="search-input" @input="handleSearch">
        <template #prefix>
          <el-icon>
            <Search />
          </el-icon>
        </template>
      </el-input>

      <el-select v-model="sortType" placeholder="排序方式" @change="handleSort">
        <el-option label="最新发布" value="latest" />
        <el-option label="最多点赞" value="popular" />
      </el-select>
    </div>

    <div class="waterfall-container" v-loading="loading">
      <el-empty v-if="filteredLogs.length === 0" description="暂无游记数据" />

      <div class="waterfall">
        <el-card v-for="log in filteredLogs" :key="log.id" class="log-card" :body-style="{ padding: '0px' }"
          @click="goToDetail(log.id)">
          <div class="log-cover">
            <img :src="log.cover_image || defaultCover" :alt="log.title" />
            <div class="log-overlay">
              <div class="like-count">
                <el-icon>
                  <Star />
                </el-icon>
                {{ log.likes_count || 0 }}
              </div>
            </div>
          </div>

          <div class="log-content">
            <h3 class="log-title">{{ log.title }}</h3>

            <div class="log-meta">
              <div class="meta-item">
                <el-icon>
                  <Location />
                </el-icon>
                <span>{{ log.destination }}</span>
              </div>

              <div class="meta-item">
                <el-icon>
                  <Calendar />
                </el-icon>
                <span>{{ formatDate(log.created_at) }}</span>
              </div>
            </div>

            <div class="log-author">
              <el-avatar :size="32" :src="log.author_avatar || defaultAvatar" />
              <span class="author-name">{{ log.author_name }}</span>
            </div>

            <div class="log-tags">
              <el-tag v-for="(tag, index) in parseTags(log.tags)" :key="index" size="small" type="info">
                {{ tag }}
              </el-tag>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <el-dialog v-model="detailVisible" :title="currentLog?.title" width="800px" class="log-detail-dialog">
      <div v-if="currentLog" class="log-detail">
        <div class="detail-header">
          <div class="author-info">
            <el-avatar :size="40" :src="currentLog.author_avatar || defaultAvatar" />
            <div class="author-meta">
              <div class="author-name">{{ currentLog.author_name }}</div>
              <div class="publish-time">{{ formatDate(currentLog.created_at) }}</div>
            </div>
          </div>

          <div class="destination">
            <el-icon>
              <Location />
            </el-icon>
            {{ currentLog.destination }}
          </div>
        </div>

        <div class="detail-cover" v-if="currentLog.cover_image">
          <img :src="currentLog.cover_image" alt="cover" />
        </div>

        <div class="detail-content">
          {{ currentLog.content }}
        </div>

        <div class="detail-images" v-if="parseImages(currentLog.images).length > 0">
          <el-image v-for="(image, index) in parseImages(currentLog.images)" :key="index" :src="image"
            :preview-src-list="parseImages(currentLog.images)" fit="cover" class="detail-image" />
        </div>

        <div class="detail-tags">
          <el-tag v-for="(tag, index) in parseTags(currentLog.tags)" :key="index">
            {{ tag }}
          </el-tag>
        </div>

        <div class="detail-actions">
          <el-button :type="currentLog.is_liked ? 'danger' : 'default'" @click="toggleLike(currentLog.id)">
            <el-icon>
              <Star />
            </el-icon>
            {{ currentLog.is_liked ? '取消点赞' : '点赞' }} ({{ currentLog.likes_count || 0 }})
          </el-button>
          <el-button @click="shareLog(currentLog.id)">
            <el-icon>
              <Share />
            </el-icon>
            分享
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Edit,
  Search,
  Location,
  Calendar,
  Star,
  Share
} from '@element-plus/icons-vue'
import { getTravelLogList, getTravelLogDetail, likeTravelLog } from '@/api/travellog'

const router = useRouter()

const loading = ref(false)
const logs = ref([])
const searchKeyword = ref('')
const sortType = ref('latest')
const detailVisible = ref(false)
const currentLog = ref(null)

const defaultCover = 'https://picsum.photos/400/300?random=10'
const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

const filteredLogs = computed(() => {
  let result = logs.value

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(log =>
      log.title.toLowerCase().includes(keyword)
      //log.destination.toLowerCase().includes(keyword)
    )
  }

  if (sortType.value === 'popular') {
    result = [...result].sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0))
  } else {
    result = [...result].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }

  return result
})

const loadLogs = async () => {
  loading.value = true
  try {
    const res = await getTravelLogList()
    console.log(res)
    if (res && res.status === 0) {
      logs.value = res.data.list || []
    } else {
      logs.value = []
    }
  } catch (error) {
    console.error('加载游记列表失败:', error)
    ElMessage.error('加载游记列表失败，请稍后重试')
    logs.value = []
  } finally {
    loading.value = false
  }
}

const createLog = () => {
  router.push('/travel-log/create')
}

const goToDetail = (id) => {
  router.push(`/travel-log/detail/${id}`)
}

const toggleLike = async (id) => {
  try {
    const res = await likeTravelLog(id)
    if (res && res.status === 0) {
      if (currentLog.value) {
        currentLog.value.is_liked = !currentLog.value.is_liked
        currentLog.value.likes_count = res.data.likes_count
      }
      ElMessage.success(res.message)
    } else {
      ElMessage.error(res?.message || '操作失败')
    }
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败，请稍后重试')
  }
}

const shareLog = (id) => {
  ElMessage.success('分享功能开发中')
}

const handleSearch = () => {
}

const handleSort = () => {
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN')
}

const parseTags = (tags) => {
  if (!tags) return []
  try {
    return JSON.parse(tags)
  } catch {
    return []
  }
}

const parseImages = (images) => {
  if (!images) return []
  try {
    return JSON.parse(images)
  } catch {
    return []
  }
}

onMounted(() => {
  loadLogs()
})
</script>

<style scoped lang="scss">
.travel-log-list {
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

  .waterfall-container {
    .waterfall {
      column-count: 3;
      column-gap: 20px;

      @media (max-width: 1200px) {
        column-count: 2;
      }

      @media (max-width: 768px) {
        column-count: 1;
      }

      .log-card {
        break-inside: avoid;
        margin-bottom: 20px;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .log-cover {
          position: relative;
          overflow: hidden;

          img {
            width: 100%;
            display: block;
            object-fit: cover;
          }

          .log-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
            opacity: 0;
            transition: opacity 0.3s;
            display: flex;
            align-items: flex-end;
            padding: 12px;

            .like-count {
              color: white;
              display: flex;
              align-items: center;
              gap: 4px;
            }
          }

          &:hover .log-overlay {
            opacity: 1;
          }
        }

        .log-content {
          padding: 16px;

          .log-title {
            margin: 0 0 12px 0;
            font-size: 16px;
            color: #303133;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }

          .log-meta {
            margin-bottom: 12px;

            .meta-item {
              display: flex;
              align-items: center;
              margin-bottom: 6px;
              font-size: 13px;
              color: #909399;

              .el-icon {
                margin-right: 6px;
                font-size: 14px;
              }
            }
          }

          .log-author {
            display: flex;
            align-items: center;
            margin-bottom: 12px;

            .author-name {
              margin-left: 8px;
              font-size: 14px;
              color: #606266;
            }
          }

          .log-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
          }
        }
      }
    }
  }

  .log-detail-dialog {
    .log-detail {
      .detail-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;

        .author-info {
          display: flex;
          align-items: center;

          .author-meta {
            margin-left: 12px;

            .author-name {
              font-size: 16px;
              font-weight: 600;
              color: #303133;
            }

            .publish-time {
              font-size: 12px;
              color: #909399;
              margin-top: 4px;
            }
          }
        }

        .destination {
          display: flex;
          align-items: center;
          color: #606266;
          font-size: 14px;

          .el-icon {
            margin-right: 6px;
          }
        }
      }

      .detail-cover {
        margin-bottom: 20px;

        img {
          width: 100%;
          border-radius: 8px;
        }
      }

      .detail-content {
        line-height: 1.8;
        color: #303133;
        margin-bottom: 20px;
        white-space: pre-wrap;
      }

      .detail-images {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 12px;
        margin-bottom: 20px;

        .detail-image {
          width: 100%;
          height: 200px;
          border-radius: 8px;
          cursor: pointer;
        }
      }

      .detail-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 20px;
      }

      .detail-actions {
        display: flex;
        gap: 12px;
        padding-top: 20px;
        border-top: 1px solid #ebeef5;
      }
    }
  }
}
</style>
