
import { FormControl } from '@angular/forms';

export interface ValidationResult {
    [key: string]: boolean;
}

export class PasswordValidator {

    public static strong(control: FormControl): ValidationResult {
        let hasNumber = /\d/.test(control.value);
        let hasUpper = /[A-Z]/.test(control.value);
        let hasLower = /[a-z]/.test(control.value);        
        let hasDigitAndAlphaNumeric = /^(?=[^\d_].*?\d)\w(\w|[!@#$%]){7,20}/.test(control.value);        

        // console.log('Num, Upp, Low', hasNumber, hasUpper, hasLower);
        const valid = hasNumber && hasUpper && hasLower && hasDigitAndAlphaNumeric;
        if (!valid) {
            // return what´s not valid
            return { strong: true };
        }
        return null;
    }
}