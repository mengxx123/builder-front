<template>
    <my-page title="图片原型工具" :page="_page" :class="{'mode-preview': mode === 'preview'}">
        <section class="preview-box">
            <ul class="preview-list">
                <li class="item" v-for="p, index in pages" @click="setPage(p)"
                    :title="p.title"
                    :class="{active: page && p.id === page.id}">
                    <img class="img" :src="p.image"/>
                    <div class="footer">
                        <ui-icon-button class="btn" icon="close" slot="close" @click="removePage(p)" title="删除" />
                        <ui-icon-button class="btn" icon="content_copy" slot="close" @click="copyPage(p, index)" title="复制" />
                    </div>
                </li>
                <li class="item-add" @click="addPage" title="添加页面">
                    <ui-icon class="icon" value="add" size="48" color="#999" />
                </li>
            </ul>
            <ui-raised-button class="add" label="添加页面" @click="addPage" />
        </section>
        <section class="editor-box"
                 @drop="handleDrop($event)"
                 @dragover='allowDrop($event)'
                 @dragleave="handleDragLeave($event)"
                 @dragenter="handleDragEnter($event)">
            <div>{{ mode === 'edit' ? '编辑模式' : '预览模式' }}</div>
            <div v-if="page">
                <!--当前页面：{{ page.id }}-->
                <div>当前页面 ID：{{ page.id }}</div>
            </div>
            <div class="btns">
                <bar-menu label="文件">
                    <ui-menu>
                        <ui-menu-item title="新建" @click="newFile" leftIcon="add" />
                        <ui-menu-item title="保存" @click="saveFile" leftIcon="save" />
                        <!--<ui-menu-item title="下载" @click="download" leftIcon="file_downlaod" />-->
                        <ui-menu-item title="下载" @click="download" leftIcon="file" />
                    </ui-menu>
                </bar-menu>
                <bar-menu label="插入">
                    <ui-menu>
                        <!--<ui-menu-item title="图片" @click="newFile" leftIcon="add" />-->
                        <ui-menu-item title="图片" rightIcon="keyboard_arrow_right" leftIcon="photo">
                            <ui-menu-item title="从计算机中上传" leftIcon="file_upload" @click="showSearchBox" />
                            <ui-menu-item title="在网路上搜索" leftIcon="search" @click="showSearchBox" />
                            <ui-divider />
                            <ui-menu-item title="通过网址" leftIcon="link" @click="showUrlDialog" />
                        </ui-menu-item>
                        <!--<ui-menu-item title="下载" @click="download" leftIcon="file_downlaod" />-->
                    </ui-menu>
                </bar-menu>
                <bar-menu label="查看">
                    <ui-menu>
                        <ui-menu-item title="预览" @click="preview" leftIcon="remove_red_eye" />
                        <ui-menu-item title="显示所有" @click="showAllPage" leftIcon="save" />
                    </ui-menu>
                </bar-menu>
                <bar-menu label="工具">
                    <ui-menu>
                        <ui-menu-item title="偏好设置..." @click="showOption" leftIcon="settings" />
                    </ui-menu>
                </bar-menu>
                <bar-menu label="帮助">
                    <ui-menu>
                        <ui-menu-item title="帮助页面" to="/help" target="_blank" leftIcon="help" />
                    </ui-menu>
                </bar-menu>
                <ui-raised-button class="btn" label="返回上一页" @click="back" :disable="!lastPageId" />
                <ui-raised-button class="file-btn" label="从文件中导入">
                    <input type="file" class="ui-file-button" @change="fileChange($event, 1)">
                </ui-raised-button>
                <ui-raised-button class="file-btn" label="修改图片">
                    <input type="file" class="ui-file-button" @change="fileChange2($event, 1)">
                </ui-raised-button>
            </div>
            <div v-if="page">
                <ui-text-field v-model="page.title" label="页面标题" />
            </div>
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
                <div class="droping" v-if="droping">替换当前页面的图片</div>
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
                    <ui-raised-button class="btn" label="选择页面" @click="selectPage" />
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

        <ui-drawer class="search-box" right :open="searchBoxVisible" :docked="true" @close="closeSearchBox">
            <header class="search-appbar">
                <input class="input" placeholder="搜索图片" />
                <ui-icon-button icon="close" @click="searchBoxVisible = false" title="关闭“图片搜索”选择器" />
            </header>
            <img class="yunser" src="/static/img/yunser.svg">
            <div class="vip">仅对 VIP 用户开放</div>
        </ui-drawer>

        <ui-dialog :open="urlDialogVisible" title="插入图片" @close="hideUrlDialog">
            <ui-text-field v-model="url" hintText="粘贴图片的网址..." />
            <div>请仅选择您确认有权使用的图片。</div>
            <ui-flat-button slot="actions" @click="hideUrlDialog" primary label="取消"/>
            <ui-flat-button slot="actions" primary @click="inseartUrl" label="插入"/>
        </ui-dialog>
        <div class="display-box" v-if="displayBoxVisible">
            <ui-appbar title="预览">
                <ui-icon-button icon="close" slot="left" @click="closeDisplay" />
            </ui-appbar>
        </div>
        <ui-toast v-if="toast" :message="toastMessage" @close="hideToast"/>
        <div class="drop-box" v-if="false && droping"
             >
            <div class="bg"></div>
            <div class="area area-list"
                 @drop="handleDrop2($event)"
                 @dragover='allowDrop2($event)'
                 :class="{'over': dragOver}"
                >拖拽到这里添加新的页面</div>
            <div class="area area-page"
                 :class="{'over': dragOver}">拖拽到这里替换当前页面的图片</div>
        </div>
        <div class="display-box" v-if="selectPageBoxVisible">
            <ui-appbar title="选择页面">
                <ui-icon-button icon="close" slot="left" @click="selectPageBoxVisible = false" />
            </ui-appbar>
            <ul class="all-list2">
                <li class="item page-editor"
                    :id="'all-page-' + p.id"
                    ref="editor"
                    @click="setToPage(p)"
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
    const saveAs = window.saveAs

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
                toast: false,
                toastMessage: '',
                searchBoxVisible: false,
                url: 'http://img.zcool.cn/community/013ec857d149b10000018c1b7e7952.png@1280w_1l_2o_100sh.webp',
                urlDialogVisible: false,
                displayBoxVisible: false,
                droping: false,
                dragOver: false,
                dragOver2: false,
                selectPageBoxVisible: false,
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
        destroyed() {
            document.removeEventListener('keydown', this.onKeydown)
        },
        methods: {
            setToPage(page) {
                this.link.to = page.id
                this.selectPageBoxVisible = false
            },
            showToast(message) {
                this.toast = true
                this.toastMessage = message
                if (this.toastTimer) clearTimeout(this.toastTimer)
                this.toastTimer = setTimeout(() => { this.toast = false }, 2000)
            },
            hideToast() {
                this.toast = false
                if (this.toastTimer) clearTimeout(this.toastTimer)
            },
            init() {
                this.page = this.pages[0]
                this.rederPage()
                this.loadFile()
                document.addEventListener('keydown', this.onKeydown = e => {
                    e.preventDefault()
                    return this.keydown(e)
                })
            },
            keydown(e) {
                e.stopPropagation()
                e.preventDefault()
                event.returnValue = false
                console.log(e.keyCode)
                switch (e.keyCode) {
                    case 78: // n
                        console.log(e)
                        if (e.ctrlKey) {
                            alert(1)
                            this.newFile()
                        }
                        return false
                    case 83: // s
                        if (e.ctrlKey) {
                            this.saveFile()
                        }
                        return true
                    case 191: // help
                        if (e.shiftKey) {
                            window.open('/help')
                        }
                        return false
                }
            },
            rederPage() {
            },
            setPage(page) {
                this.page = page
            },
            selectPage() {
                this.selectPageBoxVisible = true
            },
            closeDisplay() {
                this.displayBoxVisible = false
                this.mode = 'edit'
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
                console.log('找到' + id)
                console.log(this.pages)
                let isFind = false
                for (let page of this.pages) {
                    console.log(page.id)
                    if (page.id === id) {
                        console.log('跳转')
                        this.lastPageId = this.page.id
                        this.page = page
                        isFind = true
                    }
                }
                if (!isFind) {
                    this.showToast('找不到页面')
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
                let rect = this.$refs.editor.getBoundingClientRect()
                let x = e.pageX - rect.left
                let y = e.pageY - rect.top
                if (this.mode === 'edit' && this.isMouseDown) {
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
                let rect = this.$refs.editor.getBoundingClientRect()
                let x = e.pageX - rect.left
                let y = e.pageY - rect.top
                this.isMouseDown = true
                this.mouseDownX = x
                this.mouseDownY = y
                return false
            },
            onMouseUp(e) {
                let rect = this.$refs.editor.getBoundingClientRect()
                let x = e.pageX - rect.left
                let y = e.pageY - rect.top

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
                console.log(this.pages.length)
                if (this.pages.length) {
                    this.page = this.pages[0] // TODO
                    console.log(this.pages[0])
                } else {
                    console.log('奇怪了')
                    this.page = null // TODO 页面还是存在
                }
            },
            copyPage(page, index) {
                // TODO
//                let newPage = {
//                }
                this.pages.splice(index, 0, page)
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
                this.displayBoxVisible = true
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
                this.showToast('本地保存成功')
            },
            loadFile() {
                let saveObj = this.$storage.get('tempData')
                if (saveObj) {
                    this.pages = saveObj.pages
                    if (this.pages.length) {
                        this.page = this.pages[0]
                    } else {
                        this.page = null
                    }
                }
            },
            download() {
                // TODO refactor
                let saveObj = {
                    version: '1.0.0',
                    pages: this.pages
                }
                let json = JSON.stringify(saveObj)
                let blob = new Blob([json], {type: 'application/json;charset=utf-8'})
                saveAs(blob, '未命名' + '.json')
            },
            fileChange(e, left) {
                let file = e.target.files[0]
//                    var f_name = file.name;
//                    var f_type = f_name.substring(f_name.lastIndexOf("."))
                let reader = new FileReader()
                reader.onload = e => {
                    let content = e.target.result
                    let saveObj = JSON.parse(content)
                    if (saveObj) {
                        this.pages = saveObj.pages
                    }
                }
                reader.readAsText(file, 'utf-8')
            },
            fileChange2(e, left) {
                let file = e.target.files[0]
                if (!e.target.files.length) {
                    return
                }
                let reader = new FileReader()
                reader.onload = e => {
                    let dataUrl = e.target.result
                    this.page.image = dataUrl
                }
                reader.readAsDataURL(file)
            },
            setImage() {
            },
            showSearchBox() {
                this.searchBoxVisible = true
            },
            closeSearchBox() {
                this.searchBoxVisible = false
            },
            showUrlDialog() {
                this.urlDialogVisible = true
            },
            hideUrlDialog() {
                this.urlDialogVisible = false
            },
            inseartUrl() {
                this.page.image = this.url
                this.urlDialogVisible = false
            },
            // drag and drop
            handleDragEnter(e) {
                console.log('进入')
                console.log(this)
                e.preventDefault()
            },
            handleDragLeave(e) {
                console.log('离开')
                this.droping = false
                this.dragOver = false
                e.preventDefault()
            },
            handleDrop(e) {
                let _e = e
                this.droping = false
                this.dragOver = false
                let files = e.dataTransfer.files
                if (!files.length) {
                    return
                }
                let file = files[0]
                console.log(_e)
                if (file.type.includes('image')) {
                    // TODO
                    let reader = new FileReader()
                    reader.onload = e => {
                        let dataUrl = e.target.result
                        if (_e.shiftKey) {
                            this.pages.push({
                                id: new Date().getTime(),
                                title: '未命名',
                                image: dataUrl,
                                links: []
                            })
                        } else {
                            this.page.image = dataUrl
                        }
                    }
                    reader.readAsDataURL(file)
                } else {
                    // TODO
                    let reader = new FileReader()
                    reader.onload = e => {
                        let content = e.target.result
                        let saveObj = JSON.parse(content)
                        if (saveObj) {
                            this.pages = saveObj.pages
                        }
                    }
                    reader.readAsText(file, 'utf-8')
                }
                e.preventDefault()
                return true
            },
            allowDrop(e) {
                this.droping = true
                this.dragOver = true
                e.preventDefault()
                return true
            },
            handleDrop2(e) {
//                this.droping = false
//                this.dragOver2 = false
//                let files = e.dataTransfer.files
//                if (!files.length) {
//                    return
//                }
//                let file = files[0]
//                if (file.type.includes('image')) {
//                    // TODO
//                    let reader = new FileReader()
//                    reader.onload = e => {
//                        let dataUrl = e.target.result
//                        this.page.image = dataUrl
//                    }
//                    reader.readAsDataURL(file)
//                }
//                e.preventDefault()
            },
            allowDrop2(e) {
//                this.dragOver2 = true
//                e.preventDefault()
            }
        }
    }
</script>

<style lang="scss" scoped>
</style>
