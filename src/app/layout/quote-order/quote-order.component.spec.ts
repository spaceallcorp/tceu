import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteOrderComponent } from './quote-order.component';

describe('QuoteOrderComponent', () => {
  let component: QuoteOrderComponent;
  let fixture: ComponentFixture<QuoteOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuoteOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuoteOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
