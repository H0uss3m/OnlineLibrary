import { Book } from './../../models/Book.model';
import { BooksService } from './../../services/books.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.scss']
})
export class BookFormComponent implements OnInit {
  bookForm: FormGroup;
  fileUrl:string;
  fileIsUploading = false;
  fileUploaded = false;
  constructor(private formBuilder: FormBuilder,
    private booksService: BooksService,
    private router: Router) { }

  ngOnInit() {
    this.initForm();
  }
  initForm() {
    this.bookForm = this.formBuilder.group({
      title: ['', Validators.required],
      author: ['', Validators.required]
    });
  }
  onSaveBook() {
    const title = this.bookForm.get('title').value;
    const author = this.bookForm.get('author').value;
    const newBook = new Book(title, author);
    console.log("file",this.fileUrl)
    if(this.fileUrl && this.fileUrl !== ''){
      newBook.photo = this.fileUrl;
    }
    this.booksService.createNewBook(newBook);
    this.router.navigate(['/books']);
  }
  onUploadFile(file:File){
    this.fileIsUploading = true;
    this.booksService.uploadFile(file).then(
      (url:string)=>{
        this.fileUrl = url;
        this.fileIsUploading = false;
        this.fileUploaded = true
      }
    )
  }
  detectFiles(event){
    this.onUploadFile(event.target.files[0]);
  }
}
