import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
  })

export class AuthService {
authUser: any;


constructor(){}

aauthUser(user: any) {
    let userArray: any[] = [];
  
    // Get the stored users from localStorage
    const storedUsersString = localStorage.getItem('Users');
  
    // Check if storedUsersString is not null
    if (storedUsersString !== null) {
      // Parse the stored users string into an array
      userArray = JSON.parse(storedUsersString);
    }
  
    // Find the user in the array
    const foundUser = userArray.find(
      (p) => p.userName === user.userName && p.password === user.password
    );
  
    // Return the found user or null if not found
    return foundUser || null;
  }
  

}