<template>
    <header class="trip-header-wrapper">
        <div class="trip-header">
            <div class="trip-header-nav-wrapper">
                <RouterLink to="/home">
                    <div class="trip-logo">
                        <img src="@/assets/vue.svg" alt="">
                    </div>
                </RouterLink>
                <div class="trip-nav">
                    <span class="nav-span" @click="GoToPages('/Over_Country')">全国各地</span>
                    <span class="nav-span" @click="GoToPages('/travel_plan')">旅行助手</span>
                    <span class="nav-span" @click="GoToPages('/my-trips')">我的行程</span>
                    <span class="nav-span" @click="GoToPages('/travel-log/list')">游记广场</span>
                    <span class="nav-span" @click="GoToPages('/my-favorites')">我的收藏</span>
                </div>
            </div>
            <div class="trip-header-user-wrapper">
                <div v-if="userStore.account" class="welcome">
                    <div>
                        尊敬的
                    </div>
                    <div class="avatar" @click="GoToPages('/user')">
                        <el-avatar :size="20" :src="userStore.imageUrl" />
                    </div>
                    <div>
                        {{ userStore.name }}
                        欢迎您登录本系统
                    </div>
                </div>
                <div v-else>
                    <span class="login" @click="GoToPages('/login')">登录/注册</span>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router';

import { useUserStore } from '@/stores/UserStore';

const userStore = useUserStore()

const router = useRouter()

const GoToPages = (path) => {
    router.push(path)
}
</script>

<style lang="scss" scoped>
.trip-header-wrapper {
    position: fixed;
    z-index: 1000;
    width: 100%;
    background: #80deea;
    margin-bottom: 1px;

    .trip-header {
        display: flex;
        justify-content: space-between;

        .trip-header-nav-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;

            img {
                width: 30px;
                height: 30px;
                cursor: pointer;
            }

            .trip-nav {

                //.nav-span:first-child {
                //    margin-right: 20px;
                //}
                //.nav-span+.nav-span {
                //    margin-left: 20px;
                //}
                .nav-span {
                    //margin-left: 40px;
                    //font-size: 15px;
                    font-weight: 600;
                    color: #696969;
                    cursor: pointer;

                    &:hover {
                        color: yellow;
                    }
                }
            }
        }

        .trip-header-user-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;

            .welcome {
                display: flex;

                .avatar {
                    margin-left: 8px;

                    :hover {
                        cursor: pointer;
                    }
                }
            }

            .login {
                margin-right: 10px;
                font-size: 15px;
                font-weight: 600;
                color: #696969;
                cursor: pointer;

                &:hover {
                    color: yellow;
                }
            }
        }
    }
}

/* 手机样式 */
@media (max-width: 767px) {
    .trip-header-wrapper {
        .trip-header {
            height: 50px;
            padding: 0 15px;

            .trip-header-nav-wrapper {
                gap: 15px;

                img {
                    width: 30px;
                    height: 30px;
                }

                .trip-nav {
                    gap: 15px;

                    .nav-span {
                        font-size: 14px;
                        padding: 6px 5px;
                    }
                }
            }

            .trip-header-user-wrapper {
                .login {
                    font-size: 14px;
                    padding: 6px 12px;
                }
            }
        }
    }
}

/* 平板样式 */
@media (min-width: 768px) and (max-width: 1024px) {
    .trip-header-wrapper {
        .trip-header {
            padding: 0 30px;
            height: 40px;

            .nav-span {
                font-size: 14px;
                padding: 6px 10px;
            }
        }
    }
}

/* 桌面样式 */
@media (min-width: 1024px) {
    .trip-header-wrapper {
        .trip-header {
            padding: 0 40px;

            .nav-span {
                margin-left: 40px;
                font-size: 15px;
            }
        }
    }
}
</style>