import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IDrive } from '@cru-transfer/core';

@Component({
  selector: 'cru-card-drive',
  templateUrl: './card-drive.component.html',
  styleUrls: ['./card-drive.component.scss']
})
export class CardDriveComponent implements OnInit {

  @Input() drive: IDrive;

  @Output() select: EventEmitter<IDrive> = new EventEmitter<IDrive>();

  constructor() { }

  ngOnInit() {
  }

  onSelect() {
    this.select.emit(this.drive);
  }

}
