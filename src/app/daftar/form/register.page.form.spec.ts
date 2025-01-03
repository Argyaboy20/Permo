import { FormBuilder, FormGroup } from "@angular/forms";
import { RegisterPageForm } from "./register.page.form"

describe('RegisterPageForm', () => {

    let registerPageForm : RegisterPageForm;
    let form: FormGroup;

    beforeEach(() => {
        registerPageForm =  new RegisterPageForm(new FormBuilder());
        form = registerPageForm.getForm();
    })

    it ('should Username kosong tidak valid', () => {
        expect(form.get('username')?.valid).toBeFalsy();
    })

    it ('should Email kosong tidak valid', () => {
        expect(form.get('email')?.valid).toBeFalsy();
    })

    it ('should Password kosong tidak valid', () => {
        expect(form.get('pass')?.valid).toBeFalsy();
    })

    it ('should Konfirmasi Password kosong tidak valid', () => {
        expect(form.get('konfirmasi')?.valid).toBeFalsy();
    })
    


   
    it ('should Email tidak valid', () => {
        form.get('email')?.setValue('Email invalid');

        expect(form.get('email')?.valid).toBeFalsy();
    })

    it ('should Password kurang dari 7 karakter tidak valid', () => {
        form.get('pass')?.setValue('12345');

        expect(form.get('pass')?.valid).toBeFalsy();
    })

    it ('should Password yang berbeda dari konfirmasi password tidak valid', () => {
        form.get('pass')?.setValue('anyPassword');
        form.get('konfirmasi')?.setValue('anotherPassword');
        
        expect(form.get('konfirmasi')?.valid).toBeFalsy();
    })

    it('Data valid', () => {
        form.get('username')?.setValue("anyUsername");
        form.get('email')?.setValue("any@email.com");
        form.get('pass')?.setValue("anyPassword");
        form.get('konfirmasi')?.setValue("anyPassword");

        expect(form.valid).toBeTruthy();
    })
})