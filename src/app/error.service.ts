import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  constructor(private _snackBar: MatSnackBar) {}

  showToast(message: string, error?: Error) {
    if (error) {
      console.error(error.message || error);
    }
    this._snackBar.open(message, 'Dismiss', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
