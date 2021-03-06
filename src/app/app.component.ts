import { BooksService } from './services/books.service';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
 constructor(private booksService:BooksService) {
  var firebaseConfig = {
    apiKey: "AIzaSyAZamjVja0jjt8Nq7SE80Zxil62DOyUll8",
    authDomain: "world-of-books-686dd.firebaseapp.com",
    databaseURL: "https://world-of-books-686dd.firebaseio.com",
    projectId: "world-of-books-686dd",
    storageBucket: "world-of-books-686dd.appspot.com",
    messagingSenderId: "486724279368",
    appId: "1:486724279368:web:588cc6fdb8ca29fbb64c7d",
    measurementId: "G-GVW9HB7N92"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // firebase.analytics();
 }
 ngOnInit(){
    this.booksService.getBooks()
 }
}
