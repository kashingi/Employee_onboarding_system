import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideNavComponent } from './side-nav.component';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';



describe('SideNavComponent', () => {
  let component: SideNavComponent;
  let fixture: ComponentFixture<SideNavComponent>;

  const mockUserService = {};

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: (key: string) => null, // Mock paramMap.get
      },
    },
    queryParams: of({}),
    data: of({}),
  };


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SideNavComponent,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
