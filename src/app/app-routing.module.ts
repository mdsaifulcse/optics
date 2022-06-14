import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { AuthComponent } from './theme/layout/auth/auth.component';
import { AuthGuard } from './_helpers/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/member-profile-edit/member-profile-edit.module').then(module => module.MemberProfileEditModule),
        //canActivate: [AuthGuard]
      },
      {
        path: 'change-password',
        loadChildren: () => import('./profile/change-password/change-password.module').then(module => module.ChangePasswordModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard-admin/dashboard-admin.module').then(module => module.AdminViewViewModule),
        canActivate: [AuthGuard]
      },
     
      {
        path: 'admins',
        loadChildren: () => import('./admin/admin.module').then(module => module.AdminModule),
        canActivate: [AuthGuard]
      },
     
      {
        path: 'teachers',
        loadChildren: () => import('./teacher/teacher.module').then(module => module.TeacherModule),
        canActivate: [AuthGuard]
      },
     
      {
        path: 'schools',
        loadChildren: () => import('./school/school.module').then(module => module.SchoolModule),
        canActivate: [AuthGuard]
      },
     
      {
        path: 'divisions',
        loadChildren: () => import('./division/division.module').then(module => module.DivisionModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'districts',
        loadChildren: () => import('./district/district.module').then(module => module.DistrictModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'upazilas',
        loadChildren: () => import('./upazila/upazila.module').then(module => module.UpazilaModule),
        canActivate: [AuthGuard]
      },
      
      {
        path: 'classes',
        loadChildren: () => import('./classes/classes.module').then(module => module.ClassModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'subjects',
        loadChildren: () => import('./subject/subject.module').then(module => module.SubjectModule),
        canActivate: [AuthGuard]
      },
      
      {
        path: 'class-wise-subject',
        loadChildren: () => import('./class-wise-subject/class-wise-subject.module').then(module => module.ClassWiseSubjectModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'topics',
        loadChildren: () => import('./topic/topic.module').then(module => module.TopicModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'mcq-questions',
        loadChildren: () => import('./mcq-question/mcq-question.module').then(module => module.McqQuestionModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'multi-answer-questions',
        loadChildren: () => import('./multi-ans/multi-ans.module').then(module => module.MultiAnsQuestModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'interactive-questions',
        loadChildren: () => import('./interactive-question/interactive-question.module').then(module => module.InteractiveQuestionModule),
        canActivate: [AuthGuard]
      },
      // {
      //   path: 'pending-post-list',
      //   loadChildren: () => import('./pending-post-list/pending-post-list.module').then(module => module.PendingPostListModule),
      //   canActivate: [AuthGuard],
      //   data: { auth: 'post_manage' }
      // },
      // {
      //   path: 'approved-post-list',
      //   loadChildren: () => import('./approved-post-list/approved-post-list.module').then(module => module.ApprovedPostListModule),
      //   canActivate: [AuthGuard],
      //   data: { auth: 'post_manage' }
      // },
      // {
      //   path: 'post-list',
      //   loadChildren: () => import('./post-list/post-list.module').then(module => module.PostListModule),
      //   canActivate: [AuthGuard],
      //   data: { auth: 'post_manage' }
      // },
      // {
      //   path: 'sourcing-request-list',
      //   loadChildren: () => import('./sourcing-request-list/sourcing-request-list.module').then(module => module.SourcingRequestListModule),
      //   canActivate: [AuthGuard],
      //   data: { auth: 'requisition_manage' }
      // },
      // {
      //   path: 'all-payment-list',
      //   loadChildren: () => import('./all-payment-list/all-payment-list.module').then(module => module.AllPaymentListModule),
      //   canActivate: [AuthGuard],
      //   data: { auth: 'finance_manage' }
      // },
      // {
      //   path: 'member-list',
      //   loadChildren: () => import('./member-list/member-list.module').then(module => module.MemberListModule),
      //   canActivate: [AuthGuard],
      //   data: { auth: 'member_manage' }
      // },
      // {
      //   path: 'post-edit/:id',
      //   loadChildren: () => import('./post-edit/post-edit.module').then(module => module.PostEditModule),
      //   canActivate: [AuthGuard],
      //   data: { auth: 'post_manage' }
      // },



      // {
      //   path: 'layout',
      //   loadChildren: () => import('./demo/pages/layout/layout.module').then(module => module.LayoutModule),
      //   canActivate: [AuthGuard]
      // },
      // {
      //   path: 'basic',
      //   loadChildren: () => import('./demo/ui-elements/ui-basic/ui-basic.module').then(module => module.UiBasicModule),
      //   canActivate: [AuthGuard]
      // },
      // {
      //   path: 'forms',
      //   loadChildren: () => import('./demo/pages/form-elements/form-elements.module').then(module => module.FormElementsModule),
      //   canActivate: [AuthGuard]
      // },
      // {
      //   path: 'tbl-bootstrap',
      //   loadChildren: () => import('./demo/pages/tables/tbl-bootstrap/tbl-bootstrap.module').then(module => module.TblBootstrapModule),
      //   canActivate: [AuthGuard]
      // },
      // {
      //   path: 'charts',
      //   loadChildren: () => import('./demo/pages/core-chart/core-chart.module').then(module => module.CoreChartModule),
      //   canActivate: [AuthGuard]
      // },
      // {
      //   path: 'sample-page',
      //   loadChildren: () => import('./demo/pages/sample-page/sample-page.module').then(module => module.SamplePageModule),
      //   canActivate: [AuthGuard]
      // },

    ]
  },
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () => import('./authentication/authentication.module').then(module => module.AuthenticationModule)
      }
    ]
  }, {
    path: '**',
    redirectTo: '/dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
