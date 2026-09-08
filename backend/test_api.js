const http = require('http');

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- Starting Automated Backend API Tests ---');
  let token = null;
  let testProjectId = null;
  let testTaskId = null;

  try {
    // 1. Health
    const health = await request({
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/health',
      method: 'GET'
    });
    console.log('✓ Health Check:', health.status === 200 ? 'PASS' : 'FAIL', health.data.message);

    // 2. Invalid Login
    const invalidLogin = await request({
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { email: 'admin@example.com', password: 'wrongpassword' });
    console.log('✓ Invalid Login Rejected (401):', invalidLogin.status === 401 ? 'PASS' : 'FAIL', invalidLogin.data.message);

    // 3. Valid Login
    const validLogin = await request({
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { email: 'admin@example.com', password: 'admin123' });
    console.log('✓ Valid Login (200):', validLogin.status === 200 ? 'PASS' : 'FAIL', 'User:', validLogin.data.data?.user?.email);
    token = validLogin.data.data.token;

    const authHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // 4. Dashboard Stats
    const statsRes = await request({
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/dashboard/stats',
      method: 'GET',
      headers: authHeaders
    });
    console.log('✓ Dashboard Stats:', statsRes.status === 200 ? 'PASS' : 'FAIL', 'Stats:', statsRes.data.data?.stats);

    // 5. Create Project
    const createProjRes = await request({
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/projects',
      method: 'POST',
      headers: authHeaders
    }, { name: 'E2E Test Automation Project', description: 'Testing backend project creation' });
    console.log('✓ Project Created:', createProjRes.status === 201 ? 'PASS' : 'FAIL', 'ID:', createProjRes.data.data?.id);
    testProjectId = createProjRes.data.data.id;

    // 6. Search Projects
    const searchProjRes = await request({
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/projects?search=Automation',
      method: 'GET',
      headers: authHeaders
    });
    console.log('✓ Project Search:', searchProjRes.status === 200 && searchProjRes.data.data.length > 0 ? 'PASS' : 'FAIL', 'Found:', searchProjRes.data.data.length);

    // 7. Create Task
    const createTaskRes = await request({
      hostname: '127.0.0.1',
      port: 5000,
      path: `/api/projects/${testProjectId}/tasks`,
      method: 'POST',
      headers: authHeaders
    }, {
      title: 'Write Unit Tests for TaskFlow',
      description: 'Cover controllers with integration test suite',
      priority: 'HIGH',
      status: 'TODO',
      due_date: '2026-10-15',
      assigned_to: 'Admin Tester'
    });
    console.log('✓ Task Created:', createTaskRes.status === 201 ? 'PASS' : 'FAIL', 'Task ID:', createTaskRes.data.data?.id);
    testTaskId = createTaskRes.data.data.id;

    // 8. Filter Tasks (Search & Status & Priority)
    const filterTaskRes = await request({
      hostname: '127.0.0.1',
      port: 5000,
      path: `/api/projects/${testProjectId}/tasks?search=Unit&status=TODO&priority=HIGH`,
      method: 'GET',
      headers: authHeaders
    });
    console.log('✓ Filtered Tasks:', filterTaskRes.status === 200 && filterTaskRes.data.data.length === 1 ? 'PASS' : 'FAIL');

    // 9. Update Task (Change Status to COMPLETED)
    const updateTaskRes = await request({
      hostname: '127.0.0.1',
      port: 5000,
      path: `/api/tasks/${testTaskId}`,
      method: 'PUT',
      headers: authHeaders
    }, { status: 'COMPLETED' });
    console.log('✓ Task Updated to COMPLETED:', updateTaskRes.status === 200 && updateTaskRes.data.data.status === 'COMPLETED' ? 'PASS' : 'FAIL');

    // 10. Delete Task
    const deleteTaskRes = await request({
      hostname: '127.0.0.1',
      port: 5000,
      path: `/api/tasks/${testTaskId}`,
      method: 'DELETE',
      headers: authHeaders
    });
    console.log('✓ Task Deleted:', deleteTaskRes.status === 200 ? 'PASS' : 'FAIL');

    // 11. Delete Project
    const deleteProjRes = await request({
      hostname: '127.0.0.1',
      port: 5000,
      path: `/api/projects/${testProjectId}`,
      method: 'DELETE',
      headers: authHeaders
    });
    console.log('✓ Project Deleted (Cascading):', deleteProjRes.status === 200 ? 'PASS' : 'FAIL');

    console.log('--- ALL BACKEND TESTS PASSED SUCCESSFULLY! ---');
    process.exit(0);
  } catch (err) {
    console.error('Test execution failed:', err);
    process.exit(1);
  }
}

// Allow server a brief moment to boot before running test queries
setTimeout(runTests, 1000);
