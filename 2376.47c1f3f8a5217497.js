"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[2376],{2376:(k,P,r)=>{r.r(P),r.d(P,{BantuanPageModule:()=>v});var m=r(177),l=r(4742),i=r(4341),C=r(5260),u=r(467),n=r(4438),M=r(1626),b=r(3656);function _(e,d){if(1&e&&(n.j41(0,"div",12),n.EFF(1),n.k0s()),2&e){const g=n.XpG();n.R7$(),n.SpI(" ",g.getErrorMessage("username")," ")}}function x(e,d){if(1&e&&(n.j41(0,"div",12),n.EFF(1),n.k0s()),2&e){const g=n.XpG();n.R7$(),n.SpI(" ",g.getErrorMessage("email")," ")}}let f=(()=>{var e;class d{constructor(t,a,o,s,h,p){this.fb=t,this.http=a,this.alertController=o,this.router=s,this.platform=h,this.location=p,this.apiUrl="http://127.0.0.1/api/action.php",this.isSubmitting=!1,this.validationErrors={},this.bantuanForm=this.fb.group({username:["",i.k0.required],email:["",[i.k0.required,i.k0.email]],kendala:["",i.k0.required]}),(this.platform.is("desktop")||this.platform.is("mobileweb"))&&window.addEventListener("beforeunload",O=>{localStorage.setItem("lastRoute","/bantuan")})}ngOnInit(){var t,a;null===(t=this.bantuanForm.get("username"))||void 0===t||t.valueChanges.subscribe(()=>{this.validationErrors.username&&this.validateField("username")}),null===(a=this.bantuanForm.get("email"))||void 0===a||a.valueChanges.subscribe(()=>{this.validationErrors.email&&this.validateField("email")}),this.maintainRoute()}ionViewWillEnter(){this.location.replaceState("/bantuan"),this.backButtonSubscription=this.platform.backButton.subscribeWithPriority(10,()=>{this.router.navigate(["/tabs/tab2"])})}ionViewWillLeave(){this.backButtonSubscription&&this.backButtonSubscription.unsubscribe()}maintainRoute(){const t=localStorage.getItem("lastRoute");"/bantuan"===t&&this.location.replaceState("/bantuan"),(this.platform.is("desktop")||this.platform.is("mobileweb"))&&window.addEventListener("load",()=>{"/bantuan"===t&&this.location.replaceState("/bantuan")})}validateField(t){var a=this;return(0,u.A)(function*(){const o=a.bantuanForm.get(t);if(!o||!o.value||o.invalid)return a.validationErrors[t]="email"===t?"Email tidak valid atau tidak diisi":"Username tidak diisi",!1;const s={aksi:"validate_user",[t]:o.value};try{return(yield a.http.post(a.apiUrl,s).toPromise()).success?(delete a.validationErrors[t],!0):(a.validationErrors[t]=("email"===t?"Email":"Username")+" tidak terdaftar",!1)}catch{return a.validationErrors[t]="Gagal melakukan validasi",!1}})()}isFieldInvalid(t){const a=this.bantuanForm.get(t);return a.invalid&&(a.dirty||a.touched)||!!this.validationErrors[t]}getErrorMessage(t){return this.validationErrors[t]||("email"===t?"Email tidak valid atau tidak diisi":"Username tidak diisi")}submitForm(){var t=this;return(0,u.A)(function*(){var a,o,s;if(t.bantuanForm.invalid||t.isSubmitting)return void t.showAlert("Error","Mohon lengkapi semua data dengan benar");const h=yield t.validateField("username"),p=yield t.validateField("email");if(!h||!p)return void t.showAlert("Peringatan","Harap dicek kembali data yang diperlukan");t.isSubmitting=!0;const O={aksi:"add_bantuan",username:null===(a=t.bantuanForm.get("username"))||void 0===a?void 0:a.value,email:null===(o=t.bantuanForm.get("email"))||void 0===o?void 0:o.value,kendala:null===(s=t.bantuanForm.get("kendala"))||void 0===s?void 0:s.value};t.http.post(t.apiUrl,O).subscribe({next:c=>{t.isSubmitting=!1,c.success?(t.showSuccessAlert("Sukses","Kendala berhasil dikirim"),t.bantuanForm.reset()):t.showAlert("Error",c.message||"Gagal mengirim kendala")},error:c=>{t.isSubmitting=!1,t.showAlert("Error","Gagal mengirim data kendala. Silakan coba lagi.")}})})()}showAlert(t,a){var o=this;return(0,u.A)(function*(){yield(yield o.alertController.create({header:t,message:a,buttons:["OK"]})).present()})()}showSuccessAlert(t,a){var o=this;return(0,u.A)(function*(){yield(yield o.alertController.create({header:t,message:a,buttons:[{text:"OK",handler:()=>{o.router.navigate(["/tabs/tab2"])}}]})).present()})()}}return(e=d).\u0275fac=function(t){return new(t||e)(n.rXU(i.ok),n.rXU(M.Qq),n.rXU(l.hG),n.rXU(C.Ix),n.rXU(b.OD),n.rXU(m.aZ))},e.\u0275cmp=n.VBU({type:e,selectors:[["app-bantuan"]],decls:20,vars:8,consts:[[1,"container"],[1,"header"],[3,"ngSubmit","formGroup"],[1,"form-group"],["label","Username","labelPlacement","floating","fill","outline","placeholder","Ketik username di sini","formControlName","username"],["class","error-message",4,"ngIf"],["label","Email","labelPlacement","floating","fill","outline","placeholder","Ketik email di sini","formControlName","email"],[1,"form-group","kendala-group"],[1,"kendala-item"],["formControlName","kendala","label","Kendala","labelPlacement","floating","placeholder","Ada yang bisa dibantu?","autoGrow","true","rows","4","maxlength","1000",1,"ken"],[1,"button-container"],["type","submit","expand","block",1,"btn",3,"disabled"],[1,"error-message"]],template:function(t,a){1&t&&(n.j41(0,"ion-content")(1,"div",0)(2,"div",1)(3,"h1"),n.EFF(4,"BANTUAN"),n.k0s(),n.j41(5,"p"),n.EFF(6,"Silakan sampaikan keluhan atau pertanyaan di bawah"),n.k0s()(),n.j41(7,"form",2),n.bIt("ngSubmit",function(){return a.submitForm()}),n.j41(8,"div",3),n.nrm(9,"ion-textarea",4),n.DNE(10,_,2,1,"div",5),n.k0s(),n.j41(11,"div",3),n.nrm(12,"ion-textarea",6),n.DNE(13,x,2,1,"div",5),n.k0s(),n.j41(14,"div",7)(15,"ion-item",8),n.nrm(16,"ion-textarea",9),n.k0s()(),n.j41(17,"div",10)(18,"ion-button",11),n.EFF(19," KIRIM KENDALA "),n.k0s()()()()()),2&t&&(n.R7$(7),n.Y8G("formGroup",a.bantuanForm),n.R7$(2),n.AVh("invalid",a.isFieldInvalid("username")),n.R7$(),n.Y8G("ngIf",a.isFieldInvalid("username")),n.R7$(2),n.AVh("invalid",a.isFieldInvalid("email")),n.R7$(),n.Y8G("ngIf",a.isFieldInvalid("email")),n.R7$(5),n.Y8G("disabled",a.bantuanForm.invalid))},dependencies:[m.bT,l.Jm,l.W9,l.uz,l.nc,l.Gw,i.qT,i.BC,i.cb,i.tU,i.j4,i.JD],styles:['[_nghost-%COMP%]   ion-content[_ngcontent-%COMP%]{--font-family: "Arial", sans-serif;--background-color: #324851;--margin: 0;--padding: 0;--background: url(/assets/background.png);--background-size: cover}[_nghost-%COMP%]   .container[_ngcontent-%COMP%]{max-width:460px;margin:20px auto;background-color:#2a393e;padding:20px;border-radius:8px;box-shadow:0 0 10px #f8f4f41a;height:auto;max-height:calc(100vh - 40px);overflow-y:auto}[_nghost-%COMP%]   .header[_ngcontent-%COMP%]{text-align:center;margin-bottom:15px}[_nghost-%COMP%]   .header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:24px;color:#89da59;margin:0 0 10px}[_nghost-%COMP%]   .header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:14px;color:#fff;margin:0}[_nghost-%COMP%]   .form-group[_ngcontent-%COMP%]{margin-bottom:20px}[_nghost-%COMP%]   .form-group[_ngcontent-%COMP%]   ion-item[_ngcontent-%COMP%]{--background: transparent;--border-color: #89da59;--border-radius: 4px;--padding-start: 8px;--padding-end: 8px;--highlight-color: #89da59}[_nghost-%COMP%]   .form-group[_ngcontent-%COMP%]   ion-item.item-has-focus[_ngcontent-%COMP%]{--border-color: #89da59}[_nghost-%COMP%]   .form-group.kendala-group[_ngcontent-%COMP%]   .kendala-item[_ngcontent-%COMP%]{--min-height: auto}[_nghost-%COMP%]   .form-group.kendala-group[_ngcontent-%COMP%]   .kendala-item[_ngcontent-%COMP%]   ion-textarea[_ngcontent-%COMP%]{width:100%;max-height:200px;overflow-y:auto}[_nghost-%COMP%]   ion-input[_ngcontent-%COMP%], [_nghost-%COMP%]   ion-textarea[_ngcontent-%COMP%]{--color: #FFFFFF;--placeholder-color: rgba(255, 255, 255, .6)}[_nghost-%COMP%]   .ken[_ngcontent-%COMP%]{min-height:100px;max-height:200px!important;overflow-y:auto!important}[_nghost-%COMP%]   .ken[_ngcontent-%COMP%]::part(native){min-height:100px;max-height:200px}[_nghost-%COMP%]   .ken[_ngcontent-%COMP%]::part(textarea){min-height:100px;max-height:200px;padding:8px;word-wrap:break-word;overflow-wrap:break-word;resize:none}[_nghost-%COMP%]   .error-message[_ngcontent-%COMP%]{color:#ff4646;font-size:12px;margin-top:4px;padding-left:16px}[_nghost-%COMP%]   .btn[_ngcontent-%COMP%]{--background: #89da59;margin-top:10px}[_nghost-%COMP%]   .btn[_ngcontent-%COMP%]:disabled{--background: #4a5c50;opacity:.7}[_nghost-%COMP%]   [_ngcontent-%COMP%]::-webkit-scrollbar{width:8px}[_nghost-%COMP%]   [_ngcontent-%COMP%]::-webkit-scrollbar-track{background:#ffffff1a;border-radius:4px}[_nghost-%COMP%]   [_ngcontent-%COMP%]::-webkit-scrollbar-thumb{background:#89da59;border-radius:4px}[_nghost-%COMP%]   [_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover{background:#6fb648}@media screen and (min-width: 320px) and (max-width: 375px){[_nghost-%COMP%]   ion-content[_ngcontent-%COMP%]{--padding: 10px}[_nghost-%COMP%]   .container[_ngcontent-%COMP%]{margin:60px auto;max-width:300px;padding:15px;height:auto}[_nghost-%COMP%]   .header[_ngcontent-%COMP%]{margin-bottom:12px}[_nghost-%COMP%]   .header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:18px}[_nghost-%COMP%]   .header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:12px}[_nghost-%COMP%]   .form-group[_ngcontent-%COMP%]{margin-bottom:12px}[_nghost-%COMP%]   .form-group[_ngcontent-%COMP%]   ion-item[_ngcontent-%COMP%]{--padding-start: 6px;--padding-end: 6px}[_nghost-%COMP%]   .form-group.kendala-group[_ngcontent-%COMP%]   .kendala-item[_ngcontent-%COMP%]   ion-textarea[_ngcontent-%COMP%]{font-size:12px}[_nghost-%COMP%]   .ken[_ngcontent-%COMP%]{min-height:80px}[_nghost-%COMP%]   .ken[_ngcontent-%COMP%]::part(native), [_nghost-%COMP%]   .ken[_ngcontent-%COMP%]::part(textarea){min-height:80px;font-size:12px}[_nghost-%COMP%]   .error-message[_ngcontent-%COMP%]{font-size:11px;padding-left:12px}[_nghost-%COMP%]   .btn[_ngcontent-%COMP%]{--padding-top: 8px;--padding-bottom: 8px;font-size:13px}}@media screen and (min-width: 376px) and (max-width: 475px){[_nghost-%COMP%]   ion-content[_ngcontent-%COMP%]{--padding: 15px}[_nghost-%COMP%]   .container[_ngcontent-%COMP%]{margin:100px auto;max-width:350px;padding:20px}[_nghost-%COMP%]   .header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:20px}[_nghost-%COMP%]   .header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:13px}[_nghost-%COMP%]   .form-group[_ngcontent-%COMP%]{margin-bottom:15px}[_nghost-%COMP%]   ion-label[_ngcontent-%COMP%]{font-size:13px}[_nghost-%COMP%]   .ken[_ngcontent-%COMP%]::part(native), [_nghost-%COMP%]   .ken[_ngcontent-%COMP%]::part(textarea){font-size:13px}}@media screen and (min-width: 476px) and (max-width: 768px){[_nghost-%COMP%]   ion-content[_ngcontent-%COMP%]{--padding: 15px}[_nghost-%COMP%]   .container[_ngcontent-%COMP%]{max-width:500px;margin:170px auto;padding:25px}[_nghost-%COMP%]   .header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:22px}[_nghost-%COMP%]   .form-group[_ngcontent-%COMP%]{margin-bottom:20px}[_nghost-%COMP%]   .btn[_ngcontent-%COMP%]{--padding-top: 12px;--padding-bottom: 12px;font-size:16px}[_nghost-%COMP%]   .ken[_ngcontent-%COMP%]{min-height:120px}[_nghost-%COMP%]   .ken[_ngcontent-%COMP%]::part(native), [_nghost-%COMP%]   .ken[_ngcontent-%COMP%]::part(textarea){min-height:120px}}@media screen and (min-width: 769px) and (max-width: 999px){[_nghost-%COMP%]   ion-content[_ngcontent-%COMP%]{--padding: 15px}[_nghost-%COMP%]   .container[_ngcontent-%COMP%]{max-width:550px;margin:200px auto;padding:30px}[_nghost-%COMP%]   .form-group[_ngcontent-%COMP%]{margin-bottom:25px}[_nghost-%COMP%]   .ken[_ngcontent-%COMP%]{min-height:150px}[_nghost-%COMP%]   .ken[_ngcontent-%COMP%]::part(native), [_nghost-%COMP%]   .ken[_ngcontent-%COMP%]::part(textarea){min-height:150px}}']}),d})(),v=(()=>{var e;class d{}return(e=d).\u0275fac=function(t){return new(t||e)},e.\u0275mod=n.$C({type:e}),e.\u0275inj=n.G2t({imports:[m.MD,l.bv,i.X1,M.q1,C.iI.forChild([{path:"",component:f}])]}),d})()}}]);