<template>
  <div class="travel-log-detail" v-loading="loading">
    <el-page-header @back="goBack" content="游记详情" />

    <div v-if="logDetail" class="detail-content">
      <el-card class="main-card">
        <div class="log-header">
          <h1 class="log-title">{{ logDetail.title }}</h1>

          <div class="log-meta">
            <div class="author-info">
              <el-avatar :size="48" :src="logDetail.author_avatar || defaultAvatar" />
              <div class="author-details">
                <div class="author-name">{{ logDetail.author_name }}</div>
                <div class="publish-time">
                  <el-icon>
                    <Clock />
                  </el-icon>
                  {{ formatDateTime(logDetail.created_at) }}
                </div>
              </div>
            </div>

            <div class="log-stats">
              <div class="stat-item">
                <el-icon>
                  <Location />
                </el-icon>
                <span>{{ logDetail.destination }}</span>
              </div>
              <div class="stat-item">
                <el-icon>
                  <Star />
                </el-icon>
                <span>{{ logDetail.likes_count || 0 }} 点赞</span>
              </div>
            </div>
          </div>
        </div>

        <div class="log-cover" v-if="logDetail.cover_image">
          <el-image :src="logDetail.cover_image" :preview-src-list="[logDetail.cover_image]" fit="cover"
            class="cover-image" />
        </div>

        <div class="log-content">
          <div class="content-text">
            {{ logDetail.content }}
          </div>

          <div class="content-images" v-if="images.length > 0">
            <el-divider>游记图片</el-divider>
            <div class="image-grid">
              <el-image v-for="(image, index) in images" :key="index" :src="image" :preview-src-list="images"
                :initial-index="index" fit="cover" class="content-image" />
            </div>
          </div>

          <div class="content-tags" v-if="tags.length > 0">
            <el-divider>标签</el-divider>
            <div class="tag-list">
              <el-tag v-for="(tag, index) in tags" :key="index" size="large" class="tag-item">
                {{ tag }}
              </el-tag>
            </div>
          </div>
        </div>

        <div class="log-actions">
          <el-button :type="logDetail.is_liked ? 'danger' : 'default'" size="large" @click="toggleLike">
            <el-icon>
              <Star />
            </el-icon>
            {{ logDetail.is_liked ? '取消点赞' : '点赞' }}
          </el-button>
          <el-button size="large" @click="shareLog">
            <el-icon>
              <Share />
            </el-icon>
            分享
          </el-button>
          <el-button v-if="isAuthor" type="danger" size="large" @click="deleteLog">
            <el-icon>
              <Delete />
            </el-icon>
            删除
          </el-button>
        </div>
      </el-card>

      <el-card class="related-card">
        <template #header>
          <span>相关推荐</span>
        </template>
        <div class="related-list">
          <el-empty v-if="relatedLogs.length === 0" description="暂无相关推荐" />
          <div v-for="related in relatedLogs" :key="related.id" class="related-item" @click="viewRelated(related.id)">
            <el-image :src="related.cover_image || defaultCover" fit="cover" class="related-cover" />
            <div class="related-info">
              <h4>{{ related.title }}</h4>
              <p>{{ related.destination }}</p>
              <div class="related-stats">
                <span><el-icon>
                    <Star />
                  </el-icon> {{ related.likes_count || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Clock,
  Location,
  Star,
  Share,
  Delete
} from '@element-plus/icons-vue'
import {
  getTravelLogDetail,
  likeTravelLog,
  deleteTravelLog,
  getTravelLogList
} from '@/api/travellog'
import { useUserStore } from '@/stores/UserStore'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const logDetail = ref(null)
const relatedLogs = ref([])

const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
const defaultCover = 'https://picsum.photos/400/300?random=10'

const images = computed(() => {
  if (!logDetail.value?.images) return []
  try {
    return JSON.parse(logDetail.value.images)
  } catch {
    return []
  }
})

const tags = computed(() => {
  if (!logDetail.value?.tags) return []
  try {
    return JSON.parse(logDetail.value.tags)
  } catch {
    return []
  }
})

const isAuthor = computed(() => {
  return logDetail.value?.user_id === userStore.id
})

const loadLogDetail = async () => {
  loading.value = true
  try {
    const res = await getTravelLogDetail(route.params.id)
    if (res && res.data && res.data.status === 0) {
      logDetail.value = res.data.data.log
      loadRelatedLogs()
    } else {
      ElMessage.error(res?.data?.message || '加载游记详情失败')
      router.push('/travel-log/list')
    }
  } catch (error) {
    console.error('加载游记详情失败:', error)
    ElMessage.error('加载游记详情失败，请稍后重试')
    router.push('/travel-log/list')
  } finally {
    loading.value = false
  }
}

const loadRelatedLogs = async () => {
  try {
    const res = await getTravelLogList()
    if (res && res.data && res.data.status === 0) {
      relatedLogs.value = (res.data.data.logs || [])
        .filter(log =>
          log.id !== logDetail.value.id &&
          log.destination === logDetail.value.destination
        )
        .slice(0, 3)
    } else {
      relatedLogs.value = []
    }
  } catch (error) {
    console.error('加载相关推荐失败:', error)
    relatedLogs.value = []
  }
}

const toggleLike = async () => {
  try {
    const res = await likeTravelLog(logDetail.value.id)
    if (res && res.data && res.data.status === 0) {
      logDetail.value.is_liked = !logDetail.value.is_liked
      logDetail.value.likes_count = res.data.data.likes_count
      ElMessage.success(res.data.message)
    } else {
      ElMessage.error(res?.data?.message || '操作失败')
    }
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败，请稍后重试')
  }
}

const shareLog = () => {
  const url = window.location.href
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => {
      ElMessage.success('链接已复制到剪贴板')
    })
  } else {
    ElMessage.success('分享功能开发中')
  }
}

const deleteLog = async () => {
  try {
    await ElMessageBox.confirm('确定要删除这篇游记吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await deleteTravelLog(logDetail.value.id)
    if (res && res.data && res.data.status === 0) {
      ElMessage.success('删除成功')
      router.push('/travel-log/list')
    } else {
      ElMessage.error(res?.data?.message || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败，请稍后重试')
    }
  }
}

const viewRelated = (id) => {
  router.push(`/travel-log/detail/${id}`)
}

const goBack = () => {
  router.back()
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

onMounted(() => {
  loadLogDetail()
})
</script>

<style scoped lang="scss">
.travel-log-detail {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;

  .detail-content {
    margin-top: 20px;

    .main-card {
      margin-bottom: 20px;

      .log-header {
        margin-bottom: 24px;

        .log-title {
          margin: 0 0 16px 0;
          font-size: 28px;
          color: #303133;
          line-height: 1.4;
        }

        .log-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;

          .author-info {
            display: flex;
            align-items: center;
            gap: 12px;

            .author-details {
              .author-name {
                font-size: 16px;
                font-weight: 600;
                color: #303133;
                margin-bottom: 4px;
              }

              .publish-time {
                display: flex;
                align-items: center;
                gap: 4px;
                font-size: 14px;
                color: #909399;
              }
            }
          }

          .log-stats {
            display: flex;
            gap: 20px;

            .stat-item {
              display: flex;
              align-items: center;
              gap: 6px;
              font-size: 14px;
              color: #606266;

              .el-icon {
                color: #909399;
              }
            }
          }
        }
      }

      .log-cover {
        margin-bottom: 24px;
        border-radius: 8px;
        overflow: hidden;

        .cover-image {
          width: 100%;
          height: 400px;
        }
      }

      .log-content {
        margin-bottom: 24px;

        .content-text {
          font-size: 16px;
          line-height: 1.8;
          color: #303133;
          white-space: pre-wrap;
          word-wrap: break-word;
          margin-bottom: 24px;
        }

        .content-images {
          margin-bottom: 24px;

          .image-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 12px;

            .content-image {
              width: 100%;
              height: 200px;
              border-radius: 8px;
              cursor: pointer;
            }
          }
        }

        .content-tags {
          .tag-list {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;

            .tag-item {
              font-size: 14px;
            }
          }
        }
      }

      .log-actions {
        display: flex;
        gap: 12px;
        padding-top: 24px;
        border-top: 1px solid #ebeef5;
      }
    }

    .related-card {
      .related-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 16px;

        .related-item {
          cursor: pointer;
          transition: all 0.3s;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #ebeef5;

          &:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          .related-cover {
            width: 100%;
            height: 150px;
          }

          .related-info {
            padding: 12px;

            h4 {
              margin: 0 0 8px 0;
              font-size: 16px;
              color: #303133;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            p {
              margin: 0 0 8px 0;
              font-size: 14px;
              color: #909399;
            }

            .related-stats {
              display: flex;
              align-items: center;
              gap: 4px;
              font-size: 14px;
              color: #909399;

              .el-icon {
                color: #f56c6c;
              }
            }
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .travel-log-detail {
    padding: 10px;

    .detail-content {
      .main-card {
        .log-header {
          .log-title {
            font-size: 22px;
          }

          .log-meta {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        .log-cover {
          .cover-image {
            height: 250px;
          }
        }

        .log-content {
          .content-text {
            font-size: 15px;
          }
        }

        .log-actions {
          flex-wrap: wrap;
        }
      }
    }
  }
}
</style>
