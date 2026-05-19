import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventosSListarComponent } from './eventos-s-listar.component';

describe('EventosSListarComponent', () => {
  let component: EventosSListarComponent;
  let fixture: ComponentFixture<EventosSListarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventosSListarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventosSListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
