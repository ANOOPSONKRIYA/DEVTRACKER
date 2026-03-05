Day 4 Test Plan - Authentication Frontend

Prerequisites
- Start backend: cd server && npm install && npm run dev
- Start frontend: cd client && npm install && npm run dev
- Ensure backend is running on http://localhost:5000 and frontend on http://localhost:5173

Test 1: Register page renders
- Open http://localhost:5173/register
- Expected: Name, Email, Password, Confirm Password fields are visible
- Expected: Register button is visible

Test 2: Register form validation
- Submit empty form
- Expected: "Name is required"
- Enter name with 1 character and submit
- Expected: "Name must be at least 2 characters"
- Enter invalid email and submit
- Expected: "Please enter a valid email address"
- Enter password with less than 6 characters and submit
- Expected: "Password must be at least 6 characters"
- Enter mismatch password and confirm password
- Expected: "Passwords do not match"

Test 3: Successful registration flow
- Register with a new user
- Expected: Redirect to /dashboard
- Expected: Dashboard shows user name and email
- Expected: localStorage has keys devtrackr_auth_token and devtrackr_auth_user

Test 4: Login page renders
- Open http://localhost:5173/login
- Expected: Email and Password fields are visible
- Expected: Login button is visible

Test 5: Login form validation
- Submit empty login form
- Expected: "Email and password are required"
- Enter invalid email format
- Expected: "Please enter a valid email address"
- Enter password with less than 6 characters
- Expected: "Password must be at least 6 characters"

Test 6: Successful login flow
- Login using registered credentials
- Expected: Redirect to /dashboard
- Expected: Protected API check shows "Protected route access granted"

Test 7: Protected route guard
- Clear localStorage
- Open http://localhost:5173/dashboard
- Expected: Redirect to /login

Test 8: Logout flow
- Login and open dashboard
- Click Logout
- Expected: Redirect to /login
- Expected: localStorage keys devtrackr_auth_token and devtrackr_auth_user are removed

Test 9: Public route guard for authenticated user
- Login successfully
- Navigate to /login or /register
- Expected: Redirect to /dashboard

Test 10: Invalid credentials
- Try login with wrong password
- Expected: Error message "Invalid email or password"

Day 5 Test Plan - Dashboard Shell

Prerequisites
- Start backend: cd server && npm install && npm run dev
- Start frontend: cd client && npm install && npm run dev
- Login with a valid account and open http://localhost:5173/dashboard

Test 1: Dashboard shell renders
- Expected: Sidebar is visible on desktop with items Overview, Daily Logs, DSA Tracker, Projects, Analytics
- Expected: Topbar is visible with date label and Welcome text showing user name and email
- Expected: Logout button is visible in topbar

Test 2: Placeholder metric cards render
- Expected: 4 metric cards are visible
- Expected card titles: Current Streak, Hours This Week, DSA Solved, Projects Tracked
- Expected hint text exists on each card (Connects on Day 8/13/10/12)

Test 3: Protected content section remains visible
- Expected: Section title "Protected API check" is visible
- Expected: Protected API response message eventually replaces "Loading protected data..."

Test 4: Mobile menu interaction
- Open browser devtools and switch to a mobile viewport (for example 390x844)
- Expected: Sidebar is hidden by default and Menu button is visible in topbar
- Tap Menu
- Expected: Sidebar slides in from left and overlay appears
- Tap outside sidebar on overlay
- Expected: Sidebar closes

Test 5: Responsive layout behavior
- At desktop width (>= 1280px)
- Expected: Metric cards appear in a single row of 4 columns
- At tablet width (~768px)
- Expected: Metric cards wrap to 2 columns
- At mobile width (< 640px)
- Expected: Metric cards appear in 1 column and content remains readable without horizontal overflow

Test 6: Logout regression check
- Click Logout from dashboard topbar
- Expected: Redirect to /login
- Expected: localStorage keys devtrackr_auth_token and devtrackr_auth_user are removed

Test 7: Protected route regression check
- After logout, navigate to http://localhost:5173/dashboard
- Expected: Redirect to /login

Day 6 Test Plan - Daily Logs Backend

Prerequisites
- Start backend: cd server && npm install && npm run dev
- Ensure API is running on http://localhost:5000
- Register or login to get JWT token from /api/auth/register or /api/auth/login
- Use Authorization header on all daily-log endpoints: Bearer <token>

Sample payload (required fields)
- {
	"date": "2026-03-05",
	"hours": 3.5,
	"description": "Solved arrays problems and updated dashboard layout",
	"tags": ["dsa", "frontend"],
	"links": ["https://github.com/example/repo/pull/1"]
}

Test 1: Create daily log
- POST http://localhost:5000/api/daily-logs
- Expected: 201 Created
- Expected: Response has message "Daily log created successfully" and dailyLog object with id

Test 2: Validation check for missing required fields
- POST /api/daily-logs with missing date or hours or description
- Expected: 400 Bad Request with field-specific message

Test 3: Validation check for invalid links
- POST /api/daily-logs with links: ["not-a-url"]
- Expected: 400 Bad Request with validation message for links

Test 4: List user daily logs
- GET http://localhost:5000/api/daily-logs
- Expected: 200 OK
- Expected: Returns only logs for authenticated user in dailyLogs array sorted by date desc

Test 5: Get single daily log by id
- GET http://localhost:5000/api/daily-logs/:logId
- Expected: 200 OK and matching dailyLog

Test 6: Update daily log
- PUT http://localhost:5000/api/daily-logs/:logId with body { "hours": 4, "tags": ["dsa", "api"] }
- Expected: 200 OK
- Expected: message "Daily log updated successfully"

Test 7: Delete daily log
- DELETE http://localhost:5000/api/daily-logs/:logId
- Expected: 200 OK
- Expected: message "Daily log deleted successfully"

Test 8: Ownership protection check
- Login as User A and create a daily log
- Login as User B and try GET/PUT/DELETE that same log id
- Expected: 404 Daily log not found (no cross-user access)

Test 9: Auth protection check
- Call any /api/daily-logs endpoint without Bearer token
- Expected: 401 Missing or invalid Authorization header
