import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ENVIRONMENT } from '../tokens/environment';
import { PLATFORM_ID } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';



describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const mockEnv = { baseUrl: 'http://localhost:3000/' };
  const mockUsers = [
    { id: 1, name: 'Test User' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [
        UserService,
        provideHttpClientTesting(),
        { provide: ENVIRONMENT, useValue: mockEnv },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  //test getUsers()
  it('Should test getUsers() and give an array of users', () => {
    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(`${mockEnv.baseUrl}users`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  // test addUser()
  it('should test addUser() and return the added user', () => {
    const newUser = { name: 'New User' };
    const mockUser = { name: 'New User', email: 'user@gmail.com' };
    const mockResponse = { message: 'User added successfully' };



    service.addUser(newUser).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${mockEnv.baseUrl}users`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newUser);
    req.flush(mockResponse);
  });

  //Unit test for login()
  it('should fetch the logged-in user by email', () => {
    const testEmail = 'user@gmail.com';
    const mockResponse = [{ name: 'Test User', email: testEmail }];

    service.getLoggedInUser(testEmail).subscribe(users => {
      expect(users).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${mockEnv.baseUrl}users?email=${testEmail}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  //Unit test for deleteUser()
  it('should delete a user by id', () => {
    const userId = 123;
    const mockResponse = { success: true };

    service.deleteUser(userId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${mockEnv.baseUrl}users/${userId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  // Unit test for getRoles()
  it('should fetch an array of roles and give them as an array', () => {
    const mockRoles = [
      { name: 'Admin' },
      { name: 'Developer' },
      { name: 'Designer' },
      { name: 'HR' }
    ];

    service.getRoles().subscribe(roles => {
      expect(roles).toEqual(mockRoles);
    });

    const req = httpMock.expectOne(`${mockEnv.baseUrl}roles`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRoles);
  });

  // test addTasks()
  it('should post a new task into the database', () => {
    const taskData = { taskName: 'Test Task', status: 'Pending' };
    const mockResponse = "Task added successfully."

    service.addTasks(taskData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${mockEnv.baseUrl}tasks`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(taskData);
    req.flush(mockResponse);
  });

  // Unit test for getTasks()
  it('should fetch an array of tasks', () => {
    const mockTasks = [
      { id: 1, name: 'Task One' },
      { id: 2, name: 'Task Two' }
    ];

    service.getTasks().subscribe(tasks => {
      expect(tasks).toEqual(mockTasks);
    });

    const req = httpMock.expectOne(`${mockEnv.baseUrl}tasks`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);
  });

  // Unit test for updateTask()
  it('should update a task via PATCH', () => {
    let taskId: any;
    const updateData = { status: 'Completed', assignedTo: 'Alice' };
    const updatedTask = { taskId, ...updateData };
    let mockResponse = "Task updated successfully."

    service.updateTask(taskId, updateData).subscribe(response => {
      expect(response).toEqual(updatedTask);
    });

    const req = httpMock.expectOne(`${mockEnv.baseUrl}tasks/${taskId}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(updateData);
    req.flush(mockResponse);
  });

  // Unit test for deleteTask()
  it('should delete a task by id', () => {
    let taskId;
    const mockResponse = { success: true };

    service.deleteTask(taskId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${mockEnv.baseUrl}tasks/${taskId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  // Unit test for updateUserByEmail()
  it('should update user by ID', () => {
    let userId;
    const updateData = { name: 'Updated Name', department: 'HR' };
    const mockResponse = { success: true };

    service.updateUserByEmail(userId, updateData).subscribe(resp => {
      expect(resp).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${mockEnv.baseUrl}users/${userId}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(updateData);
    req.flush(mockResponse);
  });

    // test updatePhoto()
    it('should update the user profile photo via PATCH', () => {
      let userId;
      const userProfile  = { userProfile: 'base64-encoded-string' };
      const mockResponse = { success: true };
  
      service.updatePhoto(userId, userProfile).subscribe(resp => {
        expect(resp).toEqual(mockResponse);
      });
  
      const req = httpMock.expectOne(`${mockEnv.baseUrl}users/${userId}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(userProfile);
      req.flush(mockResponse);
    });
  

});
