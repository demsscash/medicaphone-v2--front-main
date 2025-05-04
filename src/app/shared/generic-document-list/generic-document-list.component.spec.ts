import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericDocumentListComponent } from './generic-document-list.component';

describe('GenericDocumentListComponent', () => {
  let component: GenericDocumentListComponent;
  let fixture: ComponentFixture<GenericDocumentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericDocumentListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericDocumentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
