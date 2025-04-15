import { Component, OnInit, Inject, EventEmitter} from '@angular/core';
import { MatIconModule} from '@angular/material/icon'
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';




@Component({
  selector: 'app-confirmation',
  imports: [MatIconModule, MatToolbarModule, MatDialogModule, MatButtonModule],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss'
})
export class ConfirmationComponent implements OnInit{

  onEmitStatusChange = new EventEmitter();
  details: any = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {}

  ngOnInit(): void {
    if (this.dialogData && this.dialogData.confirmation) {
      this.details = this.dialogData;
    }
  }

  handleChangeAction() {
    this.onEmitStatusChange.emit();
  }
}
