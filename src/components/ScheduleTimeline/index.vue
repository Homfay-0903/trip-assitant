<template>
  <div class="schedule-timeline">
    <div class="timeline-header">
      <h3>日程安排</h3>
      <div class="header-actions">
        <el-button @click="showRecommendDialog">
          <el-icon>
            <Star />
          </el-icon>
          智能推荐
        </el-button>
        <el-button type="primary" @click="showAddDialog">
          <el-icon>
            <Plus />
          </el-icon>
          添加日程
        </el-button>
      </div>
    </div>

    <el-empty v-if="!schedules || schedules.length === 0" description="暂无日程安排" />

    <el-timeline v-else>
      <el-timeline-item v-for="schedule in schedules" :key="schedule.id" :timestamp="formatDate(schedule.date)"
        placement="top">
        <el-card class="schedule-card">
          <div class="schedule-header">
            <h4>第{{ schedule.day_number }}天</h4>
            <div class="schedule-actions">
              <el-button text type="primary" @click="editSchedule(schedule)">
                <el-icon>
                  <Edit />
                </el-icon>
              </el-button>
              <el-button text type="danger" @click="deleteSchedule(schedule.id)">
                <el-icon>
                  <Delete />
                </el-icon>
              </el-button>
            </div>
          </div>

          <div class="schedule-content">
            <div class="time-slot" v-if="schedule.morning_activity">
              <div class="slot-label">上午</div>
              <div class="slot-content">{{ schedule.morning_activity }}</div>
            </div>

            <div class="time-slot" v-if="schedule.afternoon_activity">
              <div class="slot-label">下午</div>
              <div class="slot-content">{{ schedule.afternoon_activity }}</div>
            </div>

            <div class="time-slot" v-if="schedule.evening_activity">
              <div class="slot-label">晚上</div>
              <div class="slot-content">{{ schedule.evening_activity }}</div>
            </div>

            <div class="notes" v-if="schedule.notes">
              <el-icon>
                <Document />
              </el-icon>
              <span>{{ schedule.notes }}</span>
            </div>
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>

    <el-dialog v-model="dialogVisible" :title="editingSchedule ? '编辑日程' : '添加日程'" width="600px" append-to-body>
      <el-form :model="scheduleForm" :rules="rules" ref="scheduleFormRef" label-width="100px">
        <el-form-item label="日期" prop="date">
          <el-date-picker v-model="scheduleForm.date" type="date" placeholder="选择日期" style="width: 100%" />
        </el-form-item>

        <el-form-item label="第几天" prop="day_number">
          <el-input-number v-model="scheduleForm.day_number" :min="1" />
        </el-form-item>

        <el-form-item label="上午活动">
          <el-input v-model="scheduleForm.morning_activity" type="textarea" :rows="3" placeholder="请输入上午活动安排" />
        </el-form-item>

        <el-form-item label="下午活动">
          <el-input v-model="scheduleForm.afternoon_activity" type="textarea" :rows="3" placeholder="请输入下午活动安排" />
        </el-form-item>

        <el-form-item label="晚上活动">
          <el-input v-model="scheduleForm.evening_activity" type="textarea" :rows="3" placeholder="请输入晚上活动安排" />
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="scheduleForm.notes" type="textarea" :rows="2" placeholder="请输入备注信息" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitSchedule" :loading="submitting">
          {{ editingSchedule ? '保存' : '添加' }}
        </el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="recommendDialogVisible" title="智能推荐景点" width="800px" append-to-body>
      <div class="recommend-content">
        <el-alert title="推荐说明" type="info" :closable="false" style="margin-bottom: 20px">
          根据您的目的地和行程天数，为您推荐热门景点和游玩时长
        </el-alert>

        <div class="recommend-filters">
          <el-input v-model="recommendDestination" placeholder="请输入目的地" style="width: 200px; margin-right: 10px" />
          <el-button type="primary" @click="getRecommendations">
            获取推荐
          </el-button>
        </div>

        <div class="recommend-list" v-loading="recommendLoading">
          <el-empty v-if="recommendedSpots.length === 0" description="暂无推荐" />

          <el-card v-for="(spot, index) in recommendedSpots" :key="index" class="spot-card" shadow="hover">
            <div class="spot-header">
              <div class="spot-rank">{{ index + 1 }}</div>
              <div class="spot-info">
                <h4>{{ spot.name }}</h4>
                <div class="spot-meta">
                  <el-tag size="small" type="primary">{{ spot.type }}</el-tag>
                  <span class="spot-duration">
                    <el-icon>
                      <Clock />
                    </el-icon>
                    建议游玩: {{ spot.duration }}
                  </span>
                </div>
              </div>
              <el-rate v-model="spot.rating" disabled show-score text-color="#ff9900" />
            </div>

            <div class="spot-desc">{{ spot.description }}</div>

            <div class="spot-tags">
              <el-tag v-for="(tag, i) in spot.tags" :key="i" size="small" type="info" style="margin-right: 8px">
                {{ tag }}
              </el-tag>
            </div>

            <div class="spot-actions">
              <el-button type="primary" size="small" @click="addToSchedule(spot)">
                添加到日程
              </el-button>
              <el-button size="small" @click="addToFavorites(spot)">
                收藏景点
              </el-button>
            </div>
          </el-card>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete, Document, Star, Clock } from '@element-plus/icons-vue'
import {
  getScheduleList,
  createSchedule,
  updateSchedule,
  deleteSchedule as deleteScheduleApi
} from '@/api/schedule'

const props = defineProps({
  tripId: {
    type: [String, Number],
    required: true
  }
})

const loading = ref(false)
const submitting = ref(false)
const schedules = ref([])
const dialogVisible = ref(false)
const editingSchedule = ref(null)
const scheduleFormRef = ref(null)
const recommendDialogVisible = ref(false)
const recommendDestination = ref('')
const recommendLoading = ref(false)
const recommendedSpots = ref([])

const scheduleForm = reactive({
  date: '',
  day_number: 1,
  morning_activity: '',
  afternoon_activity: '',
  evening_activity: '',
  notes: ''
})

const rules = {
  date: [{ required: true, message: '请选择日期', trigger: 'change' }],
  day_number: [{ required: true, message: '请输入天数', trigger: 'blur' }]
}

const loadSchedules = async () => {
  loading.value = true
  try {
    const res = await getScheduleList(props.tripId)
    if (res && res.status === 0) {
      schedules.value = res.data?.list || []
    } else {
      schedules.value = []
    }
  } catch (error) {
    console.error('加载日程列表失败:', error)
    ElMessage.error('加载日程列表失败')
    schedules.value = []
  } finally {
    loading.value = false
  }
}

const showAddDialog = () => {
  editingSchedule.value = null
  resetForm()
  dialogVisible.value = true
}

const editSchedule = (schedule) => {
  editingSchedule.value = schedule
  Object.assign(scheduleForm, {
    date: schedule.date,
    day_number: schedule.day_number,
    morning_activity: schedule.morning_activity,
    afternoon_activity: schedule.afternoon_activity,
    evening_activity: schedule.evening_activity,
    notes: schedule.notes
  })
  dialogVisible.value = true
}

const submitSchedule = async () => {
  if (!scheduleFormRef.value) return

  await scheduleFormRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        const data = {
          ...scheduleForm,
          date: formatDateForSubmit(scheduleForm.date),
          trip_id: props.tripId
        }

        let res
        if (editingSchedule.value) {
          res = await updateSchedule(editingSchedule.value.id, data)
        } else {
          res = await createSchedule(data)
        }

        if (res.status === 0) {
          ElMessage.success(editingSchedule.value ? '更新成功' : '添加成功')
          dialogVisible.value = false
          loadSchedules()
        } else {
          ElMessage.error(res.message)
        }
      } catch (error) {
        ElMessage.error('操作失败')
      } finally {
        submitting.value = false
      }
    }
  })
}

const deleteSchedule = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这个日程吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await deleteScheduleApi(id)
    if (res.status === 0) {
      ElMessage.success('删除成功')
      loadSchedules()
    } else {
      ElMessage.error(res.message)
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const resetForm = () => {
  Object.assign(scheduleForm, {
    date: '',
    day_number: 1,
    morning_activity: '',
    afternoon_activity: '',
    evening_activity: '',
    notes: ''
  })
  if (scheduleFormRef.value) {
    scheduleFormRef.value.resetFields()
  }
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN')
}

const formatDateForSubmit = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const showRecommendDialog = () => {
  recommendDialogVisible.value = true
}

const getRecommendations = () => {
  if (!recommendDestination.value) {
    ElMessage.warning('请输入目的地')
    return
  }

  recommendLoading.value = true

  setTimeout(() => {
    const mockData = {
      '北京': [
        {
          name: '故宫博物院',
          type: '历史文化',
          duration: '3-4小时',
          rating: 5,
          description: '世界上现存规模最大、保存最为完整的木质结构古建筑之一',
          tags: ['世界遗产', '必游景点', '历史建筑']
        },
        {
          name: '长城',
          type: '历史遗迹',
          duration: '半天',
          rating: 5,
          description: '中国古代的军事防御工程，世界文化遗产',
          tags: ['世界遗产', '必游景点', '户外']
        },
        {
          name: '颐和园',
          type: '皇家园林',
          duration: '2-3小时',
          rating: 4.5,
          description: '中国现存规模最大、保存最完整的皇家园林',
          tags: ['皇家园林', '世界遗产', '休闲']
        },
        {
          name: '天坛',
          type: '历史建筑',
          duration: '2小时',
          rating: 4.5,
          description: '明清两代皇帝祭祀皇天、祈五谷丰登的场所',
          tags: ['世界遗产', '历史建筑', '文化']
        }
      ],
      '上海': [
        {
          name: '外滩',
          type: '城市地标',
          duration: '1-2小时',
          rating: 4.5,
          description: '上海的标志性景观，万国建筑博览群',
          tags: ['地标', '夜景', '摄影']
        },
        {
          name: '迪士尼乐园',
          type: '主题乐园',
          duration: '全天',
          rating: 5,
          description: '中国大陆首座迪士尼主题乐园',
          tags: ['主题乐园', '亲子', '娱乐']
        },
        {
          name: '豫园',
          type: '古典园林',
          duration: '2-3小时',
          rating: 4,
          description: '江南古典园林，上海五大园林之一',
          tags: ['古典园林', '文化', '购物']
        }
      ],
      '杭州': [
        {
          name: '西湖',
          type: '自然风光',
          duration: '半天',
          rating: 5,
          description: '世界文化遗产，中国十大风景名胜之一',
          tags: ['世界遗产', '自然风光', '必游景点']
        },
        {
          name: '灵隐寺',
          type: '宗教文化',
          duration: '2-3小时',
          rating: 4.5,
          description: '杭州最早的名刹，中国佛教禅宗十大古刹之一',
          tags: ['寺庙', '文化', '历史']
        }
      ]
    }

    const destination = recommendDestination.value
    recommendedSpots.value = mockData[destination] || [
      {
        name: `${destination}热门景点1`,
        type: '自然风光',
        duration: '2-3小时',
        rating: 4,
        description: `${destination}的著名景点，值得一游`,
        tags: ['热门', '推荐', '必游']
      },
      {
        name: `${destination}热门景点2`,
        type: '历史文化',
        duration: '2小时',
        rating: 4,
        description: `体验${destination}的历史文化魅力`,
        tags: ['文化', '历史', '推荐']
      }
    ]

    recommendLoading.value = false
  }, 1000)
}

const addToSchedule = (spot) => {
  ElMessage.success(`已将"${spot.name}"添加到日程`)
}

const addToFavorites = (spot) => {
  ElMessage.success(`已收藏"${spot.name}"`)
}

watch(() => props.tripId, () => {
  if (props.tripId) {
    loadSchedules()
  }
}, { immediate: true })

onMounted(() => {
  if (props.tripId) {
    loadSchedules()
  }
})
</script>

<style scoped lang="scss">
.schedule-timeline {
  .timeline-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h3 {
      margin: 0;
      font-size: 18px;
    }

    .header-actions {
      display: flex;
      gap: 10px;
    }
  }

  .schedule-card {
    .schedule-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      h4 {
        margin: 0;
        font-size: 16px;
      }

      .schedule-actions {
        display: flex;
        gap: 8px;
      }
    }

    .schedule-content {
      .time-slot {
        margin-bottom: 12px;

        .slot-label {
          font-weight: 600;
          color: #409eff;
          margin-bottom: 4px;
        }

        .slot-content {
          color: #606266;
          line-height: 1.6;
        }
      }

      .notes {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid #ebeef5;
        color: #909399;

        .el-icon {
          margin-top: 2px;
        }
      }
    }
  }

  .recommend-content {
    .recommend-filters {
      margin-bottom: 20px;
    }

    .recommend-list {
      .spot-card {
        margin-bottom: 16px;

        .spot-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 12px;

          .spot-rank {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            font-weight: bold;
            flex-shrink: 0;
          }

          .spot-info {
            flex: 1;

            h4 {
              margin: 0 0 8px 0;
              font-size: 18px;
              color: #303133;
            }

            .spot-meta {
              display: flex;
              align-items: center;
              gap: 12px;

              .spot-duration {
                display: flex;
                align-items: center;
                gap: 4px;
                font-size: 14px;
                color: #909399;
              }
            }
          }
        }

        .spot-desc {
          margin-bottom: 12px;
          font-size: 14px;
          color: #606266;
          line-height: 1.6;
        }

        .spot-tags {
          margin-bottom: 12px;
        }

        .spot-actions {
          display: flex;
          gap: 10px;
        }
      }
    }
  }
}
</style>
