import { Component,OnInit } from '@angular/core';
import { FormGroup,FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {
  public loginForm !: FormGroup;
  constructor(private formBuilder :  FormBuilder, private http:HttpClient , private router:Router ){}
  
  ngOnInit() {

    this.loginForm = this.formBuilder.group({

      userName:[''],
      password:[''],


    })
  }

  login(){
    this.http.get<any>('http://localhost:3000/signupUsers')
    .subscribe({
      next: (res) => {
        const user = res.find((a:any)=>
        {
          return a.userName === this.loginForm.value.userName && a.password ===this.loginForm.value.password
        });
        if(user){
          alert('User Login Successfully');
          this.loginForm.reset();
          this.router.navigate(['dashboard']);
        }else{
          alert('User not Found');
        }
        
      }
    });


  }


}








