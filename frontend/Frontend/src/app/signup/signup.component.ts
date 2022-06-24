import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { window } from 'rxjs';
import { User } from '../model/User';
import { SignuploginService } from '../signuplogin.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm!: FormGroup;
  successMessage: String = 'Error !!';

  

  constructor(private _signuploginservice: SignuploginService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute) {
    this.signupForm = new FormGroup({
      email: new FormControl(null, Validators.email),
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      cnfpass: new FormControl(null, this.passValidator)
    });

    this.signupForm.controls['password'].valueChanges
      .subscribe(
        x => this.signupForm.controls['cnfpass'].updateValueAndValidity()
      );
  }
  

  ngOnInit(): void {
    
  }

  passValidator(control: AbstractControl) {
    if (control && (control.value !== null || control.value !== undefined)) {
      const cnfpassValue = control.value;

      const passControl = control.root.get('password');
      if (passControl) {
        const passValue = passControl.value;
        if (passValue !== cnfpassValue || passValue === '') {
          return {
            isError: true
          };
        }
      }
    }

    return null;
  }

  register() {
    //All the signup values
    //console.log(this.signupForm.value);

    if (this.signupForm.valid) {
      this._signuploginservice.submitRegister(this.signupForm.value)
        .subscribe({
          next: (data) =>{
            this.successMessage = 'Registration Success';
            alert(this.successMessage);
            this.signupForm.reset();
          },
          error: (error)=>{
            alert("System Error !!")
          }
        }) ;
    }
    else{
      alert("Enter Correct Details !!!");
    }
  }

  movetologin() {
    this._router.navigate(['../login'], { relativeTo: this._activatedRoute });
  }
  
}
