import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { AuthenticationService } from '../_services/authentication.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService, public toastr : ToastrService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            let errorMsg =err.error.result  || err.error.message || err.error.message_bag || err.error.messages || err.error.error_description || err.error || err.statusText;
            
            console.log(err)
            if(err.status === 400) {
                errorMsg=err.error.message_bag
               // this.toastr.error(err.error.message_bag, 'Error!', { timeOut: 3000 });
               } else if (err.status === 404) 
               {
                errorMsg=err.error.messages
                }
                else if (err.status === 409) 
                {
                    errorMsg=err.error.messages
                }
            // if (err.status === 401) {
            //     // auto logout if 401 response returned from api
            //   // this.authenticationService.logout();
            //  //   location.reload(true);
            // }

            this.toastr.error(errorMsg, 'Error!', { timeOut: 3000 });
            
            return throwError(errorMsg);
        }))
    }
}
