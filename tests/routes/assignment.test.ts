import request from 'supertest';
import router from '../../src/routes/lecturerRoutes';

describe('Assignment Routes', () => {
  it('should create an assignment', async () => {
    const assignmentData = {
      title: 'Sample Assignment',
      description: 'This is a sample assignment',
      deadline: '2023-07-31T23:59:59Z',
    };

    const response = await request(router)
      .post('/create-assignment')
      .send(assignmentData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('title', assignmentData.title);
    expect(response.body).toHaveProperty(
      'description',
      assignmentData.description
    );
    expect(response.body).toHaveProperty('deadline', assignmentData.deadline);
  });

  it('should update an assignment', async () => {
    const assignmentId = '';
    const updatedAssignmentData = {
      title: 'Updated Assignment',
      description: 'This is an updated assignment',
      deadline: '2023-08-15T23:59:59Z',
    };

    const response = await request(router)
      .put(`/update-assignment/${assignmentId}`)
      .send(updatedAssignmentData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', assignmentId);
    expect(response.body).toHaveProperty('title', updatedAssignmentData.title);
    expect(response.body).toHaveProperty(
      'description',
      updatedAssignmentData.description
    );
    expect(response.body).toHaveProperty(
      'deadline',
      updatedAssignmentData.deadline
    );
  });

  it('should delete an assignment', async () => {
    const assignmentId = '';

    const response = await request(router).put(
      `/delete-assignment/${assignmentId}`
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      'message',
      'Assignment deleted successfully'
    );
  });

  it('should get assignments', async () => {
    const response = await request(router).get('/assignments');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('assignments');
    expect(response.body.assignments).toBeInstanceOf(Array);
    // Add more assertions based on the expected response structure and data
  });
});
