import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserService } from '../../services/user.service';
import { SidebarComponent } from './sidebar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ActivatedRouteSnapshot } from '@angular/router';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

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
        SidebarComponent,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: ActivatedRouteSnapshot, useValue: mockActivatedRoute }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
