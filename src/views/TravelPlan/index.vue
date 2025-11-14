<template>
    <div class="trip-container">
        <header class="trip-header-wrapper">
            <div class="trip-header">
                <div class="trip-header-nav-wrapper">
                    <div class="trip-logo">
                        <img src="@/assets/vue.svg" alt="">
                    </div>
                    <div class="trip-nav">
                        <span class="nav-span">全国各地</span>
                        <span class="nav-span">旅行助手</span>
                    </div>
                </div>
                <div class="trip-header-user-wrapper">
                    <span class="login">登录/注册</span>
                </div>
            </div>
        </header>
        <div class="content">
            <div class="content-header">
                <img class="breadcrumb-img" src="@/assets/images/breadcrumb.png" alt="">
                <span class="header_desc">世界那么大，我想去看看</span>
            </div>
            <div class="banner">
                <div class="banner-wrapper">
                    <div class="title">
                        轻轻松松搞定
                        <span class="sub">你的攻略</span>
                    </div>
                    <div class="banner-desc">
                        让你再也不必为旅行规划而烦恼
                    </div>
                    <div class="button">
                        <el-button>
                            <span class="btn-desc">创建新的行程</span>
                            <template #icon>
                                <el-icon style="margin-right: 4px;">
                                    <Position />
                                </el-icon>
                            </template>
                        </el-button>
                    </div>
                    <div class="list">
                        <a href="https://zhuanlan.zhihu.com/p/32854215834" target="_blank" class="item">
                            <div class="list-title">
                                全国景点推荐
                            </div>
                            <div class="list-sub">
                                全国名胜景点大推荐
                            </div>
                            <img src="@/assets/images/view.svg" alt="">
                        </a>
                        <a href="Booking.com" target="_blank" class="item">
                            <div class="list-title">
                                全国酒店信息
                            </div>
                            <div class="list-sub">
                                全国酒店信息预订情况
                            </div>
                            <img src="@/assets/images/booking.jpg" alt="">
                        </a>
                        <a href="https://www.12306.cn/index/" target="_blank" class="item">
                            <div class="list-title">
                                全国车票情况
                            </div>
                            <div class="list-sub">
                                全国车票购买情况和预订
                            </div>
                            <img src="@/assets/images/plane.jpg" alt="">
                        </a>
                    </div>
                </div>
            </div>
            <div class="content-body">
                <div class="search">
                    <el-input placeholder="大家都在搜：北京">
                        <template #prefix>
                            <el-icon>
                                <Search />
                            </el-icon>
                        </template>
                    </el-input>
                </div>
                <div class="diver">
                    <span class="line"></span>
                    <span class="divider-text">热门城市</span>
                    <span class="line"></span>
                </div>
                <div class="HotCity">
                    <el-row :gutter="30">
                        <el-col :span="6">
                            <div class="city-card">
                                <div class="city-img">
                                    <el-image src="https://picsum.photos/id/1016/800/600" alt="北京" class="city-pic"
                                        lazy>
                                        <template #placeholder>
                                            <div class="image-slot">加载中...</div>
                                        </template>
                                        <template #error>
                                            <div class="image-slot">
                                                <el-icon>
                                                    <Picture />
                                                </el-icon>
                                            </div>
                                        </template>
                                    </el-image>
                                    <div class="city-overlay"></div>
                                </div>
                                <div class="city-info">
                                    <div class="grid-content">北京</div>
                                    <div class="city-desc-wrapper">
                                        <span class="city-desc">古都风貌与现代繁华的完美融合，感受历史的厚重与时代的脉搏</span>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="city-card">
                                <div class="city-img">
                                    <el-image src="https://picsum.photos/id/1019/800/600" alt="上海" class="city-pic"
                                        lazy>
                                        <template #placeholder>
                                            <div class="image-slot">加载中...</div>
                                        </template>
                                        <template #error>
                                            <div class="image-slot">
                                                <el-icon>
                                                    <Picture />
                                                </el-icon>
                                            </div>
                                        </template>
                                    </el-image>
                                    <div class="city-overlay"></div>
                                </div>
                                <div class="city-info">
                                    <div class="grid-content">上海</div>
                                    <div class="city-desc-wrapper">
                                        <span class="city-desc">国际大都市的魅力，外滩的夜景与弄堂的风情交相辉映</span>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="city-card">
                                <div class="city-img">
                                    <el-image src="https://picsum.photos/id/1031/800/600" alt="广州" class="city-pic"
                                        lazy>
                                        <template #placeholder>
                                            <div class="image-slot">加载中...</div>
                                        </template>
                                        <template #error>
                                            <div class="image-slot">
                                                <el-icon>
                                                    <Picture />
                                                </el-icon>
                                            </div>
                                        </template>
                                    </el-image>
                                    <div class="city-overlay"></div>
                                </div>
                                <div class="city-info">
                                    <div class="grid-content">广州</div>
                                    <div class="city-desc-wrapper">
                                        <span class="city-desc">千年商都，美食天堂，岭南文化的发源地与传承者</span>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="city-card">
                                <div class="city-img">
                                    <el-image src="https://picsum.photos/id/1033/800/600" alt="深圳" class="city-pic"
                                        lazy>
                                        <template #placeholder>
                                            <div class="image-slot">加载中...</div>
                                        </template>
                                        <template #error>
                                            <div class="image-slot">
                                                <el-icon>
                                                    <Picture />
                                                </el-icon>
                                            </div>
                                        </template>
                                    </el-image>
                                    <div class="city-overlay"></div>
                                </div>
                                <div class="city-info">
                                    <div class="grid-content">深圳</div>
                                    <div class="city-desc-wrapper">
                                        <span class="city-desc">创新之城，从小渔村到国际大都市的蜕变奇迹</span>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row :gutter="30">
                        <el-col :span="6">
                            <div class="city-card">
                                <div class="city-img">
                                    <el-image src="https://picsum.photos/id/1036/800/600" alt="杭州" class="city-pic"
                                        lazy>
                                        <template #placeholder>
                                            <div class="image-slot">加载中...</div>
                                        </template>
                                        <template #error>
                                            <div class="image-slot">
                                                <el-icon>
                                                    <Picture />
                                                </el-icon>
                                            </div>
                                        </template>
                                    </el-image>
                                    <div class="city-overlay"></div>
                                </div>
                                <div class="city-info">
                                    <div class="grid-content">杭州</div>
                                    <div class="city-desc-wrapper">
                                        <span class="city-desc">上有天堂下有苏杭，西湖美景与互联网创新的完美结合</span>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="city-card">
                                <div class="city-img">
                                    <el-image src="https://picsum.photos/id/1039/800/600" alt="成都" class="city-pic"
                                        lazy>
                                        <template #placeholder>
                                            <div class="image-slot">加载中...</div>
                                        </template>
                                        <template #error>
                                            <div class="image-slot">
                                                <el-icon>
                                                    <Picture />
                                                </el-icon>
                                            </div>
                                        </template>
                                    </el-image>
                                    <div class="city-overlay"></div>
                                </div>
                                <div class="city-info">
                                    <div class="grid-content">成都</div>
                                    <div class="city-desc-wrapper">
                                        <span class="city-desc">天府之国，悠闲的生活节奏与火辣的美食文化</span>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="city-card">
                                <div class="city-img">
                                    <el-image src="https://picsum.photos/id/1043/800/600" alt="重庆" class="city-pic"
                                        lazy>
                                        <template #placeholder>
                                            <div class="image-slot">加载中...</div>
                                        </template>
                                        <template #error>
                                            <div class="image-slot">
                                                <el-icon>
                                                    <Picture />
                                                </el-icon>
                                            </div>
                                        </template>
                                    </el-image>
                                    <div class="city-overlay"></div>
                                </div>
                                <div class="city-info">
                                    <div class="grid-content">重庆</div>
                                    <div class="city-desc-wrapper">
                                        <span class="city-desc">8D魔幻山城，长江与嘉陵江交汇处的立体都市</span>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="city-card">
                                <div class="city-img">
                                    <el-image src="https://picsum.photos/id/1052/800/600" alt="西安" class="city-pic"
                                        lazy>
                                        <template #placeholder>
                                            <div class="image-slot">加载中...</div>
                                        </template>
                                        <template #error>
                                            <div class="image-slot">
                                                <el-icon>
                                                    <Picture />
                                                </el-icon>
                                            </div>
                                        </template>
                                    </el-image>
                                    <div class="city-overlay"></div>
                                </div>
                                <div class="city-info">
                                    <div class="grid-content">西安</div>
                                    <div class="city-desc-wrapper">
                                        <span class="city-desc">十三朝古都，兵马俑见证历史，羊肉泡馍香气四溢</span>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row :gutter="30">
                        <el-col :span="6">
                            <div class="city-card">
                                <div class="city-img">
                                    <el-image src="https://picsum.photos/id/1054/800/600" alt="厦门" class="city-pic"
                                        lazy>
                                        <template #placeholder>
                                            <div class="image-slot">加载中...</div>
                                        </template>
                                        <template #error>
                                            <div class="image-slot">
                                                <el-icon>
                                                    <Picture />
                                                </el-icon>
                                            </div>
                                        </template>
                                    </el-image>
                                    <div class="city-overlay"></div>
                                </div>
                                <div class="city-info">
                                    <div class="grid-content">厦门</div>
                                    <div class="city-desc-wrapper">
                                        <span class="city-desc">海上花园城市，鼓浪屿的琴声与环岛路的海风</span>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="city-card">
                                <div class="city-img">
                                    <el-image src="https://picsum.photos/id/1057/800/600" alt="青岛" class="city-pic"
                                        lazy>
                                        <template #placeholder>
                                            <div class="image-slot">加载中...</div>
                                        </template>
                                        <template #error>
                                            <div class="image-slot">
                                                <el-icon>
                                                    <Picture />
                                                </el-icon>
                                            </div>
                                        </template>
                                    </el-image>
                                    <div class="city-overlay"></div>
                                </div>
                                <div class="city-info">
                                    <div class="grid-content">青岛</div>
                                    <div class="city-desc-wrapper">
                                        <span class="city-desc">红瓦绿树碧海蓝天，啤酒飘香的海滨城市</span>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="city-card">
                                <div class="city-img">
                                    <el-image src="https://picsum.photos/id/1060/800/600" alt="南京" class="city-pic"
                                        lazy>
                                        <template #placeholder>
                                            <div class="image-slot">加载中...</div>
                                        </template>
                                        <template #error>
                                            <div class="image-slot">
                                                <el-icon>
                                                    <Picture />
                                                </el-icon>
                                            </div>
                                        </template>
                                    </el-image>
                                    <div class="city-overlay"></div>
                                </div>
                                <div class="city-info">
                                    <div class="grid-content">南京</div>
                                    <div class="city-desc-wrapper">
                                        <span class="city-desc">六朝古都，秦淮河的夜景与中山陵的庄严肃穆</span>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div class="city-card">
                                <div class="city-img">
                                    <el-image src="https://picsum.photos/id/1063/800/600" alt="武汉" class="city-pic"
                                        lazy>
                                        <template #placeholder>
                                            <div class="image-slot">加载中...</div>
                                        </template>
                                        <template #error>
                                            <div class="image-slot">
                                                <el-icon>
                                                    <Picture />
                                                </el-icon>
                                            </div>
                                        </template>
                                    </el-image>
                                    <div class="city-overlay"></div>
                                </div>
                                <div class="city-info">
                                    <div class="grid-content">武汉</div>
                                    <div class="city-desc-wrapper">
                                        <span class="city-desc">九省通衢，长江汉水交汇，热干面香气满街</span>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
        <footer class="trip-footer-wrapper">
            <div class="trip-footer">
                <div class="trip-footer-nav-wrapper">
                    <div class="footer-nav">
                        <span class="footer-nav-list">联系我们</span>
                        <span class="footer-nav-list">合作伙伴</span>
                        <span class="footer-nav-list">用户协议</span>
                        <span class="footer-nav-list">隐私协议</span>
                    </div>
                    <div class="desc">Homfay出品</div>
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup>
import { Position, Search, Picture, Loading } from '@element-plus/icons-vue'


</script>

<style lang="scss" scoped>
.trip-container {
    display: flex;
    flex-direction: column;
    background: #F5FFFA;
    min-height: 100vh;

    .trip-header-wrapper {
        position: fixed;
        z-index: 1000;
        width: 100%;
        background: #80deea;

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
                        margin-left: 20px;
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

            .trip-header-user-wrapper {
                display: flex;
                justify-content: center;
                align-items: center;

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

    .content {
        flex: 1;

        .content-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }

        .content-body {
            .diver {
                width: 100%;
                margin: 20px 0;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;

                span:nth-child(1) {
                    flex: 1;
                }

                span:nth-child(3) {
                    flex: 1;
                }

                .line {
                    display: inline-block;
                    max-width: 30%;
                    width: 30%;
                }

                .divider-text {
                    vertical-align: middle;
                    margin: 0px 20px;
                    line-height: 0px;
                    display: inline-block;
                    width: 100px;
                }
            }
        }

        .HotCity {
            .city-card {
                border-radius: 20px;

                .image-slot {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    height: 100%;
                    background: #f5f7fa;
                    color: #909399;
                    font-size: 14px;
                }
            }
        }
    }

    .trip-footer-wrapper {
        width: 100%;
        height: 50px;
        display: flex;
        flex-direction: column;
        background: #80deea;
        justify-content: center;
        align-items: center;

        .footer-nav {
            .footer-nav-list {
                color: #696969;
                margin: 0 40px;
                cursor: pointer;

                &:hover {
                    color: yellow;
                }
            }
        }

        .desc {
            font-size: 12px;
            text-align: center;
            color: #696969;
        }
    }

}

/* 手机样式 */
@media (max-width: 767px) {
    .trip-container {
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
                            padding: 6px 10px;
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

        .content {
            padding-top: 50px;

            .content-header {
                img {
                    margin-left: 2%;
                    height: 40px;
                    margin-left: 5%;
                }

                .header_desc {
                    margin-right: 5%;
                    font-size: 8px;
                    font-weight: 400;
                }
            }

            .banner {
                width: 95vw;
                height: auto;
                min-height: 40vh;
                background-image: url('@/assets/images/Banner.png');
                background-size: cover;
                background-position: center;
                margin: 10px auto;
                border-radius: 8px;

                .banner-wrapper {
                    padding: 20px 15px;

                    .title {
                        text-align: center;
                        font-size: 20px;
                        font-weight: 600;
                        color: #fff;
                        margin: 0;

                        .sub {
                            font-size: 20px;
                            font-weight: 400;
                            color: #fff;
                            display: block;
                        }
                    }

                    .banner-desc {
                        text-align: center;
                        margin-top: 8px;
                        font-size: 14px;
                        color: #fff;
                    }

                    .button {
                        text-align: center;
                        margin-top: 20px;

                        .el-button {
                            width: 200px;
                            height: 40px;
                            border-radius: 8px;

                            .btn-desc {
                                color: #375c48;
                                font-size: 14px;
                                font-weight: 600;
                            }
                        }
                    }

                    .list {
                        display: flex;
                        flex-direction: column;
                        gap: 15px;
                        margin-top: 25px;
                        padding: 0 10px;
                        align-items: center;

                        .item {
                            width: 80%;
                            margin: 0 auto;
                            height: 80px;
                            text-decoration: none;
                            background: linear-gradient(180deg, #fff, #d8f2e4);
                            box-shadow: 0 5px 15px rgba(116, 129, 52, 0.4);
                            border-radius: 8px;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            position: relative;

                            .list-title {
                                font-size: 14px;
                                font-weight: 600;
                                color: #375c48;
                                line-height: 14px;
                                margin-left: 20px;
                            }

                            .list-sub {
                                margin-top: 8px;
                                font-size: 11px;
                                color: #3abd79;
                                line-height: 11px;
                                margin-left: 20px;
                            }

                            img {
                                position: absolute;
                                top: 50%;
                                right: 20px;
                                transform: translateY(-50%);
                                width: 50px;
                                height: 50px;
                                object-fit: contain;
                            }
                        }
                    }
                }
            }

            .content-body {
                .search {
                    position: relative;
                    height: 50px;
                    margin-bottom: 10px;

                    :deep(.el-input__wrapper) {
                        position: absolute;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 80%;
                        height: 35px;
                        border-radius: 20px;
                    }
                }

                .diver {
                    margin: 15px 0;

                    .divider-text {
                        font-size: 14px;
                        width: 80px;
                    }
                }

                .HotCity {
                    padding: 0 10px;
                    margin-top: 20px;

                    .el-row {
                        margin-bottom: 15px;
                        display: flex;

                        &:last-child {
                            margin-bottom: 30px;
                        }
                    }

                    .el-col {
                        width: 100%;
                        margin-bottom: 15px;
                    }

                    .city-card {
                        border-radius: 15px;
                        overflow: hidden;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                        transition: all 0.3s ease;
                        background-color: #fff;

                        &:hover {
                            transform: translateY(-3px);
                            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
                        }
                    }

                    .city-img {
                        position: relative;
                        height: 150px;
                        overflow: hidden;

                        .city-pic {
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                        }

                        .city-overlay {
                            position: absolute;
                            bottom: 0;
                            left: 0;
                            right: 0;
                            height: 40px;
                            background: linear-gradient(transparent, rgba(0, 0, 0, 0.5));
                        }
                    }

                    .city-info {
                        padding: 15px 12px;
                    }

                    .grid-content {
                        font-size: 18px;
                        font-weight: 600;
                        color: #333;
                        margin-bottom: 8px;
                        justify-content: flex-start;
                        padding: 0;
                        height: auto;
                    }

                    .city-desc-wrapper {
                        min-height: 40px;

                        .city-desc {
                            color: #666;
                            font-size: 12px;
                            line-height: 1.5;
                            display: -webkit-box;
                            -webkit-line-clamp: 2;
                            -webkit-box-orient: vertical;
                            overflow: hidden;
                        }
                    }
                }
            }
        }

        .trip-footer-wrapper {
            .trip-footer {
                padding: 0 15px;

                .trip-footer-nav-wrapper {
                    .footer-nav {
                        margin-bottom: 5px;

                        .footer-nav-list {
                            margin: 0 10px;
                            font-size: 13px;
                        }
                    }
                }
            }
        }
    }
}

/* 平板样式 */
@media (min-width: 768px) and (max-width: 1024px) {
    .trip-container {
        .trip-header-wrapper {
            .trip-header {
                padding: 0 30px;
                height: 40px;
            }
        }

        .content {
            padding-top: 40px;

            .content-header {
                img {
                    height: 40px;
                    margin-left: 6%;
                }

                .header_desc {
                    font-size: 12px;
                    font-weight: 400;
                    margin-right: 10%;
                }
            }

            .banner {
                width: 90vw;
                height: 45vh;
                background-image: url('@/assets/images/Banner.png');
                background-size: cover;
                background-position: center;
                margin: 15px auto;
                border-radius: 10px;

                .banner-wrapper {
                    padding: 30px;

                    .title {
                        margin-left: 50px;
                        font-size: 24px;
                        font-weight: 600;
                        color: #fff;

                        .sub {
                            font-size: 24px;
                            font-weight: 400;
                            color: #fff;
                        }
                    }

                    .banner-desc {
                        margin-top: 6px;
                        margin-left: 50px;
                        font-size: 16px;
                        color: #fff;
                    }

                    .button {
                        margin-left: 50px;
                        margin-top: 30px;

                        .el-button {
                            width: 250px;
                            height: 45px;
                            border-radius: 8px;

                            .btn-desc {
                                color: #375c48;
                                font-size: 16px;
                                font-weight: 600;
                            }
                        }
                    }

                    .list {
                        display: flex;
                        gap: 20px;
                        margin-top: 35px;
                        justify-content: center;
                        flex-wrap: wrap;

                        .item {
                            width: 220px;
                            height: 85px;
                            text-decoration: none;
                            background: linear-gradient(180deg, #fff, #d8f2e4);
                            box-shadow: 0 8px 18px rgba(116, 129, 52, 0.4);
                            border-radius: 8px;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            position: relative;

                            .list-title {
                                font-size: 15px;
                                font-weight: 600;
                                color: #375c48;
                                line-height: 15px;
                                margin-left: 25px;
                            }

                            .list-sub {
                                margin-top: 8px;
                                font-size: 11px;
                                color: #3abd79;
                                line-height: 11px;
                                margin-left: 25px;
                            }

                            img {
                                position: absolute;
                                top: 50%;
                                right: 20px;
                                transform: translateY(-50%);
                                width: 55px;
                                height: 55px;
                                object-fit: contain;
                            }
                        }
                    }
                }
            }

            .content-body {
                margin-top: 20px;

                .search {
                    position: relative;
                    height: 55px;
                    margin-bottom: 10px;

                    :deep(.el-input__wrapper) {
                        position: absolute;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 60%;
                        height: 38px;
                        border-radius: 20px;
                    }
                }

                .diver {
                    margin: 20px 0;

                    .divider-text {
                        font-size: 16px;
                        width: 90px;
                    }
                }

                .HotCity {
                    padding: 0 40px;
                    margin-top: 25px;

                    .el-row {
                        margin-bottom: 25px;
                        display: flex;
                        flex-wrap: wrap;

                        &:last-child {
                            margin-bottom: 40px;
                        }
                    }

                    .el-col {
                        width: 50%;
                        margin-bottom: 20px;
                    }

                    .city-card {
                        border-radius: 18px;
                        overflow: hidden;
                        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
                        transition: all 0.3s ease;
                        background-color: #fff;
                        cursor: pointer;
                        margin: 0 10px;

                        &:hover {
                            transform: translateY(-4px);
                            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                        }
                    }

                    .city-img {
                        position: relative;
                        height: 180px;
                        overflow: hidden;

                        .city-pic {
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                        }

                        .city-overlay {
                            position: absolute;
                            bottom: 0;
                            left: 0;
                            right: 0;
                            height: 50px;
                            background: linear-gradient(transparent, rgba(0, 0, 0, 0.5));
                        }
                    }

                    .city-info {
                        padding: 18px 15px;
                    }

                    .grid-content {
                        font-size: 19px;
                        font-weight: 600;
                        color: #333;
                        margin-bottom: 8px;
                        justify-content: flex-start;
                        padding: 0;
                        height: auto;
                    }

                    .city-desc-wrapper {
                        min-height: 45px;

                        .city-desc {
                            color: #666;
                            font-size: 13px;
                            line-height: 1.5;
                            display: -webkit-box;
                            line-clamp: 2;
                            -webkit-box-orient: vertical;
                            overflow: hidden;
                        }
                    }
                }
            }
        }

        .trip-footer-wrapper {
            .trip-footer {
                padding: 0 30px;
            }
        }
    }
}

/* 桌面样式 */
@media (min-width: 1024px) {
    .trip-container {
        .trip-header-wrapper {
            .trip-header {
                padding: 0 40px;
            }
        }

        .content {
            padding-top: 34px;

            .breadcrumb-img {
                height: 40px;
                margin-left: 10%;
            }

            .content-header {
                margin-right: 10%;
                font-size: 12px;
                font-weight: 400;
            }

            .banner {
                width: 85vw;
                height: 50vh;
                background-image: url('@/assets/images/Banner.png');
                background-size: cover;
                margin: 0 auto;

                .banner-wrapper {
                    padding-top: 20px;

                    .title {
                        margin-left: 75px;
                        font-size: 28px;
                        font-weight: 600;
                        color: #fff;

                        .sub {
                            font-size: 28px;
                            font-weight: 400;
                            color: #fff;
                        }
                    }

                    .banner-desc {
                        margin-top: 4px;
                        margin-left: 75px;
                        font-size: 18px;
                        color: #fff;
                    }

                    .button {
                        margin-left: 75px;
                        margin-top: 40px;

                        .el-button {
                            width: 300px;
                            height: 50px;
                            border-radius: 10px;
                            transition: all 0.2s ease;

                            &:hover {
                                transform: translateY(-2px);
                            }

                            .btn-desc {
                                color: #375c48;
                                font-size: 18px;
                                font-weight: 600;
                                transition: all 0.2s ease;

                                &:hover {
                                    color: #80deea;
                                }
                            }
                        }
                    }

                    .list {
                        display: flex;
                        gap: 40px;
                        margin-top: 40px;
                        justify-content: center;

                        .item {
                            width: 360px;
                            height: 90px;
                            text-decoration: none;
                            background: linear-gradient(180deg, #fff, #d8f2e4);
                            box-shadow: 0 10px 20px rgba(116, 129, 52, 0.5);
                            border-radius: 8px;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            position: relative;
                            transition: all 0.2s ease;

                            &:hover {
                                transform: translateY(-2px);
                            }

                            //align-items: center;

                            .list-title {
                                font-size: 16px;
                                font-weight: 600;
                                color: #375c48;
                                line-height: 16px;
                                margin-left: 30px;
                            }

                            .list-sub {
                                margin-top: 10px;
                                font-size: 12px;
                                color: #3abd79;
                                line-height: 12px;
                                margin-left: 30px;
                            }

                            img {
                                position: absolute;
                                top: 13px;
                                right: 30px;
                                width: 64px;
                                height: 64px;
                                object-fit: contain;
                            }

                        }
                    }
                }

            }


            .content-body {
                margin-top: 30px;

                .search {
                    position: relative;
                    height: 60px;
                    margin-bottom: 10px;

                    :deep(.el-input__wrapper) {
                        position: absolute;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 40%;
                        height: 40px;
                        border-radius: 20px;
                    }
                }

                .diver {
                    .line {
                        border-bottom: 1px solid rgb(94, 98, 101);
                    }
                }

                .HotCity {
                    padding: 0 100px;
                    margin-top: 30px;

                    .el-row {
                        margin-bottom: 30px;

                        &:last-child {
                            margin-bottom: 60px;
                        }
                    }

                    .city-card {
                        border-radius: 20px;
                        overflow: hidden;
                        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
                        transition: all 0.3s ease;
                        background-color: #fff;
                        cursor: pointer;

                        &:hover {
                            transform: translateY(-5px);
                            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
                        }
                    }

                    .city-img {
                        position: relative;
                        height: 200px;
                        overflow: hidden;

                        .city-pic {
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                        }

                        .city-overlay {
                            position: absolute;
                            bottom: 0;
                            left: 0;
                            right: 0;
                            height: 60px;
                            background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
                        }
                    }

                    .city-info {
                        padding: 20px 15px;
                    }

                    .grid-content {
                        font-size: 20px;
                        font-weight: 600;
                        color: #333;
                        margin-bottom: 10px;
                        justify-content: flex-start;
                        padding: 0;
                        height: auto;
                    }

                    .city-desc-wrapper {
                        min-height: 50px;

                        .city-desc {
                            color: #666;
                            font-size: 14px;
                            line-height: 1.6;
                            display: -webkit-box;
                            line-clamp: 2;
                            -webkit-box-orient: vertical;
                            overflow: hidden;
                        }
                    }
                }
            }
        }

        .trip-footer-wrapper {
            .trip-footer {
                padding: 0 40px;
            }
        }
    }
}
</style>
