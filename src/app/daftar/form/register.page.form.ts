import { FormBuilder, FormGroup, ValidatorFn, Validators, AbstractControl } from "@angular/forms";

// Custom validator function for password
function createPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        const value = control.value;

        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumber = /\d/.test(value);
        const hasSpecialChar = /[@$!%*?&#]/.test(value);
        const isLengthValid = value ? value.length >= 6 : false;

        const passwordValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isLengthValid;

        if (!passwordValid) {
            return {
                upperCase: !hasUpperCase,
                lowerCase: !hasLowerCase,
                number: !hasNumber,
                specialChar: !hasSpecialChar,
                minLength: !isLengthValid
            };
        }

        return null;
    };
}


export class RegisterPageForm {

    private formBuilder: FormBuilder;
    private form: FormGroup;

    constructor(formBuilder: FormBuilder) {
        this.formBuilder = formBuilder;
        this.form = this.createForm();
    }

    private createForm(): FormGroup {
        let form = this.formBuilder.group({
            username: ['', [
                Validators.required,
                Validators.minLength(7),
                Validators.pattern('^[a-zA-Z0-9]*$') // Hanya menerima huruf dan angka
            ]],
            email: ['', [Validators.required, Validators.email]],
            pass: ['', [
                Validators.required,
                createPasswordValidator()
            ]],
            konfirmasi: ['']
        });

        form.get('konfirmasi')?.setValidators(matchPasswordAndRepeatPassword(form));

        return form;
    }

    getForm(): FormGroup {
        return this.form;
    }

}

function matchPasswordAndRepeatPassword(form: FormGroup): ValidatorFn {
    const pass = form.get('pass');
    const konfirmasi = form.get('konfirmasi');

    const validator = () => {
        return pass?.value == konfirmasi?.value ? null : { isntMatching: true }
    };

    return validator;

}