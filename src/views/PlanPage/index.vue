<template>
    <div class="Planning-Page">
        <div class="Planning-Page-wrapper">
            <div class="close-btn" @click="goToHome">
                <el-icon>
                    <Close />
                </el-icon>
            </div>
            <div class="Planning-header">
                <h1><i class="fas fa-plane"></i>旅行规划</h1>
                <p>分步规划您的旅行，自动获取天气、景点、路线与预算</p>
            </div>
            <el-steps :active="currentStep - 1" align-center class="step-indicator" finish-status="success">
                <el-step title="目的地" description="设置旅行基本信息"></el-step>
                <el-step title="路线交通" description="规划路线与交通方式"></el-step>
                <el-step title="天气景点" description="查看天气与选择景点"></el-step>
                <el-step title="行程总结" description="查看完整行程规划"></el-step>
            </el-steps>
            <div class="progress-bar">
                <div class="progress" :style="{ width: `${(currentStep / totalSteps) * 100}%` }"></div>
            </div>
            <div class="step-content">
                <div v-if="currentStep === 1" class="step-1">
                    <el-form :model="tripData" label-width="100px">
                        <el-form-item label="出发地">
                            <el-input v-model="tripData.origin" placeholder="如：北京">
                                <template #prefix>
                                    <i class="fas fa-map-marker-alt"></i>
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="目的地">
                            <el-input v-model="tripData.destination" placeholder="如：上海">
                                <template #prefix>
                                    <i class="fas fa-location-arrow"></i>
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="开始日期">
                            <el-date-picker v-model="tripData.startDate" type="date" placeholder="选择开始日期"
                                :disabled-date="disabledStartDate">
                                <template #prefix>
                                    <i class="fas fa-calendar-alt"></i>
                                </template>
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="结束日期">
                            <el-date-picker v-model="tripData.endDate" type="date" placeholder="选择结束日期"
                                :disabled-date="disabledEndDate">
                                <template #prefix>
                                    <i class="fas fa-calendar-alt"></i>
                                </template>
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="旅行人数">
                            <el-input-number v-model="tripData.travelers" :min="1" />
                        </el-form-item>
                        <el-form-item label="预算范围">
                            <el-select v-model="tripData.budget" placeholder="请选择预算范围">
                                <el-option label="经济型 (¥1000-3000)" value="low"></el-option>
                                <el-option label="中等 (¥3000-8000)" value="medium"></el-option>
                                <el-option label="高端 (¥8000+)" value="high"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <div class="btn-group">
                        <el-button type="primary" @click="nextStep">下一步 <i class="fas fa-arrow-right"></i></el-button>
                    </div>
                </div>
                <div v-if="currentStep === 2" class="step-2">
                    <div class="distance-info">{{ distanceInfo }}</div>
                    <div class="time-list">
                        <div v-for="mode in Object.keys(transportModes)" :key="mode"
                            :class="['time-item', { active: tripData.transport === mode }]"
                            @click="tripData.transport = mode">
                            <i :class="['fas', transportModes[mode].icon]"></i>
                            {{ transportModes[mode].name }}：{{ calculateTime(mode) }}
                        </div>
                    </div>

                    <div id="map" class="map-container"></div>

                    <div class="btn-group">
                        <el-button @click="prevStep"><i class="fas fa-arrow-left"></i> 上一步</el-button>
                        <el-button type="primary" @click="nextStep">下一步 <i class="fas fa-arrow-right"></i></el-button>
                    </div>
                </div>
                <div v-if="currentStep === 3" class="step-3">
                    <div class="weather-section" v-if="tripData.weather">
                        <h3><i class="fas fa-cloud-sun"></i> 天气预报</h3>
                        <p class="weather-desc">您旅行期间的天气情况</p>

                        <div class="weather-cards">
                            <div v-for="(cast, index) in tripData.weather.forecast.casts.slice(0, 5)" :key="index"
                                class="weather-card">
                                <div class="weekday">周{{ weekMap[cast.week] || cast.week }}</div>
                                <div class="weather-icon">
                                    <i :class="['fas', weatherIcons[cast.dayweather] || 'fa-cloud']"></i>
                                </div>
                                <div class="temperature">{{ cast.daytemp }}°C</div>
                                <div class="weather-desc">{{ cast.dayweather }}</div>
                            </div>
                        </div>
                    </div>

                    <div class="poi-section">
                        <h3>推荐景点</h3>
                        <div class="poi-grid">
                            <div v-for="(attraction, index) in tripData.pois" :key="index" class="poi-card"
                                :class="{ selected: tripData.selectedPOIs.includes(index) }" @click="togglePOI(index)">
                                <div class="poi-image"
                                    :style="{ backgroundImage: attraction.photos && attraction.photos.length > 0 ? `url(${attraction.photos[0].url})` : 'none' }">
                                </div>
                                <div class="poi-info">
                                    <div class="poi-name">{{ attraction.name }}</div>
                                    <div class="poi-address">{{ attraction.address || "地址未提供" }}</div>
                                    <div class="poi-type">{{ attraction.type.split(';')[0] || "风景名胜" }}</div>
                                    <div class="poi-rating">
                                        <i class="fas fa-star"></i> 评分: {{ attraction.importance || '4.0' }}
                                    </div>
                                    <div class="poi-ticket">
                                        <i class="fas fa-ticket-alt"></i> 门票: 免费
                                    </div>
                                    <div class="poi-action">
                                        点击卡片{{ tripData.selectedPOIs.includes(index) ? '移除' : '添加' }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="btn-group">
                        <el-button @click="prevStep"><i class="fas fa-arrow-left"></i> 上一步</el-button>
                        <el-button type="primary" @click="nextStep">下一步 <i class="fas fa-arrow-right"></i></el-button>
                    </div>
                </div>
                <div v-if="currentStep === 4" class="step-4">
                    <div class="summary-section">
                        <div class="summary-success">
                            <div class="success-icon">
                                <i class="fas fa-check-circle"></i>
                            </div>
                            <h2>行程规划完成！</h2>
                            <p>您已成功规划本次旅行。可以下载行程单或返回修改。</p>
                        </div>

                        <div class="summary-card">
                            <h3 class="summary-title"><i class="fas fa-file-alt"></i> 行程概览</h3>
                            <div class="summary-grid">
                                <div class="summary-item">
                                    <div class="item-label"><i class="fas fa-map-marker-alt"></i> 目的地</div>
                                    {{ tripData.destination }}
                                </div>
                                <div class="summary-item">
                                    <div class="item-label"><i class="fas fa-calendar-alt"></i> 旅行日期</div>
                                    {{ formatChineseDate(tripData.startDate) }} 至 {{
                                        formatChineseDate(tripData.endDate) }}
                                </div>
                                <div class="summary-item">
                                    <div class="item-label"><i class="fas fa-user-friends"></i> 旅行人数</div>
                                    {{ tripData.travelers }} 人
                                </div>
                                <div class="summary-item">
                                    <div class="item-label"><i class="fas fa-route"></i> 交通方式</div>
                                    {{ transportText(tripData.transport) }}
                                </div>
                            </div>

                            <div class="summary-item">
                                <div class="item-label"><i class="fas fa-cloud-sun"></i> 天气预报</div>
                                旅行期间平均温度: {{ averageTemperature }}°C
                            </div>

                            <div class="summary-item">
                                <div class="item-label"><i class="fas fa-map-marked-alt"></i> 推荐景点</div>
                                <ul v-if="tripData.pois && tripData.selectedPOIs.length > 0">
                                    <li v-for="idx in tripData.selectedPOIs" :key="idx">
                                        {{ tripData.pois[idx].name }}
                                    </li>
                                </ul>
                                <span v-else>未选择景点</span>
                            </div>
                        </div>

                        <div class="summary-card">
                            <h3 class="summary-title"><i class="fas fa-calculator"></i> 预算估算</h3>
                            <div class="budget-details">
                                <div>交通费用: <b>¥{{ budget.transportCost }}</b></div>
                                <div>住宿费用 ({{ budget.days }}晚): <b>¥{{ budget.accommodationCost }}</b></div>
                                <div>景点门票: <b>¥{{ budget.ticketCost }}</b></div>
                                <div class="total-budget">总预算: <b>¥{{ budget.total }}</b></div>
                            </div>
                        </div>

                        <div class="btn-group">
                            <el-button @click="currentStep = 1"><i class="fas fa-edit"></i> 修改</el-button>
                            <el-button @click="restartPlan"><i class="fas fa-redo"></i> 重新规划</el-button>
                            <el-button type="success" @click="saveTrip"><i class="fas fa-plus"></i> 添加到我的行程</el-button>
                            <el-button type="primary" @click="exportPDF"><i class="fas fa-file-download"></i> 下载行程单
                                (PDF)</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch, nextTick, onUnmounted } from 'vue'
import { useTripPlanning } from '@/views/PlanPage/Methods/useTripPlanning'
import { Close } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'

import { bus } from '@/utils/mitt'

const router = useRouter()

const goToHome = () => {
    router.push('/travel_plan')
}

const {
    currentStep,
    totalSteps,
    stepStatus,
    tripData,
    transportModes,
    weatherIcons,
    weekMap,
    distanceInfo,
    averageTemperature,
    budget,
    forceUpdateDestination,
    nextStep,
    prevStep,
    disabledStartDate,
    disabledEndDate,
    calculateTime,
    transportText,
    togglePOI,
    restartPlan,
    showMapStep,
    fetchWeatherAndPOIData,
    formatChineseDate,
    exportPDF,
    saveTrip
} = useTripPlanning()


// 监听步骤变化
watch(currentStep, (newVal) => {
    if (newVal === 2) {
        setTimeout(() => {
            showMapStep()
        }, 100)
    }

    if (newVal === 3) {
        fetchWeatherAndPOIData()
    }
})

// 地图API加载
onMounted(() => {
    if (!window.AMap) {
        const script = document.createElement('script')
        script.src = 'https://webapi.amap.com/maps?v=2.0&key=d6252339014b34205c7ab52961b96dd1&plugin=AMap.ToolBar,AMap.Scale,AMap.HawkEye,AMap.Driving,AMap.Walking,AMap.Riding'
        script.onerror = () => {
            console.error('高德地图API加载失败')
        }
        document.head.appendChild(script)
    }

    // 监听来自 TravelPlan 的城市选择事件
    const onCity = async (cityName) => {
        await forceUpdateDestination(cityName)
    }
    const route = useRoute()
    if (route && route.query && route.query.dest) {
        forceUpdateDestination(route.query.dest)
    }
    bus.on('cityName', onCity)

    onUnmounted(() => {
        bus.off && bus.off('cityName', onCity)
    })
})
</script>

<style lang="scss" scoped>
.Planning-Page {
    height: 100vh;
    width: 100vw;
    background: linear-gradient(135deg,
            #b0e0e6 0%,
            #80deea 100%);
    display: flex;
    align-items: center;
    justify-content: center;

    .Planning-Page-wrapper {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        //overflow: hidden;
        position: relative;

        .close-btn {
            position: absolute;
            top: 12px;
            right: 15px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 10;
            transition: all 0.3s ease;

            .el-icon {
                font-size: 20px;
                color: #606266;

                &:hover {
                    color: orange;
                }
            }

            &:hover {
                background: rgba(0, 0, 0, 0.15);
                transform: scale(1.2);
            }
        }

        .Planning-header {
            text-align: center;

            h1 {
                font-size: 2.7rem;
                color: #1a2980;
                //margin-bottom: 10px;
                //letter-spacing: 2px;
            }

            p {
                color: #666;
                font-size: 1.1rem;
            }
        }

        .progress-bar {
            background: #e3eaf2;
            border-radius: 3px;
            overflow: hidden;
        }

        .step-2 {
            .distance-info {
                font-size: 1.1rem;
                color: #1976d2;
                font-weight: 500;
                text-align: center;
                margin-bottom: 5px;
            }

            .time-list {
                display: flex;
                gap: 18px;
                justify-content: center;

                .time-item {
                    background: #f0f4fa;
                    border-radius: 10px;
                    padding: 10px 18px;
                    color: #1a2980;
                    font-size: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 8px;

                    &.active {
                        background: #26d0ce;
                        color: #fff;
                    }
                }
            }
        }
    }

    .map-container {
        width: 100%;
        height: 320px;
        border-radius: 12px;
        margin-top: 15px;
    }
}

// 移动端样式 (max-width: 767px)
@media (max-width: 767px) {
    .Planning-Page {
        height: 100vh;
        overflow: hidden;

        .Planning-Page-wrapper {
            width: 100vw;
            //height: auto;
            height: 90vh;
            //margin: 20px 0;
            //padding: 20px 15px;

            .Planning-header {
                h1 {
                    font-size: 1.8rem;
                    margin-bottom: 8px;
                }

                p {
                    font-size: 0.9rem;
                    margin-bottom: 15px;
                }
            }

            .step-indicator {
                margin: 15px 0;

                :deep(.el-step) {
                    .el-step__title {
                        font-size: 0.7rem;
                    }

                    .el-step__description {
                        font-size: 0.6rem;
                    }
                }
            }

            .progress-bar {
                height: 4px;
                margin-bottom: 20px;

                .progress {
                    height: 100%;
                    background: #26d0ce;
                    border-radius: 3px;
                    transition: width 0.4s;
                }
            }

            .step-content {
                height: auto;
                max-height: 70vh;
                overflow-y: auto;
                padding: 0 10px;

                .el-form {
                    .el-form-item {
                        margin-bottom: 15px;

                        .el-form-item__label {
                            font-size: 0.9rem;
                            margin-bottom: 5px;
                        }
                    }
                }
            }

            .btn-group {
                display: flex;
                justify-content: space-between;
                margin: 20px 0 10px 0;
                gap: 10px;

                .el-button {
                    flex: 1;
                    font-size: 0.9rem;
                    padding: 10px 15px;
                }
            }

            // 步骤2 - 路线交通
            .step-2 {
                .distance-info {
                    font-size: 1rem;
                    margin-bottom: 15px;
                }

                .time-list {
                    flex-direction: column;
                    gap: 5px;
                    margin-bottom: 10px;

                    .time-item {
                        padding: 12px 15px;
                        font-size: 0.9rem;
                        justify-content: center;
                    }
                }

                .map-container {
                    height: 250px;
                    margin-top: 10px;
                }
            }

            // 步骤3 - 天气景点
            .step-3 {
                .weather-section {
                    margin-bottom: 20px;

                    h3 {
                        font-size: 1.1rem;
                        margin-bottom: 8px;
                        text-align: center;
                    }

                    .weather-desc {
                        font-size: 0.9rem;
                        margin-bottom: 15px;
                        text-align: center;
                    }

                    .weather-cards {
                        gap: 10px;
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: center;
                        padding-bottom: 10px;

                        .weather-card {
                            min-width: 50px;
                            padding: 8px 5px;
                            display: flex;
                            flex-direction: column;
                            align-items: center;

                            .weekday {
                                font-size: 0.8rem;
                            }

                            .weather-icon {
                                font-size: 1.2rem;
                                color: orange;

                            }

                            .temperature {
                                font-size: 1.2rem;
                            }

                            .weather-desc {
                                font-size: 0.8rem;
                            }
                        }
                    }
                }

                .poi-section {
                    h3 {
                        font-size: 1.1rem;
                        text-align: center;
                        margin-bottom: 15px;
                    }

                    .poi-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                        gap: 15px;

                        .poi-card {
                            background: #fff;
                            border-radius: 10px;
                            box-shadow: 0 2px 8px #e3eaf2;
                            position: relative;
                            overflow: hidden;

                            &.selected {
                                &::after {
                                    content: '✓';
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                    right: 0;
                                    bottom: 0;
                                    background: rgba(38, 208, 206, 0.75);
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    font-size: 4rem;
                                    color: #fff;
                                    font-weight: bold;
                                    border-radius: 10px;
                                    z-index: 10;
                                }

                                .poi-info {

                                    .poi-name,
                                    .poi-address,
                                    .poi-type,
                                    .poi-rating,
                                    .poi-ticket {
                                        color: #1a2980;
                                    }

                                    .poi-action {
                                        color: black;
                                        font-weight: 600;
                                    }
                                }
                            }

                            .poi-image {
                                height: 120px;
                                background: #e3eaf2 center/cover;
                                border-radius: 8px 8px 0 0;
                            }

                            .poi-info {
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                padding: 5px;

                                .poi-name {
                                    font-weight: 600;
                                    font-size: 1rem;
                                }

                                .poi-address {
                                    font-size: 0.95rem;
                                    color: #888;
                                }

                                .poi-type {
                                    font-size: 0.9rem;
                                    color: #1976d2;
                                    margin-top: 4px;
                                }

                                .poi-rating {
                                    margin-top: 6px;
                                    font-size: 0.9rem;

                                    i {
                                        color: #f7b731;
                                    }
                                }

                                .poi-ticket {
                                    margin-top: 4px;
                                    font-size: 0.9rem;
                                }

                                .poi-action {
                                    margin-top: 6px;
                                    font-size: 0.9rem;
                                    color: #26d0ce;
                                }
                            }
                        }
                    }
                }
            }

            // 步骤4 - 行程总结
            .step-4 {
                .summary-section {
                    .summary-success {
                        text-align: center;
                        margin-bottom: 10px;

                        .success-icon {
                            font-size: 2rem;
                            color: #4cc9f0;
                            margin-bottom: 5px;
                            animation: bounce 1.5s infinite;
                        }

                        h2 {
                            font-size: 1.3rem;
                            font-weight: 700;
                            margin-bottom: 3px;
                        }

                        p {
                            color: #666;
                            font-size: 0.9rem;
                        }
                    }

                    .summary-card {
                        margin-bottom: 25px;
                        padding: 15px;
                        background: #fff;
                        border-radius: 18px;
                        box-shadow: 0 10px 10px rgba(67, 97, 238, 0.08);
                        padding-top: 10px;

                        .summary-title {
                            font-size: 1.1rem;
                            margin-bottom: 15px;
                            font-weight: 700;
                            text-align: center;
                        }

                        .summary-grid {
                            display: grid;
                            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                            gap: 12px;
                        }

                        .summary-item {
                            background: #f7fafd;
                            border-radius: 10px;
                            padding: 12px 10px;
                            font-size: 0.9rem;
                            color: #222;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            gap: 6px;

                            .item-label {
                                color: #888;
                                font-size: 0.8rem;
                                margin-bottom: 2px;
                                font-weight: 500;
                                display: flex;
                                align-items: center;
                                gap: 5px;
                            }
                        }

                        .budget-details {
                            display: flex;
                            flex-direction: column;
                            flex-wrap: wrap;
                            align-items: center;
                            gap: 15px;
                            font-size: 1rem;
                            margin-bottom: 10px;

                            .total-budget {
                                font-weight: 700;
                            }
                        }
                    }

                    .btn-group {
                        flex-direction: column;

                        .el-button {
                            margin-bottom: 10px;
                            margin-left: 0px;
                        }
                    }
                }
            }
        }
    }
}

// 平板端样式 (min-width: 768px) and (max-width: 1024px)
@media (min-width: 768px) and (max-width: 1024px) {
    .Planning-Page {
        .Planning-Page-wrapper {
            width: 70vw;
            height: 100vh;

            h1 {
                margin-bottom: 5px;
                font-size: 15px;
            }

            p {
                margin-bottom: 5px;
            }

            .step-indicator {
                margin-bottom: 5px;
            }

            .step-content {
                height: 90vh;
                overflow-y: auto;
            }

            .progress-bar {
                height: 5px;
                margin-bottom: 10px;

                .progress {
                    height: 100%;
                    background: #26d0ce;
                    border-radius: 3px;
                    transition: width 0.4s;
                }
            }

            .btn-group {
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                margin: 10px 10%;
            }

            .step-2 {
                .time-item {
                    transition: all 0.3s ease;

                    &:hover {
                        transform: translateY(-3px);
                        cursor: pointer;
                    }
                }

                .map-container {
                    width: 80%;
                    height: 200px;
                    border-radius: 12px;
                    margin: 10px auto 0 auto;
                }
            }

            .step-3 {
                .weather-section {
                    margin-bottom: 10px;

                    h3 {
                        font-size: 1.3rem;
                        margin-bottom: 4px;
                        text-align: center;
                    }

                    .weather-desc {
                        color: #888;
                        font-size: 1rem;
                        margin-bottom: 10px;
                        text-align: center;
                    }

                    .weather-cards {
                        display: flex;
                        gap: 20px;
                        flex-wrap: wrap;
                        justify-content: center;

                        .weather-card {
                            background: #fff;
                            border-radius: 18px;
                            box-shadow: 0 2px 12px #e3eaf2;
                            padding: 10px 10px;
                            min-width: 140px;
                            text-align: center;
                            display: flex;
                            flex-direction: column;
                            align-items: center;

                            .weekday {
                                color: #888;
                                font-weight: 600;
                                font-size: 1.1rem;
                                margin-bottom: 8px;
                            }

                            .weather-icon {
                                font-size: 1.5rem;
                                color: #ffa500;
                                margin-bottom: 2px;
                            }

                            .temperature {
                                font-size: 1.5rem;
                                font-weight: 700;
                                margin-bottom: 4px;
                            }

                            .weather-desc {
                                color: #888;
                                font-size: 1.1rem;
                                margin-bottom: 0;
                            }
                        }
                    }
                }

                .poi-section {
                    h3 {
                        margin-bottom: 10px;
                        text-align: center;
                    }

                    .poi-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                        gap: 15px;
                        margin-top: 5px;

                        .poi-card {
                            background: #fff;
                            border-radius: 10px;
                            box-shadow: 0 2px 8px #e3eaf2;
                            cursor: pointer;
                            transition: all 0.3s ease;
                            position: relative;
                            overflow: hidden;

                            &:hover {
                                transform: translateY(-3px);
                                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
                            }

                            &.selected {
                                transform: translateY(-3px);
                                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);

                                &::after {
                                    content: '✓';
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                    right: 0;
                                    bottom: 0;
                                    background: rgba(38, 208, 206, 0.75);
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    font-size: 5rem;
                                    color: #fff;
                                    font-weight: bold;
                                    border-radius: 10px;
                                    z-index: 10;
                                }

                                .poi-info {

                                    .poi-name,
                                    .poi-address,
                                    .poi-type,
                                    .poi-rating,
                                    .poi-ticket {
                                        color: #1a2980;
                                    }

                                    .poi-action {
                                        color: black;
                                        font-weight: 600;
                                    }
                                }
                            }

                            .poi-image {
                                height: 150px;
                                background: #e3eaf2 center/cover;
                                border-radius: 8px 8px 0 0;
                            }

                            .poi-info {
                                display: flex;
                                flex-direction: column;
                                align-items: center;

                                .poi-name {
                                    font-weight: 600;
                                    margin: 8px 0 4px 0;

                                }

                                .poi-address {
                                    font-size: 0.95rem;
                                    color: #888;
                                }

                                .poi-type {
                                    font-size: 0.9rem;
                                    color: #1976d2;
                                    margin-top: 4px;
                                }

                                .poi-rating {
                                    margin-top: 6px;
                                    font-size: 0.9rem;

                                    i {
                                        color: #f7b731;
                                    }
                                }

                                .poi-ticket {
                                    margin-top: 4px;
                                    font-size: 0.9rem;
                                }

                                .poi-action {
                                    margin-top: 6px;
                                    font-size: 0.9rem;
                                    color: #26d0ce;
                                }
                            }
                        }
                    }

                }
            }

            .step-4 {
                .summary-section {
                    .summary-success {
                        text-align: center;
                        margin-bottom: 15px;

                        .success-icon {
                            font-size: 2.5rem;
                            color: #4cc9f0;
                            margin-bottom: 10px;
                            animation: bounce 1.5s infinite;
                        }

                        h2 {
                            font-size: 1.5rem;
                            font-weight: 700;
                            margin-bottom: 6px;
                        }

                        p {
                            color: #666;
                            font-size: 1.08rem;
                        }
                    }

                    .summary-card {
                        background: #fff;
                        border-radius: 18px;
                        box-shadow: 0 10px 10px rgba(67, 97, 238, 0.08);
                        padding-top: 10px;
                        padding-bottom: 20px;
                        margin-bottom: 50px;

                        .summary-title {
                            font-size: 1.3rem;
                            font-weight: 700;
                            margin-bottom: 18px;
                            text-align: center;
                            //display: flex;
                            //align-items: center;
                            //gap: 10px;
                        }

                        .summary-grid {
                            display: grid;
                            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                            gap: 18px;
                            margin-bottom: 18px;
                        }

                        .summary-item {
                            background: #f7fafd;
                            border-radius: 10px;
                            padding: 18px 16px;
                            font-size: 1.08rem;
                            color: #222;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            gap: 6px;

                            .item-label {
                                color: #888;
                                font-size: 0.98rem;
                                margin-bottom: 2px;
                                font-weight: 500;
                                display: flex;
                                align-items: center;
                                gap: 5px;
                            }
                        }

                        .budget-details {
                            display: flex;
                            flex-wrap: wrap;
                            justify-content: center;
                            gap: 30px;
                            font-size: 1.1rem;
                            margin-bottom: 10px;

                            .total-budget {
                                font-weight: 700;
                            }
                        }
                    }
                }
            }
        }
    }
}

//桌面
@media (min-width: 1024px) {
    .Planning-Page {
        .Planning-Page-wrapper {
            width: 70vw;
            height: 90vh;

            h1 {
                margin-bottom: 10px;
            }

            p {
                margin-bottom: 5px;
            }

            .step-indicator {
                margin-bottom: 10px;
            }

            .step-content {
                height: 400px;
                overflow-y: auto;
            }

            .progress-bar {
                height: 5px;
                margin-bottom: 15px;

                .progress {
                    height: 100%;
                    background: #26d0ce;
                    border-radius: 3px;
                    transition: width 0.4s;
                }
            }

            .btn-group {
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                margin: 10px 10%;
            }

            .step-2 {
                .time-item {
                    transition: all 0.3s ease;

                    &:hover {
                        transform: translateY(-3px);
                        cursor: pointer;
                    }
                }

                .map-container {
                    width: 80%;
                    height: 250px;
                    border-radius: 12px;
                    margin: 15px auto 0 auto;
                }
            }

            .step-3 {
                .weather-section {
                    margin-bottom: 10px;

                    h3 {
                        font-size: 1.3rem;
                        margin-bottom: 4px;
                        text-align: center;
                    }

                    .weather-desc {
                        color: #888;
                        font-size: 1rem;
                        margin-bottom: 10px;
                        text-align: center;
                    }

                    .weather-cards {
                        display: flex;
                        gap: 20px;
                        flex-wrap: wrap;
                        justify-content: center;

                        .weather-card {
                            background: #fff;
                            border-radius: 18px;
                            box-shadow: 0 2px 12px #e3eaf2;
                            padding: 10px 10px;
                            min-width: 140px;
                            text-align: center;
                            display: flex;
                            flex-direction: column;
                            align-items: center;

                            .weekday {
                                color: #888;
                                font-weight: 600;
                                font-size: 1.1rem;
                                margin-bottom: 8px;
                            }

                            .weather-icon {
                                font-size: 1.5rem;
                                color: #ffa500;
                                margin-bottom: 2px;
                            }

                            .temperature {
                                font-size: 1.5rem;
                                font-weight: 700;
                                margin-bottom: 4px;
                            }

                            .weather-desc {
                                color: #888;
                                font-size: 1.1rem;
                                margin-bottom: 0;
                            }
                        }
                    }
                }

                .poi-section {
                    h3 {
                        margin-bottom: 10px;
                        text-align: center;
                    }

                    .poi-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                        gap: 15px;
                        margin-top: 5px;

                        .poi-card {
                            background: #fff;
                            border-radius: 10px;
                            box-shadow: 0 2px 8px #e3eaf2;
                            cursor: pointer;
                            transition: all 0.3s ease;
                            position: relative;
                            overflow: hidden;

                            &:hover {
                                transform: translateY(-3px);
                                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
                            }

                            &.selected {
                                transform: translateY(-3px);
                                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);

                                &::after {
                                    content: '✓';
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                    right: 0;
                                    bottom: 0;
                                    background: rgba(38, 208, 206, 0.75);
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    font-size: 5rem;
                                    color: #fff;
                                    font-weight: bold;
                                    border-radius: 10px;
                                    z-index: 10;
                                }

                                .poi-info {

                                    .poi-name,
                                    .poi-address,
                                    .poi-type,
                                    .poi-rating,
                                    .poi-ticket {
                                        color: #1a2980;
                                    }

                                    .poi-action {
                                        color: black;
                                        font-weight: 600;
                                    }
                                }
                            }

                            .poi-image {
                                height: 150px;
                                background: #e3eaf2 center/cover;
                                border-radius: 8px 8px 0 0;
                            }

                            .poi-info {
                                display: flex;
                                flex-direction: column;
                                align-items: center;

                                .poi-name {
                                    font-weight: 600;
                                    margin: 8px 0 4px 0;

                                }

                                .poi-address {
                                    font-size: 0.95rem;
                                    color: #888;
                                }

                                .poi-type {
                                    font-size: 0.9rem;
                                    color: #1976d2;
                                    margin-top: 4px;
                                }

                                .poi-rating {
                                    margin-top: 6px;
                                    font-size: 0.9rem;

                                    i {
                                        color: #f7b731;
                                    }
                                }

                                .poi-ticket {
                                    margin-top: 4px;
                                    font-size: 0.9rem;
                                }

                                .poi-action {
                                    margin-top: 6px;
                                    font-size: 0.9rem;
                                    color: #26d0ce;
                                }
                            }
                        }
                    }

                }
            }

            .step-4 {
                .summary-section {
                    .summary-success {
                        text-align: center;
                        margin-bottom: 15px;

                        .success-icon {
                            font-size: 2.5rem;
                            color: #4cc9f0;
                            margin-bottom: 10px;
                            animation: bounce 1.5s infinite;
                        }

                        h2 {
                            font-size: 1.5rem;
                            font-weight: 700;
                            margin-bottom: 6px;
                        }

                        p {
                            color: #666;
                            font-size: 1.08rem;
                        }
                    }

                    .summary-card {
                        background: #fff;
                        border-radius: 18px;
                        box-shadow: 0 10px 10px rgba(67, 97, 238, 0.08);
                        padding-top: 10px;
                        padding-bottom: 20px;
                        margin-bottom: 50px;

                        .summary-title {
                            font-size: 1.3rem;
                            font-weight: 700;
                            margin-bottom: 18px;
                            text-align: center;
                            //display: flex;
                            //align-items: center;
                            //gap: 10px;
                        }

                        .summary-grid {
                            display: grid;
                            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                            gap: 18px;
                            margin-bottom: 18px;
                        }

                        .summary-item {
                            background: #f7fafd;
                            border-radius: 10px;
                            padding: 18px 16px;
                            font-size: 1.08rem;
                            color: #222;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            gap: 6px;

                            .item-label {
                                color: #888;
                                font-size: 0.98rem;
                                margin-bottom: 2px;
                                font-weight: 500;
                                display: flex;
                                align-items: center;
                                gap: 5px;
                            }
                        }

                        .budget-details {
                            display: flex;
                            flex-wrap: wrap;
                            justify-content: center;
                            gap: 30px;
                            font-size: 1.1rem;
                            margin-bottom: 10px;

                            .total-budget {
                                font-weight: 700;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>