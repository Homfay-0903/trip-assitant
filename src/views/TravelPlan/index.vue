<template>
    <div class="trip-container">
        <header class="trip-header-wrapper">
            <div class="trip-header">
                <div class="trip-header-nav-wrapper">
                    <div class="trip-logo">
                        <img src="../../assets/vue.svg" alt="">
                    </div>
                    <div class="trip-nav">
                        <span class="nav-span">目的地</span>
                        <span class="nav-span">旅行助手</span>
                    </div>
                </div>
                <div class="trip-header-user-wrapper">
                    <span class="login">登录/注册</span>
                </div>
            </div>
        </header>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.trip-container {
    position: fixed;
    z-index: 1000;
    width: 100%;

    .trip-header-wrapper {
        background: #80deea;

        .trip-header {
            display: flex;
            justify-content: space-between;

            .trip-header-nav-wrapper {
                display: flex;
                justify-content: center;
                align-items: center;

                img {
                    width: 50px;
                    height: 50px;
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
                        cursor: pointer;
                    }
                }
            }

            .trip-header-user-wrapper {
                display: flex;
                justify-content: center;
                align-items: center;

                .login {
                    margin-right: 10px;
                    cursor: pointer;
                }
            }
        }
    }

}

//手机
@media (max-width: 767px) {}

//平板
@media (min-width: 768px) and (max-width: 1024px) {}

//桌面
@media (min-width: 1024px) {}
</style>