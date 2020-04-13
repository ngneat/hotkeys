import { NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HOTKEYS_CONFIG, HotkeysModule } from '@ngneat/hotkeys';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HotkeysModule, BrowserAnimationsModule, MatSnackBarModule],
  providers: [
    {
      provide: HOTKEYS_CONFIG,
      useValue: { helpShortcut: 'meta.h' }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
