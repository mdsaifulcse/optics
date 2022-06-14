import { Injectable } from "@angular/core";

export interface NavigationItem {
  id: string;
  title: string;
  type: "item" | "collapse" | "group";
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  permission?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  function?: any;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}

const NavigationItems = [
  {
    id: "home",
    title: "Home",
    type: "group",
    icon: "feather icon-monitor",
    children: [
      {
        id: "dashboard",
        title: "Dashboard",
        type: "item",
        url: "/subjects",
        classes: "nav-item",
        icon: "feather icon-activity",
      }
    ],
  },
  {
    id: "configuration",
    title: "Configuration",
    type: "collapse",
    permission: 'master_setting_manage',
    children: [
      {
        id: "system-configuration",
        title: "System Configuration",
        type: "item",
        classes: "nav-item",
        url: "/configuration",      
        permission: 'master_setting_manage'
      }
    ],
  },
  {
    id: "exam-question",
    title: "Exam Question",
    type: "group",
    icon: "feather icon-layout",
    permission: 'member_manage',
    children: [
      {
        id: "mcq-questions",
        title: "Mcq Questions",
        type: "item",
        url: "/mcq-questions",
        classes: "nav-item",
        icon: "feather icon-user",
        permission: 'member_manage'
      },
      {
        id: "mcq-interactive-questions",
        title: "Interactive Questions",
        type: "item",
        url: "/interactive-questions",
        classes: "nav-item",
        icon: "feather icon-user",
        permission: 'member_manage'
      },
      {
        id: "multi-answer-questions",
        title: "Multiple Answer",
        type: "item",
        url: "/multi-answer-questions",
        classes: "nav-item",
        icon: "feather icon-user",
        permission: 'member_manage'
      },
      {
        id: "topic",
        title: "Topic",
        type: "item",
        url: "/topics",
        classes: "nav-item",
        icon: "feather icon-user",
        permission: 'member_manage'
      }
    ],
  },

  {
    id: "school-management",
    title: "School Management",
    type: "group",
    icon: "feather icon-layout",
    permission: 'member_manage',
    children: [
      {
        id: "school",
        title: "School",
        type: "item",
        url: "/schools",
        classes: "nav-item",
        icon: "feather icon-user",
        permission: 'member_manage'
      }
    ],
  },

  {
    id: "user-management",
    title: "User Management",
    type: "group",
    icon: "feather icon-layout",
    children: [
      {
        id: "teacher-list",
        title: "teacher",
        type: "item",
        url: "/teachers",
        classes: "nav-item",
        icon: "feather icon-user",
      },
      {
        id: "admin-list",
        title: "Admin",
        type: "item",
        url: "/admins",
        classes: "nav-item",
        icon: "feather icon-user",
      }
    ],
  },

  {
    id: "master-setting",
    title: "master-setting",
    type: "group",
    icon: "feather icon-layout",
    permission: 'finance_manage',
    children: [
      {
        id: "division",
        title: "Division",
        type: "item",
        url: "/divisions",
        classes: "nav-item",
        icon: "feather icon-menu",
        permission: 'finance_manage',
      },
      {
        id: "district",
        title: "Disctict",
        type: "item",
        url: "/districts",
        classes: "nav-item",
        icon: "feather icon-menu",
        permission: 'finance_manage',
      },
      {
        id: "upazila",
        title: "Upazila",
        type: "item",
        url: "/upazilas",
        classes: "nav-item",
        icon: "feather icon-menu",
        permission: 'finance_manage',
      },
      {
        id: "classes",
        title: "Class",
        type: "item",
        url: "/classes",
        classes: "nav-item",
        icon: "feather icon-menu",
        permission: 'finance_manage',
      },
      {
        id: "subject",
        title: "Subject",
        type: "item",
        url: "/subjects",
        classes: "nav-item",
        icon: "feather icon-menu",
        permission: 'finance_manage',
      },
      {
        id: "class-wise-subject",
        title: "Class Wise subject Assing",
        type: "item",
        url: "/class-wise-subject",
        classes: "nav-item",
        icon: "feather icon-menu",
        permission: 'finance_manage',
      },
    ],
  },

  // {
  //   id: "sourcing-requests",
  //   title: "Sourcing Requests",
  //   type: "group",
  //   icon: "feather icon-layout",
  //   permission: 'requisition_manage',
  //   children: [
  //     {
  //       id: "sourcing-requests",
  //       title: "Requests",
  //       type: "item",
  //       url: "/sourcing-request-list",
  //       classes: "nav-item",
  //       icon: "feather icon-package",
  //       permission: 'requisition_manage',
  //     }
  //   ],
  // },
];

@Injectable()
export class NavigationItem {
  public get() {
    return NavigationItems;
  }
}
