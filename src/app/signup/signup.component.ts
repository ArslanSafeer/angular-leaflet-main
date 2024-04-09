import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
public signupForm !: FormGroup;


  constructor(private formBuilder :  FormBuilder, private http:HttpClient , private router:Router){}
  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({

      userName:[''],
      email:[''],
      password:[''],


    })
  }
  signUp(){
    this.http.post<any>('http://localhost:3000/signupUsers', this.signupForm.value)
  .subscribe({
    next: (res) => {
      alert('Signup Successfully');
      this.signupForm.reset();
      this.router.navigate(['user-login']);
    },
    error: (err) => {
      alert('Something went wrong');
    }
  });
  }
  
}
