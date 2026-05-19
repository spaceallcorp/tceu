import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventosSPostarComponent } from './eventos-s-postar.component';

describe('EventosSPostarComponent', () => {
  let component: EventosSPostarComponent;
  let fixture: ComponentFixture<EventosSPostarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventosSPostarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventosSPostarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
