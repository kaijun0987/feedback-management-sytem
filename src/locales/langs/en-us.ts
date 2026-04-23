const local: App.I18n.Schema = {
  system: {
    title: 'Feedback Hub',
    updateTitle: 'System Version Update Notification',
    updateContent: 'A new version of the system has been detected. Do you want to refresh the page immediately?',
    updateConfirm: 'Refresh immediately',
    updateCancel: 'Later'
  },
  common: {
    action: 'Action',
    add: 'Add',
    addSuccess: 'Add Success',
    backToHome: 'Back to home',
    batchDelete: 'Batch Delete',
    cancel: 'Cancel',
    close: 'Close',
    check: 'Check',
    selectAll: 'Select All',
    expandColumn: 'Expand Column',
    columnSetting: 'Column Setting',
    config: 'Config',
    confirm: 'Confirm',
    delete: 'Delete',
    deleteSuccess: 'Delete Success',
    confirmDelete: 'Are you sure you want to delete?',
    edit: 'Edit',
    warning: 'Warning',
    error: 'Error',
    index: 'Index',
    keywordSearch: 'Please enter keyword',
    logout: 'Logout',
    logoutConfirm: 'Are you sure you want to log out?',
    lookForward: 'Coming soon',
    modify: 'Modify',
    modifySuccess: 'Modify Success',
    noData: 'No Data',
    operate: 'Operate',
    pleaseCheckValue: 'Please check whether the value is valid',
    refresh: 'Refresh',
    reset: 'Reset',
    search: 'Search',
    switch: 'Switch',
    tip: 'Tip',
    trigger: 'Trigger',
    update: 'Update',
    updateSuccess: 'Update Success',
    userCenter: 'User Center',
    yesOrNo: {
      yes: 'Yes',
      no: 'No'
    }
  },
  request: {
    logout: 'Logout user after request failed',
    logoutMsg: 'User status is invalid, please log in again',
    logoutWithModal: 'Pop up modal after request failed and then log out user',
    logoutWithModalMsg: 'User status is invalid, please log in again',
    refreshToken: 'The requested token has expired, refresh the token',
    tokenExpired: 'The requested token has expired'
  },
  theme: {
    themeDrawerTitle: 'Theme Configuration',
    tabs: {
      appearance: 'Appearance',
      layout: 'Layout',
      general: 'General',
      preset: 'Preset'
    },
    appearance: {
      themeSchema: {
        title: 'Theme Schema',
        light: 'Light',
        dark: 'Dark',
        auto: 'Follow System'
      },
      grayscale: 'Grayscale',
      colourWeakness: 'Colour Weakness',
      themeColor: {
        title: 'Theme Color',
        primary: 'Primary',
        info: 'Info',
        success: 'Success',
        warning: 'Warning',
        error: 'Error',
        followPrimary: 'Follow Primary'
      },
      themeRadius: {
        title: 'Theme Radius'
      },
      recommendColor: 'Apply Recommended Color Algorithm',
      recommendColorDesc: 'The recommended color algorithm refers to',
      preset: {
        title: 'Theme Presets',
        apply: 'Apply',
        applySuccess: 'Preset applied successfully',
        default: {
          name: 'Default Preset',
          desc: 'Default preset for the feedback workspace'
        },
        dark: {
          name: 'Dark Preset',
          desc: 'Dark theme preset for night time usage'
        },
        compact: {
          name: 'Compact Preset',
          desc: 'Compact layout preset for small screens'
        },
        azir: {
          name: "Azir's Preset",
          desc: 'It is a cold and elegant preset that Azir likes'
        }
      }
    },
    layout: {
      layoutMode: {
        title: 'Layout Mode',
        vertical: 'Vertical Mode',
        horizontal: 'Horizontal Mode',
        'vertical-mix': 'Vertical Mix Mode',
        'vertical-hybrid-header-first': 'Left Hybrid Header-First',
        'top-hybrid-sidebar-first': 'Top-Hybrid Sidebar-First',
        'top-hybrid-header-first': 'Top-Hybrid Header-First',
        vertical_detail: 'Vertical menu layout, with the menu on the left and content on the right.',
        'vertical-mix_detail':
          'Vertical mix-menu layout, with the primary menu on the dark left side and the secondary menu on the lighter left side.',
        'vertical-hybrid-header-first_detail':
          'Left hybrid layout, with the primary menu at the top, the secondary menu on the dark left side, and the tertiary menu on the lighter left side.',
        horizontal_detail: 'Horizontal menu layout, with the menu at the top and content below.',
        'top-hybrid-sidebar-first_detail':
          'Top hybrid layout, with the primary menu on the left and the secondary menu at the top.',
        'top-hybrid-header-first_detail':
          'Top hybrid layout, with the primary menu at the top and the secondary menu on the left.'
      },
      tab: {
        title: 'Tab Settings',
        visible: 'Tab Visible',
        cache: 'Tag Bar Info Cache',
        cacheTip: 'Keep the tab bar information after leaving the page',
        height: 'Tab Height',
        mode: {
          title: 'Tab Mode',
          slider: 'Slider',
          chrome: 'Chrome',
          button: 'Button'
        },
        closeByMiddleClick: 'Close Tab by Middle Click',
        closeByMiddleClickTip: 'Enable closing tabs by clicking with the middle mouse button'
      },
      header: {
        title: 'Header Settings',
        height: 'Header Height',
        breadcrumb: {
          visible: 'Breadcrumb Visible',
          showIcon: 'Breadcrumb Icon Visible'
        }
      },
      sider: {
        title: 'Sider Settings',
        inverted: 'Dark Sider',
        width: 'Sider Width',
        collapsedWidth: 'Sider Collapsed Width',
        mixWidth: 'Mix Sider Width',
        mixCollapsedWidth: 'Mix Sider Collapse Width',
        mixChildMenuWidth: 'Mix Child Menu Width',
        autoSelectFirstMenu: 'Auto Select First Submenu',
        autoSelectFirstMenuTip:
          'When a first-level menu is clicked, the first submenu is automatically selected and navigated to the deepest level'
      },
      footer: {
        title: 'Footer Settings',
        visible: 'Footer Visible',
        fixed: 'Fixed Footer',
        height: 'Footer Height',
        right: 'Right Footer'
      },
      content: {
        title: 'Content Area Settings',
        scrollMode: {
          title: 'Scroll Mode',
          tip: 'The theme scroll only scrolls the main part, the outer scroll can carry the header and footer together',
          wrapper: 'Wrapper',
          content: 'Content'
        },
        page: {
          animate: 'Page Animate',
          mode: {
            title: 'Page Animate Mode',
            fade: 'Fade',
            'fade-slide': 'Slide',
            'fade-bottom': 'Fade Zoom',
            'fade-scale': 'Fade Scale',
            'zoom-fade': 'Zoom Fade',
            'zoom-out': 'Zoom Out',
            none: 'None'
          }
        },
        fixedHeaderAndTab: 'Fixed Header And Tab'
      }
    },
    general: {
      title: 'General Settings',
      watermark: {
        title: 'Watermark Settings',
        visible: 'Watermark Full Screen Visible',
        text: 'Custom Watermark Text',
        enableUserName: 'Enable User Name Watermark',
        enableTime: 'Show Current Time',
        timeFormat: 'Time Format'
      },
      multilingual: {
        title: 'Multilingual Settings',
        visible: 'Display multilingual button'
      },
      globalSearch: {
        title: 'Global Search Settings',
        visible: 'Display GlobalSearch button'
      }
    },
    configOperation: {
      copyConfig: 'Copy Config',
      copySuccessMsg: 'Copy Success, Please replace the variable "themeSettings" in "src/theme/settings.ts"',
      resetConfig: 'Reset Config',
      resetSuccessMsg: 'Reset Success'
    }
  },
  route: {
    login: 'Login',
    403: 'No Permission',
    404: 'Page Not Found',
    500: 'Server Error',
    admin: 'Admin Portal',
    admin_feedback: 'Feedback Management',
    admin_feedback_forms: 'Feedback List',
    admin_users: 'User Management',
    admin_users_list: 'User List',
    feedback: 'Feedback Center',
    feedbackmanage: 'Feedback Management',
    feedbackmanage_list: 'Feedback List',
    'iframe-page': 'Iframe',
    home: 'Home',
    usermanage: 'User Management',
    usermanage_list: 'User List'
  },
  page: {
    login: {
      common: {
        loginOrRegister: 'Login / Register',
        userNamePlaceholder: 'Please enter user name',
        phonePlaceholder: 'Please enter phone number',
        codePlaceholder: 'Please enter verification code',
        passwordPlaceholder: 'Please enter password',
        confirmPasswordPlaceholder: 'Please enter password again',
        codeLogin: 'Verification code login',
        confirm: 'Confirm',
        back: 'Back',
        validateSuccess: 'Verification passed',
        loginSuccess: 'Login successfully',
        welcomeBack: 'Welcome back, {userName} !'
      },
      pwdLogin: {
        title: 'Password Login',
        rememberMe: 'Remember me',
        forgetPassword: 'Forget password?',
        forgetPasswordNotice: 'Please contact HR or an admin to reset your password.',
        register: 'Register',
        otherAccountLogin: 'Other Account Login',
        otherLoginMode: 'Other Login Mode',
        superAdmin: 'Super Admin',
        admin: 'Admin',
        user: 'User'
      },
      codeLogin: {
        title: 'Verification Code Login',
        getCode: 'Get verification code',
        reGetCode: 'Reacquire after {time}s',
        sendCodeSuccess: 'Verification code sent successfully',
        imageCodePlaceholder: 'Please enter image verification code'
      },
      register: {
        title: 'Register',
        agreement: 'I have read and agree to',
        protocol: '《User Agreement》',
        policy: '《Privacy Policy》'
      },
      resetPwd: {
        title: 'Reset Password'
      },
      bindWeChat: {
        title: 'Bind WeChat'
      }
    },
    home: {
      branchDesc:
        'This workspace is focused on internal feedback operations, form management, and response tracking for the team.',
      greeting: 'Good morning, {userName}. Here is your feedback workspace overview.',
      weatherDesc: 'Track open forms, responses, and team feedback in one place.',
      projectCount: 'Active Projects',
      todo: 'Pending Tasks',
      message: 'Unread Messages',
      downloadCount: 'Exports',
      registerCount: 'Contributors',
      schedule: 'Team Schedule',
      study: 'Study',
      work: 'Work',
      rest: 'Rest',
      entertainment: 'Entertainment',
      visitCount: 'Visit Count',
      turnover: 'Turnover',
      dealCount: 'Deal Count',
      projectNews: {
        title: 'Project News',
        moreNews: 'More News',
        desc1: 'The employee satisfaction survey was opened for the product and design teams.',
        desc2: 'A follow-up form was created to collect detailed feedback on onboarding issues.',
        desc3: 'Admin analytics for response trends are now ready for internal review.',
        desc4: 'The feedback workspace theme was refreshed with a lighter blue visual system.',
        desc5: 'Submission and empty-state flows were polished for the public and admin pages.'
      },
      creativity: 'Creativity'
    },
    feedback: {
      heroTag: 'Company Internal Feedback',
      heroTitle: 'Feedback Center',
      heroDescription:
        'Share suggestions, vote on internal initiatives, and submit feedback forms for daily operations, culture, and team events.',
      filterAllForms: 'All Forms',
      filterNormalCase: 'Normal Case',
      filterSpecialCase: 'Special Case',
      adminPortal: 'Admin Portal',
      changePassword: 'Change Password',
      changePasswordSuccessTitle: 'Password updated',
      changePasswordSuccessContent: 'Your password has been updated successfully.',
      login: 'Login',
      logout: 'Logout',
      anonymousSubmit: 'Anonymous Submit',
      anonymousSubmitHint: 'Hide your name in feedback results',
      perFormAnonymousHint: 'Each form can be set independently.',
      browseForms: 'Browse Forms',
      searchPlaceholder: 'Search form title, description, or tag',
      writeFeedback: 'Write Feedback',
      loginToSubmit: 'Login to Submit',
      clearFilters: 'Clear Filters',
      retry: 'Retry',
      changePasswordComingSoon: 'Change password flow will be connected later.',
      formDetailNotReady: 'Form detail is not ready yet.',
      loadFormsError: 'Unable to load feedback forms right now.',
      filteredEmpty: 'No active feedback forms matched your current filters.',
      empty: 'There are no active feedback forms available right now.',
      submitSuccessTitle: 'Feedback submitted',
      submitSuccessAnonymous: 'Your anonymous feedback has been recorded.',
      submitSuccessNamed: 'Your feedback has been recorded successfully.',
      submitUpdatedTitle: 'Feedback updated',
      submitUpdatedAnonymous: 'Your anonymous submission has been updated.',
      submitUpdatedNamed: 'Your submission has been updated.',
      submitFailed: 'Failed to submit feedback.',
      changePasswordModal: {
        title: 'Change Password',
        currentPassword: 'Current Password',
        newPassword: 'New Password',
        confirmPassword: 'Confirm New Password',
        currentPasswordPlaceholder: 'Enter current password',
        newPasswordPlaceholder: 'Enter new password',
        confirmPasswordPlaceholder: 'Enter new password again',
        submit: 'Update Password'
      },
      summary: {
        openForms: 'Open Forms',
        openFormsHint: 'Currently visible to employees',
        specialCases: 'Special Cases',
        specialCasesHint: 'Forms with an end date',
        totalResponses: 'Total Responses',
        totalResponsesHint: 'Submission count across visible forms'
      },
      shared: {
        caseType: {
          all: 'All',
          normal: 'Normal',
          special: 'Special'
        },
        mode: {
          anonymousEnabled: 'Anonymous enabled',
          standardSubmit: 'Standard submit'
        },
        labels: {
          responses: 'Responses',
          dateRange: 'Date Range',
          availability: 'Availability',
          estimatedTime: 'Estimated Time',
          submissionMode: 'Submission Mode',
          questions: 'Questions',
          estimated: 'Estimated'
        },
        units: {
          min: 'min',
          questions: '{count} questions',
          responsesSubmitted: '{count} submitted',
          itemsMatched: '{count} items matched',
          writtenResponses: '{count} written responses',
          sampleResponses: '{count} sample responses',
          responsesCount: '{count} responses',
          selectionsCount: '{count} selections',
          ratingsCountAverage: '{count} ratings · average {average}/5'
        },
        state: {
          enabled: 'Enabled',
          disabled: 'Disabled',
          active: 'Active',
          upcoming: 'Upcoming',
          ongoing: 'Ongoing',
          endingSoon: 'Ending Soon',
          expired: 'Expired'
        },
        date: {
          alwaysOpen: 'Always open'
        },
        availability: {
          permanent: 'Permanent',
          endsToday: 'Ends today',
          daysLeft: '{count} day left | {count} days left'
        }
      }
    },
    feedbackManage: {
      title: 'Feedback Management',
      description: 'Manage feedback items, form visibility, and response access from one admin page.',
      filters: 'Filters',
      feedbackList: 'Feedback List',
      viewDashboard: 'View Dashboard',
      createForm: 'Create Form',
      viewDashboardComingSoon: 'Dashboard metrics can be added next.',
      searchPlaceholder: 'Search title, description, or tag',
      selectCase: 'Select case',
      selectStatus: 'Select status',
      selectDateRange: 'Select date range',
      applyFilters: 'Apply Filters',
      clearFilters: 'Clear Filters',
      retry: 'Retry',
      loadError: 'Unable to load feedback forms right now.',
      filteredEmpty: 'No feedback forms matched your current filters.',
      empty: 'No feedback forms have been created yet.',
      loadFormDetailFailed: 'Failed to load form detail.',
      updateStatusFailed: 'Failed to update form status.',
      exportComingSoon: 'Export for "{title}" will connect after the API is ready.',
      saveFailed: 'Failed to save feedback form.',
      saveCreated: 'Created "{title}".',
      saveUpdated: 'Updated "{title}".',
      toggleSuccess: '{title} is now {status}.',
      summary: {
        totalForms: 'Total Forms',
        totalFormsHint: 'All forms in the current workspace',
        enabledForms: 'Enabled Forms',
        enabledFormsHint: 'Currently available for employees',
        endingSoon: 'Ending Soon',
        endingSoonHint: 'Closing within the next 2 days',
        totalResponses: 'Total Responses',
        totalResponsesHint: 'Across all feedback forms'
      },
      columns: {
        no: 'No',
        form: 'Form',
        case: 'Case',
        status: 'Status',
        dateRange: 'Date Range',
        responses: 'Responses',
        action: 'Action'
      },
      actions: {
        edit: 'Edit',
        responses: 'Responses',
        disable: 'Disable',
        enable: 'Enable',
        export: 'Export'
      }
    },
    userManage: {
      title: 'User Management',
      description:
        'Manage sign-in accounts for the internal feedback system and control which roles can access the admin area.',
      addAccount: 'Add Account',
      addUser: 'Add User',
      placeholder:
        'This page is currently a frontend placeholder. `Super` can create and edit all account roles, while `Admin` can only create and edit `User` accounts.',
      permissionNotice:
        'Super can create and edit all account roles. Admin can only create and edit standard user accounts.',
      userList: 'User List',
      searchPlaceholder: 'Search by username or display name',
      filterByRole: 'Filter by role',
      currentUser: 'Current User',
      loadFailed: 'Failed to load users.',
      saveFailed: 'Failed to save user.',
      onlySuperEditAdmin: 'Only super can edit admin or super accounts.',
      adminOnlyCommonUsers: 'Admin can only create or edit common user accounts.',
      targetMissing: 'The selected user record no longer exists.',
      createSuccess: 'Created {role} account "{userName}".',
      updateSuccess: 'Updated "{userName}".',
      modalAddTitle: 'Add Account',
      modalEditTitle: 'Edit Account',
      fields: {
        userName: 'User Name',
        displayName: 'Display Name',
        role: 'Role',
        password: 'Password',
        status: 'Status'
      },
      placeholders: {
        userName: 'Enter user name',
        displayName: 'Enter display name',
        role: 'Select role',
        password: 'Enter password',
        passwordOptional: 'Leave blank to keep the current password'
      },
      validation: {
        userNameRequired: 'Please enter a user name',
        displayNameRequired: 'Please enter a display name',
        roleRequired: 'Please select a role',
        passwordRequired: 'Please enter a password',
        passwordInvalid: 'Password must be at least 6 characters'
      },
      summary: {
        totalAccounts: 'Total Accounts',
        totalAccountsHint: 'All visible accounts in the current workspace',
        adminAccounts: 'Admin Accounts',
        adminAccountsHint: 'Includes feedback admins managed by super',
        commonUsers: 'Common Users',
        commonUsersHint: 'Employees who can submit feedback forms',
        activeAccounts: 'Active Accounts',
        activeAccountsHint: 'Accounts currently allowed to sign in'
      },
      columns: {
        user: 'User',
        role: 'Role',
        status: 'Status',
        created: 'Created',
        action: 'Action'
      },
      roles: {
        super: 'Super',
        admin: 'Admin',
        user: 'User'
      }
    },
    feedbackForm: {
      builder: {
        createTitle: 'Create Feedback Form',
        editTitle: 'Edit Feedback Form',
        formSettings: 'Form Settings',
        formTitle: 'Form Title',
        status: 'Status',
        description: 'Description',
        startDate: 'Start Date',
        endDate: 'End Date',
        estimatedMinutes: 'Estimated Minutes',
        tags: 'Tags',
        questions: 'Questions',
        addQuestion: 'Add Question',
        questionTitle: 'Question Title',
        questionType: 'Question Type',
        questionDescription: 'Question Description',
        optionalHelperText: 'Optional helper text',
        required: 'Required',
        deleteQuestion: 'Delete Question',
        options: 'Options',
        addOption: 'Add Option',
        optionLabel: 'Option label',
        remove: 'Remove',
        starHint: 'Star questions will collect rating values and later render summary statistics.',
        saveForm: 'Save Form',
        atLeastOneQuestion: 'At least one question is required.',
        formTitleRequired: 'Form title is required.',
        questionTitleRequired: 'Each question needs a title.',
        choiceOptionsRequired: 'Choice questions need at least two filled options.',
        questionPrefix: 'Question {index}',
        placeholders: {
          formTitle: 'Enter form title',
          description: 'Enter description',
          questionTitle: 'Enter question title'
        },
        questionTypes: {
          text: 'Text',
          singleChoice: 'Single Choice',
          multipleChoice: 'Multiple Choice',
          star: 'Star Rating'
        }
      },
      submit: {
        fallbackTitle: 'Feedback Form',
        title: 'Submit Feedback',
        required: 'Required',
        writeAnswer: 'Write your answer',
        submitButton: 'Submit Feedback',
        updateButton: 'Update Feedback',
        completeQuestion: 'Please complete "{title}".'
      },
      response: {
        fallbackTitle: 'Responses',
        summaryTab: 'Summary',
        questionTab: 'By Question',
        individualTab: 'Individuals',
        summary: {
          totalResponsesHint: 'Current submission count for this form',
          sampleLoaded: 'Sample Loaded',
          sampleLoadedHint: 'Mock responses used in this prototype',
          anonymous: 'Anonymous',
          anonymousHint: 'Responses submitted without public identity',
          sampleCoverage: 'Sample Coverage',
          sampleCoverageHint: 'Sample responses compared with total count'
        },
        anonymousResponse: 'Anonymous Response',
        unknownUser: 'Unknown User',
        noResponsesYet: 'No responses yet',
        noAnswer: 'No answer',
        noData: 'No data',
        empty: 'Empty',
        noSampleResponses: 'No sample responses for this form yet.',
        topAnswer: 'Top answer: {label} ({count})',
        mostSelected: 'Most selected: {label} ({count})',
        sample: 'Sample {index}',
        ratings: 'Ratings'
      }
    }
  },
  form: {
    required: 'Cannot be empty',
    userName: {
      required: 'Please enter user name',
      invalid: 'User name format is incorrect'
    },
    phone: {
      required: 'Please enter phone number',
      invalid: 'Phone number format is incorrect'
    },
    pwd: {
      required: 'Please enter password',
      invalid: '6-18 characters, including letters, numbers, and underscores'
    },
    confirmPwd: {
      required: 'Please enter password again',
      invalid: 'The two passwords are inconsistent'
    },
    code: {
      required: 'Please enter verification code',
      invalid: 'Verification code format is incorrect'
    },
    email: {
      required: 'Please enter email',
      invalid: 'Email format is incorrect'
    }
  },
  dropdown: {
    closeCurrent: 'Close Current',
    closeOther: 'Close Other',
    closeLeft: 'Close Left',
    closeRight: 'Close Right',
    closeAll: 'Close All',
    pin: 'Pin Tab',
    unpin: 'Unpin Tab'
  },
  icon: {
    themeConfig: 'Theme Configuration',
    themeSchema: 'Theme Schema',
    lang: 'Switch Language',
    fullscreen: 'Fullscreen',
    fullscreenExit: 'Exit Fullscreen',
    reload: 'Reload Page',
    collapse: 'Collapse Menu',
    expand: 'Expand Menu',
    pin: 'Pin',
    unpin: 'Unpin'
  },
  datatable: {
    itemCount: 'Total {total} items',
    fixed: {
      left: 'Left Fixed',
      right: 'Right Fixed',
      unFixed: 'Unfixed'
    }
  }
};

export default local;
