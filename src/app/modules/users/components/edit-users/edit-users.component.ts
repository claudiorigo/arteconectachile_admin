import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from '../../_services/users.service';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';

@Component({
  selector: 'app-edit-users',
  templateUrl: './edit-users.component.html',
  styleUrls: ['./edit-users.component.scss']
})
export class EditUsersComponent implements OnInit {

  @Input() user_selected:any = null;
  @Output() usersEvent: EventEmitter<any> = new EventEmitter();

  isLoading$;
  isLoading = false;
  formGroup: FormGroup;

  constructor(public modal: NgbActiveModal, public fb: FormBuilder, public _userService: UsersService, public toaster: Toaster) { }

  ngOnInit(): void {
    this.isLoading$ = this._userService.isLoading$;
    this.loadForm();
  }

  loadForm(){
    this.formGroup = this.fb.group({
      name: [this.user_selected.name, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      surname: [this.user_selected.surname, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      email: [this.user_selected.email, Validators.compose([Validators.required, Validators.email, Validators.maxLength(240)])],      
      password: [null, Validators.compose([Validators.nullValidator, Validators.maxLength(100)])],
      password_confirmation: [null, Validators.compose([Validators.nullValidator, Validators.maxLength(100)])],
      /* type_user: [2], //1 cliente | 2 admin. Ya esta definido Administrador*/
      state: [this.user_selected.state],
      role_id: [this.user_selected.role_id],
    });
  }

  update(){
    if (this.formGroup.value.password && this.formGroup.value.password_confirmation) {
      if (this.formGroup.value.password != this.formGroup.value.password_confirmation) {
        this.toaster.open(NoticyAlertComponent, {text: `danger-'Contraseñas no coinciden'`});
        return;
      }
    }
    this._userService.update(this.user_selected.id, this.formGroup.value).subscribe((resp:any) => {
      //console.log(resp);
      if (resp.message == 200) {
        this.toaster.open(NoticyAlertComponent, {text: `success-'El usuario se actualizo correctamente'`});
        this.modal.close();
        this.usersEvent.emit(resp.user);
        return;
      } else {
        this.toaster.open(NoticyAlertComponent, {text: `warning-'El usuario ya existe'`});
        return;
      }
      
    })
  }

  // helpers para vistas
  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string) {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }

}
