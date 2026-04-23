const local: App.I18n.Schema = {
  system: {
    title: '反馈中心',
    updateTitle: '系统版本更新通知',
    updateContent: '检测到系统有新版本发布，是否立即刷新页面？',
    updateConfirm: '立即刷新',
    updateCancel: '稍后再说'
  },
  common: {
    action: '操作',
    add: '新增',
    addSuccess: '添加成功',
    backToHome: '返回首页',
    batchDelete: '批量删除',
    cancel: '取消',
    close: '关闭',
    check: '勾选',
    selectAll: '全选',
    expandColumn: '展开列',
    columnSetting: '列设置',
    config: '配置',
    confirm: '确认',
    delete: '删除',
    deleteSuccess: '删除成功',
    confirmDelete: '确认删除吗？',
    edit: '编辑',
    warning: '警告',
    error: '错误',
    index: '序号',
    keywordSearch: '请输入关键词搜索',
    logout: '退出登录',
    logoutConfirm: '确认退出登录吗？',
    lookForward: '敬请期待',
    modify: '修改',
    modifySuccess: '修改成功',
    noData: '无数据',
    operate: '操作',
    pleaseCheckValue: '请检查输入的值是否合法',
    refresh: '刷新',
    reset: '重置',
    search: '搜索',
    switch: '切换',
    tip: '提示',
    trigger: '触发',
    update: '更新',
    updateSuccess: '更新成功',
    userCenter: '个人中心',
    yesOrNo: {
      yes: '是',
      no: '否'
    }
  },
  request: {
    logout: '请求失败后登出用户',
    logoutMsg: '用户状态失效，请重新登录',
    logoutWithModal: '请求失败后弹出模态框再登出用户',
    logoutWithModalMsg: '用户状态失效，请重新登录',
    refreshToken: '请求的token已过期，刷新token',
    tokenExpired: 'token已过期'
  },
  theme: {
    themeDrawerTitle: '主题配置',
    tabs: {
      appearance: '外观',
      layout: '布局',
      general: '通用',
      preset: '预设'
    },
    appearance: {
      themeSchema: {
        title: '主题模式',
        light: '亮色模式',
        dark: '暗黑模式',
        auto: '跟随系统'
      },
      grayscale: '灰色模式',
      colourWeakness: '色弱模式',
      themeColor: {
        title: '主题颜色',
        primary: '主色',
        info: '信息色',
        success: '成功色',
        warning: '警告色',
        error: '错误色',
        followPrimary: '跟随主色'
      },
      themeRadius: {
        title: '主题圆角'
      },
      recommendColor: '应用推荐算法的颜色',
      recommendColorDesc: '推荐颜色的算法参照',
      preset: {
        title: '主题预设',
        apply: '应用',
        applySuccess: '预设应用成功',
        default: {
          name: '默认预设',
          desc: '反馈系统默认蓝色主题预设'
        },
        dark: {
          name: '暗色预设',
          desc: '适用于夜间使用的暗色主题预设'
        },
        compact: {
          name: '紧凑型',
          desc: '适用于小屏幕的紧凑布局预设'
        },
        azir: {
          name: 'Azir的预设',
          desc: '是 Azir 比较喜欢的莫兰迪色系冷淡风'
        }
      }
    },
    layout: {
      layoutMode: {
        title: '布局模式',
        vertical: '左侧菜单模式',
        'vertical-mix': '左侧菜单混合模式',
        'vertical-hybrid-header-first': '左侧混合-顶部优先',
        horizontal: '顶部菜单模式',
        'top-hybrid-sidebar-first': '顶部混合-侧边优先',
        'top-hybrid-header-first': '顶部混合-顶部优先',
        vertical_detail: '左侧菜单布局，菜单在左，内容在右。',
        'vertical-mix_detail': '左侧双菜单布局，一级菜单在左侧深色区域，二级菜单在左侧浅色区域。',
        'vertical-hybrid-header-first_detail':
          '左侧混合布局，一级菜单在顶部，二级菜单在左侧深色区域，三级菜单在左侧浅色区域。',
        horizontal_detail: '顶部菜单布局，菜单在顶部，内容在下方。',
        'top-hybrid-sidebar-first_detail': '顶部混合布局，一级菜单在左侧，二级菜单在顶部。',
        'top-hybrid-header-first_detail': '顶部混合布局，一级菜单在顶部，二级菜单在左侧。'
      },
      tab: {
        title: '标签栏设置',
        visible: '显示标签栏',
        cache: '标签栏信息缓存',
        cacheTip: '离开页面后仍然保留标签栏信息',
        height: '标签栏高度',
        mode: {
          title: '标签栏风格',
          slider: '滑块风格',
          chrome: '谷歌风格',
          button: '按钮风格'
        },
        closeByMiddleClick: '鼠标中键关闭标签页',
        closeByMiddleClickTip: '启用后可以使用鼠标中键点击标签页进行关闭'
      },
      header: {
        title: '头部设置',
        height: '头部高度',
        breadcrumb: {
          visible: '显示面包屑',
          showIcon: '显示面包屑图标'
        }
      },
      sider: {
        title: '侧边栏设置',
        inverted: '深色侧边栏',
        width: '侧边栏宽度',
        collapsedWidth: '侧边栏折叠宽度',
        mixWidth: '混合布局侧边栏宽度',
        mixCollapsedWidth: '混合布局侧边栏折叠宽度',
        mixChildMenuWidth: '混合布局子菜单宽度',
        autoSelectFirstMenu: '自动选择第一个子菜单',
        autoSelectFirstMenuTip: '点击一级菜单时，自动选择并导航到第一个子菜单的最深层级'
      },
      footer: {
        title: '底部设置',
        visible: '显示底部',
        fixed: '固定底部',
        height: '底部高度',
        right: '底部居右'
      },
      content: {
        title: '内容区域设置',
        scrollMode: {
          title: '滚动模式',
          tip: '主题滚动仅 main 部分滚动，外层滚动可携带头部底部一起滚动',
          wrapper: '外层滚动',
          content: '主体滚动'
        },
        page: {
          animate: '页面切换动画',
          mode: {
            title: '页面切换动画类型',
            'fade-slide': '滑动',
            fade: '淡入淡出',
            'fade-bottom': '底部消退',
            'fade-scale': '缩放消退',
            'zoom-fade': '渐变',
            'zoom-out': '闪现',
            none: '无'
          }
        },
        fixedHeaderAndTab: '固定头部和标签栏'
      }
    },
    general: {
      title: '通用设置',
      watermark: {
        title: '水印设置',
        visible: '显示全屏水印',
        text: '自定义水印文本',
        enableUserName: '启用用户名水印',
        enableTime: '显示当前时间',
        timeFormat: '时间格式'
      },
      multilingual: {
        title: '多语言设置',
        visible: '显示多语言按钮'
      },
      globalSearch: {
        title: '全局搜索设置',
        visible: '显示全局搜索按钮'
      }
    },
    configOperation: {
      copyConfig: '复制配置',
      copySuccessMsg: '复制成功，请替换 src/theme/settings.ts 中的变量 themeSettings',
      resetConfig: '重置配置',
      resetSuccessMsg: '重置成功'
    }
  },
  route: {
    login: '登录',
    403: '无权限',
    404: '页面不存在',
    500: '服务器错误',
    admin: '管理后台',
    admin_feedback: '反馈管理',
    admin_feedback_forms: '反馈列表',
    admin_users: '用户管理',
    admin_users_list: '用户列表',
    feedback: '反馈中心',
    feedbackmanage: '反馈管理',
    feedbackmanage_list: '反馈列表',
    'iframe-page': '外链页面',
    home: '首页',
    usermanage: '用户管理',
    usermanage_list: '用户列表'
  },
  page: {
    login: {
      common: {
        loginOrRegister: '登录 / 注册',
        userNamePlaceholder: '请输入用户名',
        phonePlaceholder: '请输入手机号',
        codePlaceholder: '请输入验证码',
        passwordPlaceholder: '请输入密码',
        confirmPasswordPlaceholder: '请再次输入密码',
        codeLogin: '验证码登录',
        confirm: '确定',
        back: '返回',
        validateSuccess: '验证成功',
        loginSuccess: '登录成功',
        welcomeBack: '欢迎回来，{userName} ！'
      },
      pwdLogin: {
        title: '密码登录',
        rememberMe: '记住我',
        forgetPassword: '忘记密码？',
        forgetPasswordNotice: '如需重置密码，请联系 HR 或管理员处理。',
        register: '注册账号',
        otherAccountLogin: '其他账号登录',
        otherLoginMode: '其他登录方式',
        superAdmin: '超级管理员',
        admin: '管理员',
        user: '普通用户'
      },
      codeLogin: {
        title: '验证码登录',
        getCode: '获取验证码',
        reGetCode: '{time}秒后重新获取',
        sendCodeSuccess: '验证码发送成功',
        imageCodePlaceholder: '请输入图片验证码'
      },
      register: {
        title: '注册账号',
        agreement: '我已经仔细阅读并接受',
        protocol: '《用户协议》',
        policy: '《隐私权政策》'
      },
      resetPwd: {
        title: '重置密码'
      },
      bindWeChat: {
        title: '绑定微信'
      }
    },
    home: {
      branchDesc: '这个工作台主要用于公司内部反馈流程，集中查看表单、回复情况和团队反馈动态。',
      greeting: '早安，{userName}，这里是今天的反馈工作台概览。',
      weatherDesc: '你可以在这里查看开放表单、回复进度和团队反馈状态。',
      projectCount: '进行中项目',
      todo: '待办',
      message: '未读消息',
      downloadCount: '导出次数',
      registerCount: '参与人数',
      schedule: '团队安排',
      study: '学习',
      work: '工作',
      rest: '休息',
      entertainment: '娱乐',
      visitCount: '访问量',
      turnover: '成交额',
      dealCount: '成交量',
      projectNews: {
        title: '项目动态',
        moreNews: '更多动态',
        desc1: '员工满意度调查已经面向产品与设计团队开放填写。',
        desc2: '针对 onboarding 问题的跟进表单已经创建，方便继续收集细节反馈。',
        desc3: '管理员侧的回复趋势统计已经可以用于内部复盘。',
        desc4: '反馈系统界面已切换为更浅的蓝色主视觉风格。',
        desc5: 'public 和 admin 页面的加载、空状态和报错提示已完成一轮整理。'
      },
      creativity: '创意'
    },
    feedback: {
      heroTag: '公司内部反馈',
      heroTitle: '反馈中心',
      heroDescription: '提交建议、参与内部事项反馈，并为日常流程、文化建设和团队活动填写反馈表单。',
      filterAllForms: '全部表单',
      filterNormalCase: '普通类型',
      filterSpecialCase: '特殊类型',
      adminPortal: '管理后台',
      changePassword: '修改密码',
      changePasswordSuccessTitle: '密码已更新',
      changePasswordSuccessContent: '你的密码已经更新成功。',
      login: '登录',
      logout: '退出登录',
      anonymousSubmit: '匿名提交',
      anonymousSubmitHint: '在反馈结果中隐藏你的姓名',
      perFormAnonymousHint: '每个表单可单独设置，互不影响。',
      browseForms: '浏览表单',
      searchPlaceholder: '搜索表单标题、描述或标签',
      writeFeedback: '填写反馈',
      loginToSubmit: '登录后提交',
      clearFilters: '清空筛选',
      retry: '重试',
      changePasswordComingSoon: '修改密码流程稍后接入。',
      formDetailNotReady: '表单详情暂时不可用。',
      loadFormsError: '暂时无法加载反馈表单。',
      filteredEmpty: '当前筛选条件下没有可用的反馈表单。',
      empty: '当前暂无可填写的反馈表单。',
      submitSuccessTitle: '反馈已提交',
      submitSuccessAnonymous: '你的匿名反馈已经记录成功。',
      submitSuccessNamed: '你的反馈已经记录成功。',
      submitUpdatedTitle: '反馈已更新',
      submitUpdatedAnonymous: '你的匿名提交已更新。',
      submitUpdatedNamed: '你的提交已更新。',
      submitFailed: '提交反馈失败。',
      changePasswordModal: {
        title: '修改密码',
        currentPassword: '当前密码',
        newPassword: '新密码',
        confirmPassword: '确认新密码',
        currentPasswordPlaceholder: '请输入当前密码',
        newPasswordPlaceholder: '请输入新密码',
        confirmPasswordPlaceholder: '请再次输入新密码',
        submit: '更新密码'
      },
      summary: {
        openForms: '开放表单',
        openFormsHint: '当前员工可见的表单',
        specialCases: '特殊表单',
        specialCasesHint: '带结束时间的表单',
        totalResponses: '总回复数',
        totalResponsesHint: '当前可见表单的提交总数'
      },
      shared: {
        caseType: {
          all: '全部',
          normal: '普通',
          special: '特殊'
        },
        mode: {
          anonymousEnabled: '已启用匿名',
          standardSubmit: '标准提交'
        },
        labels: {
          responses: '回复数',
          dateRange: '时间范围',
          availability: '开放状态',
          estimatedTime: '预计耗时',
          submissionMode: '提交方式',
          questions: '题目数',
          estimated: '预计'
        },
        units: {
          min: '分钟',
          questions: '{count} 题',
          responsesSubmitted: '已提交 {count} 份',
          itemsMatched: '匹配 {count} 项',
          writtenResponses: '{count} 条文字回答',
          sampleResponses: '{count} 份样本回答',
          responsesCount: '{count} 份回答',
          selectionsCount: '{count} 次选择',
          ratingsCountAverage: '{count} 次评分 · 平均 {average}/5'
        },
        state: {
          enabled: '启用',
          disabled: '停用',
          active: '启用中',
          upcoming: '未开始',
          ongoing: '进行中',
          endingSoon: '即将结束',
          expired: '已结束'
        },
        date: {
          alwaysOpen: '长期开放'
        },
        availability: {
          permanent: '长期有效',
          endsToday: '今天结束',
          daysLeft: '剩余 {count} 天'
        }
      }
    },
    feedbackManage: {
      title: '反馈管理',
      description: '在一个管理页面中统一管理反馈项目、表单可见性和回复查看。',
      filters: '筛选条件',
      feedbackList: '反馈列表',
      viewDashboard: '查看概览',
      createForm: '新建表单',
      viewDashboardComingSoon: '概览指标功能可在下一步接入。',
      searchPlaceholder: '搜索标题、描述或标签',
      selectCase: '选择类型',
      selectStatus: '选择状态',
      selectDateRange: '选择日期范围',
      applyFilters: '应用筛选',
      clearFilters: '清空筛选',
      retry: '重试',
      loadError: '暂时无法加载反馈表单。',
      filteredEmpty: '当前筛选条件下没有匹配的反馈表单。',
      empty: '当前还没有创建任何反馈表单。',
      loadFormDetailFailed: '加载表单详情失败。',
      updateStatusFailed: '更新表单状态失败。',
      exportComingSoon: '“{title}” 的导出功能会在 API 就绪后接入。',
      saveFailed: '保存反馈表单失败。',
      saveCreated: '已创建“{title}”。',
      saveUpdated: '已更新“{title}”。',
      toggleSuccess: '“{title}” 当前状态为 {status}。',
      summary: {
        totalForms: '表单总数',
        totalFormsHint: '当前工作区中的全部表单',
        enabledForms: '启用表单',
        enabledFormsHint: '当前员工可填写的表单',
        endingSoon: '即将结束',
        endingSoonHint: '将在 2 天内结束的表单',
        totalResponses: '总回复数',
        totalResponsesHint: '所有反馈表单的累计回复'
      },
      columns: {
        no: '序号',
        form: '表单',
        case: '类型',
        status: '状态',
        dateRange: '时间范围',
        responses: '回复数',
        action: '操作'
      },
      actions: {
        edit: '编辑',
        responses: '查看回复',
        disable: '停用',
        enable: '启用',
        export: '导出'
      }
    },
    userManage: {
      title: '用户管理',
      description: '管理内部反馈系统的登录账号，并控制不同角色可访问的管理权限。',
      addAccount: '新增账号',
      addUser: '新增用户',
      placeholder: '当前页面还是前端占位版本。`Super` 可以创建和编辑所有角色账号，`Admin` 只能创建和编辑 `User` 账号。',
      permissionNotice: 'Super 可以创建和编辑所有角色账号，Admin 只能创建和编辑普通用户账号。',
      userList: '用户列表',
      searchPlaceholder: '按用户名或显示名称搜索',
      filterByRole: '按角色筛选',
      currentUser: '当前用户',
      loadFailed: '加载用户失败。',
      saveFailed: '保存用户失败。',
      onlySuperEditAdmin: '只有 Super 可以编辑 Admin 或 Super 账号。',
      adminOnlyCommonUsers: 'Admin 只能创建或编辑普通用户账号。',
      targetMissing: '选中的用户记录已不存在。',
      createSuccess: '已创建 {role} 账号“{userName}”。',
      updateSuccess: '已更新“{userName}”。',
      modalAddTitle: '新增账号',
      modalEditTitle: '编辑账号',
      fields: {
        userName: '用户名',
        displayName: '显示名称',
        role: '角色',
        password: '密码',
        status: '状态'
      },
      placeholders: {
        userName: '请输入用户名',
        displayName: '请输入显示名称',
        role: '请选择角色',
        password: '请输入密码',
        passwordOptional: '留空则保留当前密码'
      },
      validation: {
        userNameRequired: '请输入用户名',
        displayNameRequired: '请输入显示名称',
        roleRequired: '请选择角色',
        passwordRequired: '请输入密码',
        passwordInvalid: '密码至少需要 6 个字符'
      },
      summary: {
        totalAccounts: '账号总数',
        totalAccountsHint: '当前工作区可见的全部账号',
        adminAccounts: '管理员账号',
        adminAccountsHint: '包含由 Super 管理的反馈管理员',
        commonUsers: '普通用户',
        commonUsersHint: '可以提交反馈表单的员工账号',
        activeAccounts: '启用账号',
        activeAccountsHint: '当前允许登录的账号数量'
      },
      columns: {
        user: '用户',
        role: '角色',
        status: '状态',
        created: '创建信息',
        action: '操作'
      },
      roles: {
        super: '超级管理员',
        admin: '管理员',
        user: '普通用户'
      }
    },
    feedbackForm: {
      builder: {
        createTitle: '新建反馈表单',
        editTitle: '编辑反馈表单',
        formSettings: '表单设置',
        formTitle: '表单标题',
        status: '状态',
        description: '描述',
        startDate: '开始日期',
        endDate: '结束日期',
        estimatedMinutes: '预计耗时',
        tags: '标签',
        questions: '题目设置',
        addQuestion: '新增题目',
        questionTitle: '题目标题',
        questionType: '题目类型',
        questionDescription: '题目描述',
        optionalHelperText: '可选辅助说明',
        required: '必填',
        deleteQuestion: '删除题目',
        options: '选项',
        addOption: '新增选项',
        optionLabel: '选项名称',
        remove: '移除',
        starHint: '评分题会收集星级结果，并在后续展示统计汇总。',
        saveForm: '保存表单',
        atLeastOneQuestion: '至少需要保留一个题目。',
        formTitleRequired: '表单标题不能为空。',
        questionTitleRequired: '每个题目都需要填写标题。',
        choiceOptionsRequired: '选择题至少需要两个已填写的选项。',
        questionPrefix: '题目 {index}',
        placeholders: {
          formTitle: '请输入表单标题',
          description: '请输入描述',
          questionTitle: '请输入题目标题'
        },
        questionTypes: {
          text: '文本',
          singleChoice: '单选',
          multipleChoice: '多选',
          star: '评分'
        }
      },
      submit: {
        fallbackTitle: '反馈表单',
        title: '提交反馈',
        required: '必填',
        writeAnswer: '请输入你的回答',
        submitButton: '提交反馈',
        updateButton: '更新反馈',
        completeQuestion: '请完成“{title}”。'
      },
      response: {
        fallbackTitle: '回复统计',
        summaryTab: '汇总',
        questionTab: '按题目查看',
        individualTab: '逐份查看',
        summary: {
          totalResponsesHint: '当前表单的提交总数',
          sampleLoaded: '已加载样本',
          sampleLoadedHint: '当前原型中使用的样本回复',
          anonymous: '匿名回复',
          anonymousHint: '未公开身份提交的回复数',
          sampleCoverage: '样本覆盖率',
          sampleCoverageHint: '样本回复与总回复数的对比'
        },
        anonymousResponse: '匿名回复',
        unknownUser: '未知用户',
        noResponsesYet: '暂无回复',
        noAnswer: '未作答',
        noData: '暂无数据',
        empty: '空',
        noSampleResponses: '当前表单还没有样本回复。',
        topAnswer: '最高频答案：{label}（{count}）',
        mostSelected: '最多选择：{label}（{count}）',
        sample: '样本 {index}',
        ratings: '评分列表'
      }
    }
  },
  form: {
    required: '不能为空',
    userName: {
      required: '请输入用户名',
      invalid: '用户名格式不正确'
    },
    phone: {
      required: '请输入手机号',
      invalid: '手机号格式不正确'
    },
    pwd: {
      required: '请输入密码',
      invalid: '密码格式不正确，6-18位字符，包含字母、数字、下划线'
    },
    confirmPwd: {
      required: '请输入确认密码',
      invalid: '两次输入密码不一致'
    },
    code: {
      required: '请输入验证码',
      invalid: '验证码格式不正确'
    },
    email: {
      required: '请输入邮箱',
      invalid: '邮箱格式不正确'
    }
  },
  dropdown: {
    closeCurrent: '关闭',
    closeOther: '关闭其它',
    closeLeft: '关闭左侧',
    closeRight: '关闭右侧',
    closeAll: '关闭所有',
    pin: '固定标签',
    unpin: '取消固定'
  },
  icon: {
    themeConfig: '主题配置',
    themeSchema: '主题模式',
    lang: '切换语言',
    fullscreen: '全屏',
    fullscreenExit: '退出全屏',
    reload: '刷新页面',
    collapse: '折叠菜单',
    expand: '展开菜单',
    pin: '固定',
    unpin: '取消固定'
  },
  datatable: {
    itemCount: '共 {total} 条',
    fixed: {
      left: '左固定',
      right: '右固定',
      unFixed: '取消固定'
    }
  }
};

export default local;
