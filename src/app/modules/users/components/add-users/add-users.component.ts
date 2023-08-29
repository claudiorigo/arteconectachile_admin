import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../_services/users.service';
import { Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss']
})
export class AddUsersComponent implements OnInit {

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
      name: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      surname: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      email: [null, Validators.compose([Validators.required, Validators.email, Validators.maxLength(240)])],      
      password: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
      password_confirmation: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
      type_user: [2],
      role_id: [1],
    });
  }

  save(){
    if (this.formGroup.value.password != this.formGroup.value.password_confirmation) {      
      this.toaster.open(NoticyAlertComponent, {text: `danger-'Contraseñas no coinciden'`});
      return;
    }
    this._userService.register(this.formGroup.value).subscribe((resp:any) => {      
      if (resp.message == 200) {
        this.toaster.open(NoticyAlertComponent, {text: `success-'El usuario se creo correctamente'`});
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
