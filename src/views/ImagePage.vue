<template>
    <my-page title="图片原型工具">
        <section class="preview-box">
            <ul class="preview-list">
                <li class="item" v-for="page in pages" @click="selectPage(page)">
                    <img class="img" :src="page.image"/>
                </li>
            </ul>
            <a class="add" href="#">添加</a>
        </section>
        <section class="editor-box">
            <div>编辑模式</div>
            <div v-if="page">
                当前页面：{{ page.id }}
            </div>
            <div class="btns">
                <ui-raised-button class="btn" label="返回上一页" @click="back" :disable="!lastPageId" />
                <ui-raised-button class="btn" label="添加页面" @click="back" />
                <ui-raised-button class="btn" label="预览" @click="back" />
                <ui-raised-button class="btn" label="显示所有" @click="showAllPage" />
            </div>
            <div>返回上一页</div>
            <div class="page-editor"
                 @mousemove="onMouseMove"
                 v-if="page"
                 ref="editor"
                 :style="{width: options.width + 'px', height: options.height + 'px'}">
                <img :src="page.image"/>
                <div class="links">
                    <div class="link"
                       v-for="link in page.links"
                       @click.prevent="clickLink(link)"
                       :title="(link.title || '') + '（点击跳转到页面' + link.to + '）'"
                       href="#"
                         :class="{active: link.id === link.id }"
                         :style="{top: link.top + 'px',
                            left: link.left + 'px', width: link.width + 'px', height: link.height + 'px'}"></div>
                </div>
                <div class="tags" v-if="page.tags">
                    <div class="tag" href="#"
                       :title="tag.comment"
                       :style="{top: tag.top + 'px',
                            left: tag.left + 'px', width: 40 + 'px', height: 40 + 'px'}"
                        v-for="tag in page.tags">
                        <img src="/static/img/icon/tag.svg">
                    </div>
                </div>
            </div>
        </section>
        <div class="link-box">
            <div v-if="link">
                <div>
                    <ui-text-field v-model="link.title" label="链接文字" />
                </div>
                <div>
                    <ui-text-field v-model="link.to" label="跳转页面ID" />
                </div>
                <div>
                    <ui-text-field v-model="link.left" type="number" label="X" />
                </div>
                <div>
                    <ui-text-field v-model="link.top" type="number" label="Y" />
                </div>
                <div>
                    <ui-text-field v-model="link.width" type="number" label="宽" />
                </div>
                <div>
                    <ui-text-field v-model="link.height" type="number" label="高" />
                </div>
            </div>
        </div>
        <ui-article>
            http://img.zcool.cn/community/018fe956400ea732f87512f672b081.jpg

        </ui-article>
        <div class="all-box" v-if="allPageVisible">
            <ui-appbar title="所有界面"></ui-appbar>
            <ul class="all-list">
                <li class="item page-editor"
                    :id="'all-page-' + p.id"
                     @mousemove="onMouseMove"
                     ref="editor"
                    v-for="p in pages"
                     :style="{width: options.width + 'px', height: options.height + 'px'}">
                    <img :src="p.image"/>
                    <div class="links">
                        <a class="link"
                           v-for="link in p.links"
                           :title="(link.title || '') + '（点击跳转到页面' + link.to + '）'"
                           href="#" :style="{top: link.top + 'px',
                                left: link.left + 'px', width: link.width + 'px', height: link.height + 'px'}"></a>
                    </div>
                </li>
            </ul>
        </div>
    </my-page>
</template>

<script>
    export default {
        data () {
            return {
                mode: 'editor',
                input: '',
                result: '1',
                textFieldLabel: '标签',
                buttonLabel: '呵呵',
                options: {
                    width: 275,
                    height: 490
                },
                pages: [
                    {
                        id: '1',
                        title: '登录',
                        image: '/static/img/page_login.png',
                        links: [
                            {
                                title: '注册',
                                to: '2',
                                top: 0,
                                left: 200,
                                width: 100,
                                height: 100
                            },
                            {
                                title: '登录',
                                to: '3',
                                top: 189,
                                left: 24,
                                width: 220,
                                height: 40
                            }
                        ],
                        tags: [
                            {
                                id: '1',
                                top: 140,
                                left: 100,
                                comment: '密码不能小于 6 个字符，必须包含字母'
                            }
                        ]
                    },
                    {
                        id: '2',
                        title: '注册',
                        image: '/static/img/page_register.png',
                        links: [
                            {
                                title: '登录',
                                to: '1',
                                top: 0,
                                left: 0,
                                width: 100,
                                height: 100
                            }
                        ]
                    },
                    {
                        id: '3',
                        title: '首页',
                        image: '/static/img/page_home.png',
                        links: [
                            {
                                title: '登录',
                                to: '1',
                                top: 459,
                                left: 123,
                                width: 20,
                                height: 20
                            }
                        ]
                    },
                    {
                        id: '4',
                        title: '编辑',
                        image: '/static/img/page_add.png',
                        links: [
                            {
                                title: '返回',
                                to: '3',
                                top: 0,
                                left: 0,
                                width: 40,
                                height: 40
                            }
                        ]
                    }
                ],
                page: null,
                link: null,
                allPageVisible: false,
                lastPageId: null
            }
        },
        mounted() {
            this.init()
        },
        methods: {
            init() {
                this.page = this.pages[0]
                this.rederPage()
            },
            rederPage() {
            },
            selectPage(page) {
                this.page = page
            },
            clickLink(link) {
                if (this.mode === 'editor') {
                    this.link = link
                } else {
                    let id = link.to
                    console.log('跳转' + typeof id)
                    this.gotoPage(id)
                }
            },
            gotoPage(id) {
                for (let page of this.pages) {
                    console.log(page.id)
                    if (page.id === id) {
                        console.log('跳转')
                        this.lastPageId = thus.page.id
                        this.page = page
                    }
                }
            },
            click() {
                alert(1)
            },
            onMouseMove(e) {
                console.log(e)
                let rect = this.$refs.editor.getBoundingClientRect()
                let x = e.pageX - rect.left
                let y = e.pageY - rect.top
                console.log(x, y)
            },
            back() {
                if (this.lastPageId) {

                }
            },
            showAllPage() {
                this.allPageVisible = true
            }
        }
    }
</script>

<style lang="scss" scoped>
</style>
