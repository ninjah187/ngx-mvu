import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxMvuComponent } from './ngx-mvu.component';

describe('NgxMvuComponent', () => {
  let component: NgxMvuComponent;
  let fixture: ComponentFixture<NgxMvuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxMvuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NgxMvuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
