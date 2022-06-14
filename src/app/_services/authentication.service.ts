import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Cookie } from 'ng2-cookies';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  public currentUserDetails: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(private http: HttpClient, private toastr: ToastrService) {
    if (Cookie.check('.Captain.Bonik.Admin.Cookie'))
      this.currentUserDetails = new BehaviorSubject<any>(JSON.parse(Cookie.get('.Captain.Bonik.Admin.Cookie')));
  }

  public get currentUserValue(): any {
    return Cookie.check('.Captain.Bonik.Admin.Cookie') ? this.currentUserDetails.value : null;
  }

  public isAuthenticated(): boolean {
    return Cookie.check('.Captain.Bonik.Admin.Cookie');
  }

  login(params) {

    let obj = {
      email : params.email,
      password : params.password,
      is_admin : true
    };

    return this.http.post<any>(environment.baseUrl + '/api/admin/login', obj).pipe(map(data => {
        const user = {
            id: data.user.id,
            email: data.user.email,
            name_bn: data.user.name_bn,
            name_en: data.user.name_en,
            mobile_number: data.user.mobile_number,
            school_id: data.user.school_id,
            access_token: data.access_token,
            //profile_image: data.data.profile_image ? data.data.profile_image : null,
            created: data.user.created_at,
            c_expires: new Date(data.user.created_at * 1000),
        }
        let expireDate = new Date(data.user.created_at * 1000);
        Cookie.set('.Captain.Bonik.Admin.Cookie', JSON.stringify(user), expireDate, '/', window.location.hostname, false);
        this.currentUserDetails.next(user);
        // delete user.access_token;
        const res = {
            data: user,
            errors: null,
            message: data.messages,
            status: data.status
        };
        return res;
    }),
    catchError(err => {
        if (err.status === 400) {
            this.toastr.error('Unauthorized request found', 'Error!', { timeOut: 3000 });
        } else if (err.status === 401) {
            this.toastr.error('Invalid Email Or Password', 'Error!', { timeOut: 3000 });
        }
        return of(err);
    }));
}




  logout(hostname) {
    Cookie.delete('.Captain.Bonik.Admin.Cookie', '/', hostname);
    this.currentUserDetails.next(null);
  }


  updateProfile(data) {
    let user = this.currentUserDetails.value;
    user.email = data.email;
    user.name_bn = data.name_bn;
    user.name_en = data.name_en;
    user.mobile_number = data.mobile_number;
    //user.full_name = data.first_name +" "+ data.last_name
    let expireDate = new Date(data.created_at * 1000);
    Cookie.set('.Captain.Bonik.Admin.Cookie',JSON.stringify(user),expireDate,'/',window.location.hostname,false);
    this.currentUserDetails.next(user);
  }

  updateImage(imagePath) {
    let currentUser = this.currentUserDetails.value;
    currentUser.profile_image = imagePath;
    Cookie.set('.Captain.Bonik.Admin.Cookie', JSON.stringify(currentUser),  new Date(currentUser.c_expires), '/', window.location.hostname, false);
    // sessionStorage.setItem('.BRAC.Trainer.Cookie', JSON.stringify(currentUser));
    this.currentUserDetails.next(currentUser);
  }


}
