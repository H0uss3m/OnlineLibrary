import { Book } from './../models/Book.model';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase'
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  books: Book[] = [];
  bookSubject = new Subject<Book[]>();
  constructor() { }

  emitBooks() {
    this.bookSubject.next(this.books)
  }
  saveBooks() {
    firebase.database().ref('/books').set(this.books);
  }
  getBooks() {
    firebase.database().ref('/books').on('value', (data) => {
      this.books = data.val() ? data.val() : [];
      this.emitBooks()
    })
  }
  getSingleBook(id: number) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/books/' + id).once('value').then(
          (data) => {
            resolve(data.val())
          }, (error) => {
            reject(error)
          }
        )
      }
    )
  }
  createNewBook(newBook: Book) {
    this.books.push(newBook);
    this.saveBooks();
    this.emitBooks();
  }
  removeBook(book: Book) {
    if (book.photo) {
      const storageRef = firebase.storage().refFromURL(book.photo);
      storageRef.delete().then(
        () => {
          console.log('photo supprimée')
        }
      ).catch(
        (error) => {
          console.log('Fichier non trouvé', error)
        }
      )
    }

    const bookIndexToRemove = this.books.findIndex(
      (bookEl) => {
        if (book === bookEl) {
          return true
        }
      }
    );
    this.books.splice(bookIndexToRemove, 1)
    this.saveBooks();
    this.emitBooks();
  }
  uploadFile(file: File) {
    return new Promise(
      (resolve, reject) => {
        const almostUniqueFile = Date.now().toString();
        const upload = firebase.storage().ref()
          .child('images/' + almostUniqueFile + file.name)
          .put(file);

        upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
          () => {
            console.log('chargement en cours ...');
          },
          (error) => {
            console.log('erreur de chargement', error);
            reject();
          },
          () => {
            upload.snapshot.ref.getDownloadURL().then(
              (downloadUrl) => {
                console.log('Upload successful! (' + downloadUrl + ')');
                resolve(downloadUrl);
              }
            );
          })
      }
    )
  }
}
