import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './theme/shared/shared.module';

import { AppComponent } from './app.component';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { AuthComponent } from './theme/layout/auth/auth.component';
import { NavigationComponent } from './theme/layout/admin/navigation/navigation.component';
import { NavContentComponent } from './theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavGroupComponent } from './theme/layout/admin/navigation/nav-content/nav-group/nav-group.component';
import { NavCollapseComponent } from './theme/layout/admin/navigation/nav-content/nav-collapse/nav-collapse.component';
import { NavItemComponent } from './theme/layout/admin/navigation/nav-content/nav-item/nav-item.component';
import { NavBarComponent } from './theme/layout/admin/nav-bar/nav-bar.component';
import { NavLeftComponent } from './theme/layout/admin/nav-bar/nav-left/nav-left.component';
import { NavSearchComponent } from './theme/layout/admin/nav-bar/nav-left/nav-search/nav-search.component';
import { NavRightComponent } from './theme/layout/admin/nav-bar/nav-right/nav-right.component';
import { ConfigurationComponent } from './theme/layout/admin/configuration/configuration.component';

import { ToggleFullScreenDirective } from './theme/shared/full-screen/toggle-full-screen';

/* Menu Items */
import { NavigationItem } from './theme/layout/admin/navigation/navigation';
import { NgbButtonsModule, NgbDropdownModule, NgbTimepicker, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { ConfirmComponent } from './_helpers/confirm-dialog/confirm.component';
import { ConfirmService } from './_helpers/confirm-dialog/confirm.service';
import { PrintStudentReportService } from './_services/student-base-report.service';
import { AuthorizationService } from './_services/authorization.service';
import { AuthorizeDirective } from './_services/authorize.directive';
import { HighchartsChartModule } from 'highcharts-angular';


@NgModule({
    declarations: [
        AppComponent,
        AdminComponent,
        AuthComponent,
        NavigationComponent,
        NavContentComponent,
        NavGroupComponent,
        NavCollapseComponent,
        NavItemComponent,
        NavBarComponent,
        NavLeftComponent,
        NavSearchComponent,
        NavRightComponent,
        ConfigurationComponent,
        ToggleFullScreenDirective,
        ConfirmComponent,
        AuthorizeDirective,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        SharedModule,
        NgbDropdownModule,
        NgbTooltipModule,
        NgbButtonsModule,
        ToastrModule.forRoot(),
        HttpClientModule,
        HighchartsChartModule
    ],
    providers: [
        NavigationItem,
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        ConfirmService,
        PrintStudentReportService,
        AuthorizationService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
