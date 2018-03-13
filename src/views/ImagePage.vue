<template>
    <my-page title="图片原型工具" :page="_page">
        <section class="preview-box">
            <ul class="preview-list">
                <li class="item" v-for="p in pages" @click="setPage(p)"
                    :title="p.title"
                    :class="{active: page && p.id === page.id}">
                    <img class="img" :src="p.image"/>
                    <div class="footer">
                        <ui-icon-button class="btn" icon="close" slot="close" @click="removePage(p)" title="删除" />
                    </div>
                </li>
                <li class="item-add" @click="addPage" title="添加页面">
                    <ui-icon class="icon" value="add" size="48" color="#999" />
                </li>
            </ul>
            <ui-raised-button class="add" label="添加页面" @click="addPage" />
        </section>
        <section class="editor-box">
            <div>{{ mode === 'edit' ? '编辑模式' : '预览模式' }}</div>
            <div v-if="page">
                <!--当前页面：{{ page.id }}-->
                <div>当前页面 ID：{{ page.id }}</div>
            </div>
            <div class="btns">
                <ui-raised-button class="btn" label="返回上一页" @click="back" :disable="!lastPageId" />
                <ui-raised-button class="btn" label="新建" @click="newFile" />
                <ui-raised-button class="btn" label="保存" @click="saveFile" />
                <ui-raised-button class="btn" label="预览" @click="preview" />
                <ui-raised-button class="btn" label="显示所有" @click="showAllPage" />
                <ui-raised-button class="btn" label="设置" @click="showOption" />
            </div>
            <div>返回上一页</div>
            <div v-if="!page">
                <div>请在左侧预览列表中选择页面进行编辑</div>
            </div>
            <div class="page-editor"
                 @mousemove="onMouseMove"
                 @mousedown="onMouseDown"
                 @mouseup="onMouseUp"
                 v-if="page"
                 ref="editor"
                 :style="{width: options.width + 'px', height: options.height + 'px'}">
                <div class="img-wrap">
                    <img :src="page.image"/>
                </div>
                <div class="mask"></div>
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
                <div class="temp-link"
                     v-if="tempLink.visible"
                     :style="{top: tempLink.top + 'px', left: tempLink.left + 'px', width: tempLink.width + 'px', height: tempLink.height + 'px'}"></div>
            </div>
            <div class="save-box" v-if="false">
                <ui-circular-progress :size="24"/>
                <div class="text">正在保存</div>
            </div>
        </section>
        <div class="link-box">
            <div v-if="link">
                <div>
                    <ui-text-field v-model="link.title" label="链接文字" />
                </div>
                <div>
                    <ui-text-field v-model="link.to" label="跳转页面ID" />
                    <ui-raised-button class="btn" label="删除" @click="selectPage" />
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
                <ui-raised-button class="btn" label="删除" @click="removeLink" />
            </div>
        </div>
        <div class="all-box" v-if="allPageVisible">
            <ui-appbar title="所有界面">
                <ui-icon-button icon="close" slot="left" @click="allPageVisible = false" />
            </ui-appbar>
            <ul class="all-list">
                <li class="item page-editor"
                    :id="'all-page-' + p.id"
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
        <ui-drawer right :open="optionVisible" :docked="false" @close="closeOption()">
            <ui-appbar title="设置">
                <ui-icon-button icon="close" slot="left" @click="optionVisible = false" />
            </ui-appbar>
            <ui-list>
                <ui-list-item title="Menu Item 1"/>
                <ui-list-item title="Menu Item 2"/>
                <ui-list-item title="Menu Item 3"/>
            </ui-list>
        </ui-drawer>
    </my-page>
</template>

<script>
    export default {
        data () {
            return {
                mode: 'edit',
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
                                id: '1',
                                title: '注册',
                                to: '2',
                                top: 0,
                                left: 200,
                                width: 100,
                                height: 100
                            },
                            {
                                id: '2',
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
                                id: '3',
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
                                id: '4',
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
                                id: '5',
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
                lastPageId: null,
                tempLink: {
                    visible: false,
                    top: 20,
                    left: 20,
                    width: 40,
                    height: 40
                },
                //
                optionVisible: false,
                _page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'settings',
                            click: this.showOption
                        }
                    ]
                }
            }
        },
        mounted() {
            this.init()
        },
        methods: {
            init() {
                this.page = this.pages[0]
                this.rederPage()
                this.loadFile()
            },
            rederPage() {
            },
            setPage(page) {
                this.page = page
            },
            selectPage() {
            },
            clickLink(link) {
                if (this.mode === 'edit') {
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
                        this.lastPageId = this.page.id
                        this.page = page
                    }
                }
            },
            click() {
                alert(1)
            },
            addPage() {
                 this.pages.push({
                     id: new Date().getTime(),
                     title: '未命名',
                     image: '/static/img/page_long.jpg',
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
                 })
            },
            onMouseMove(e) {
                console.log(e)
                let rect = this.$refs.editor.getBoundingClientRect()
                let x = e.pageX - rect.left
                let y = e.pageY - rect.top
                console.log(x, y)
                if (this.isMouseDown) {
                    let top = Math.min(this.mouseDownY, y)
                    let left = Math.min(this.mouseDownX, x)
                    let width = Math.abs(this.mouseDownX - x)
                    let height = Math.abs(this.mouseDownY - y)
                    this.tempLink = {
                        visible: true,
                        top: top,
                        left: left,
                        width: width,
                        height: height
                    }
                    this.isMouseDrag = true
                }
                return false
            },
            onMouseDown(e) {
                console.log(e)
                let rect = this.$refs.editor.getBoundingClientRect()
                let x = e.pageX - rect.left
                let y = e.pageY - rect.top
                console.log(x, y)
                this.isMouseDown = true
                this.mouseDownX = x
                this.mouseDownY = y
                return false
            },
            onMouseUp(e) {
                console.log(e)
                let rect = this.$refs.editor.getBoundingClientRect()
                let x = e.pageX - rect.left
                let y = e.pageY - rect.top
                console.log(x, y)

                this.isMouseDown = false
                if (this.isMouseDrag) {
                    this.isMouseDrag = false
                    this.tempLink.visible = false
                    let top = Math.min(this.mouseDownY, y)
                    let left = Math.min(this.mouseDownX, x)
                    let width = Math.abs(this.mouseDownX - x)
                    let height = Math.abs(this.mouseDownY - y)
                    this.page.links.push({
                        id: new Date().getTime(),
                        title: '未命名',
                        to: '',
                        top: top,
                        left: left,
                        width: width,
                        height: height
                    })
                }
                return false
            },
            back() {
                if (this.lastPageId) {
                    this.gotoPage(this.lastPageId)
                }
            },
            showAllPage() {
                this.allPageVisible = true
            },
            showOption() {
                this.optionVisible = true
            },
            removePage(page) {
                for (let i = 0; i < this.pages.length; i++) {
                    if (this.pages[i].id === page.id) {
                        this.pages.splice(i, 1)
                        break
                    }
                }
                if (this.pages.length) {
                    this.page = this.pages[0] // TODO
                } else {
                    this.page = null
                }
            },
            closeOption() {
                this.optionVisible = false
            },
            removeLink() {
                for (let i = 0; i < this.page.links.length; i++) {
                    if (this.page.links[i].id === this.link.id) {
                        this.page.links.splice(i, 1)
                        this.link = null
                        break
                    }
                }
            },
            preview() {
                this.mode = 'preview'
            },
            newFile() {
                this.pages = []
                this.page = null
            },
            saveFile() {
                let saveObj = {
                    version: '1.0.0',
                    pages: this.pages
                }
                this.$storage.set('tempData', saveObj)
            },
            loadFile() {
                let saveObj = this.$storage.get('tempData')
                if (saveObj) {
                    this.pages = saveObj.pages
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
</style>
