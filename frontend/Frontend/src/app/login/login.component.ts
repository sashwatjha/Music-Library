import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../model/User';
import { SignuploginService } from '../signuplogin.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  
  public loginForm! : FormGroup

  constructor(private _signuploginservice: SignuploginService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute){
    this.loginForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    });
  }
  
  ngOnInit(): void {}

  login() {
    //console.log(this.loginForm.value);

    if (this.loginForm.valid) {
      this._signuploginservice.login(this.loginForm.value)
        .subscribe({
          next:(data) => {
            console.log(data);
            localStorage.setItem('token', data.toString());
            this._router.navigate(['/welcome']);
          },
          error:(error)=>{
            alert(error['error']['message']);
          }
        });
    }
  }

  movetosignup() {
    this._router.navigate(['../signup'], { relativeTo: this._activatedRoute });
  }

}
