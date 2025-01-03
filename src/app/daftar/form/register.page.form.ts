import { FormBuilder, FormGroup, ValidatorFn, Validators } from "@angular/forms";

export class RegisterPageForm {

    private formBuilder: FormBuilder;
    private form: FormGroup;

    constructor(formBuilder: FormBuilder) {
        this.formBuilder = formBuilder;
        this.form = this.createForm();
    }

    private createForm() : FormGroup {
        let form = this.formBuilder.group({
            username: ['', [Validators.required,]],
            email: ['', [Validators.required, Validators.email]],
            pass: ['', [Validators.required, Validators.minLength(6)]],
            konfirmasi: ['']
        });

        form.get('konfirmasi')?.setValidators(matchPasswordAndRepeatPassword(form));

        return form;
    }

    getForm() : FormGroup {
        return this.form;
    }

}

function matchPasswordAndRepeatPassword(form: FormGroup) : ValidatorFn {
    const pass = form.get('pass');
    const konfirmasi = form.get('konfirmasi');

    const validator = () => {
        return pass?.value == konfirmasi?.value ? null : {isntMatching: true}
    };

    return validator;

}