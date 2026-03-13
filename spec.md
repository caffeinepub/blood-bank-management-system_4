# Blood Bank Management System

## Current State
Single Sign In button on landing page. After login, redirected by role.

## Requested Changes (Diff)

### Add
- /admin-login route: AdminLoginPage dark/formal, Administrator Portal
- /user-login route: UserLoginPage warm/friendly, Patient & Donor Portal

### Modify
- LandingPage: two buttons - Admin Login and User/Donor Login
- App.tsx: add new routes

### Remove
- Nothing

## Implementation Plan
1. Create AdminLoginPage.tsx
2. Create UserLoginPage.tsx
3. Update App.tsx with routes
4. Update LandingPage.tsx with two-button login choice
