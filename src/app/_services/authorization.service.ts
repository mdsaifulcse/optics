import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthorizationService {

    permissions: Array<string>; // Store the actions for which this user has permission

    constructor(private authenticationService: AuthenticationService) {
    }

    hasPermission(permissions: string) {
        if (!permissions) return true;
        const permissionss = permissions.split(',');

        // if (this.authenticationService.currentUserDetails.value && this.authenticationService.currentUserDetails.value.permissions.find(permission => {
        //     return permissions.indexOf(permission) !== -1;
        // })) {
        //     return true;
        // }
        return false;
    }


    hasPermissions(permissions: Array<string>) {
      if (
        this.authenticationService.currentUserDetails.value &&
        this.authenticationService.currentUserDetails.value.permissions.find((permission) => {
          return permissions.indexOf(permission) !== -1;
        })
      ) {
        return true;
      }
      return false;
    }
}
