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
