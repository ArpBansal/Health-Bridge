# Healthcare Project API Documentation

## Overview

This project provides a comprehensive healthcare management system with features including:
- User authentication and registration
- AI-assisted chat functionality
- Healthcare form submission and management
- Blog post creation and management with commenting system

This README will guide you through the available API endpoints, request formats, and authentication requirements.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
   - [Registration](#registration)
   - [OTP Verification](#otp-verification)
   - [Login](#login)
   - [Token Refresh](#token-refresh)
   - [Logout](#logout)
3. [AI Chat](#ai-chat)
   - [List Chats](#list-chats)
   - [Create Chat](#create-chat)
   - [Send Message](#send-message)
   - [Get Chat Messages](#get-chat-messages)
4. [Healthcare Forms](#healthcare-forms)
   - [List Forms](#list-forms)
   - [Submit Form](#submit-form)
   - [View User's Form](#view-users-form)
   - [Generate PDF](#generate-pdf)
   - [Update Form](#update-form)
5. [Blog System](#blog-system)
   - [List Posts](#list-posts)
   - [Create Post](#create-post)
   - [Delete Post](#delete-post)
   - [Post Comments](#post-comments)
   - [Comment Management](#comment-management)
6. [Error Handling](#error-handling)
7. [Frontend Integration Guidelines](#frontend-integration-guidelines)

## Getting Started

The API is hosted at `http://127.0.0.1:8000/` during development. For production, this will change to your deployed server URL.

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Most endpoints require an Authorization header with a Bearer token:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Registration

**Endpoint:** `POST /auth/register/`

**Request Body:**
```json
{
    "username": "username",
    "email": "user@example.com",
    "password": "secure_password",
    "confirm_password": "secure_password"
}
```

**Response:** Registration confirmation and OTP sent to the provided email

### OTP Verification

**Endpoint:** `POST /auth/verify-otp/`

**Request Body:**
```json
{
    "email": "user@example.com",
    "otp": "123456"
}
```

**Response:** Verification confirmation

### Resend OTP

**Endpoint:** `POST /auth/resend-otp/`

**Request Body:**
```json
{
    "email": "user@example.com"
}
```

**Response:** Confirmation of OTP resent

### Login

**Endpoint:** `POST /auth/login/`

**Request Body:**
```json
{
    "username": "username",
    "password": "secure_password"
}
```

**Response:** Access and refresh tokens

### Token Refresh

**Endpoint:** `POST /auth/refresh/`

**Headers:** Authorization with Bearer token

**Request Body:**
```json
{
    "refresh": "refresh_token_here"
}
```

**Response:** New access token

### Logout

**Endpoint:** `POST /auth/logout/`

**Headers:** Authorization with Bearer token

**Request Body:**
```json
{
    "refresh": "refresh_token_here"
}
```

**Response:** Logout confirmation

## AI Chat

### List Chats

**Endpoint:** `GET /ai/chats/`

**Headers:** Authorization with Bearer token

**Response:** List of user's chat sessions

### Create Chat

**Endpoint:** `POST /ai/chats/`

**Headers:** Authorization with Bearer token

**Response:** New chat session details with ID

### Send Message

**Endpoint:** `POST /ai/chat/{chat_id}/messages/`

**Headers:** Authorization with Bearer token

**Request Body:**
```json
{
    "content": "Your message text here"
}
```

**Response:** Message details and AI response

### Get Chat Messages

**Endpoint:** `GET /ai/chat/{chat_id}/messages/`

**Headers:** Authorization with Bearer token

**Response:** All messages in the specified chat

## Healthcare Forms

### List Forms

**Endpoint:** `GET /healthcare/form/list/`

**Headers:** Authorization with Bearer token

**Response:** List of all healthcare forms (likely admin-only)

### Submit Form

**Endpoint:** `POST /healthcare/form/submit/`

**Headers:** Authorization with Bearer token

**Request Body:**
```json
{
    "name": "Full Name",
    "age": 35,
    "gender": "Male/Female/Other",
    "state": "State/Province",
    "contact_details": "Phone number",
    "chronic_conditions": "Comma-separated conditions",
    "past_surgeries": "Comma-separated surgeries",
    "allergies": "Comma-separated allergies",
    "medications": "Comma-separated medications",
    "symptoms": "Current symptoms description",
    "symptom_severity": "Mild/Moderate/Severe",
    "symptom_duration": "Acute/Chronic",
    "mental_health_stress": true/false,
    "mental_health_anxiety": true/false,
    "mental_health_depression": true/false,
    "vaccination_history": "Comma-separated vaccinations",
    "accessibility_needs": "Any special needs",
    "pregnancy_status": "Yes/No/Not Applicable",
    "emergency_contact": {
        "name": "Contact Name",
        "relationship": "Relationship",
        "number": "Contact Number"
    },
    "health_insurance_provider": "Insurance Provider",
    "health_insurance_policy": "Policy Number",
    "preferred_language": "Language",
    "research_participation": true/false
}
```

**Response:** Confirmation of form submission

### View User's Form

**Endpoint:** `GET /healthcare/form/me/`

**Headers:** Authorization with Bearer token

**Response:** Current user's healthcare form data

### Generate PDF

**Endpoint:** `GET /healthcare/generate-pdf/`

**Headers:** Authorization with Bearer token

**Response:** PDF of user's healthcare form (likely downloads the file)

### Update Form

**Endpoint:** `PATCH /healthcare/form/me/update/`

**Headers:** Authorization with Bearer token

**Request Body:** Include only fields that need updating
```json
{
    "name": "Updated Name",
    "age": 36
    // other fields as needed
}
```

**Response:** Updated form data

## Blog System

### List Posts

**Endpoint:** `GET /blogs/posts/`

**Response:** List of all blog posts (public endpoint)

### Create Post

**Endpoint:** `POST /blogs/posts/`

**Headers:** Authorization with Bearer token

**Request Body:**
```json
{
    "title": "Blog Post Title",
    "content": "Blog post content here"
}
```

**Response:** Created blog post details

### Delete Post

**Endpoint:** `DELETE /blogs/posts/{post_id}/`

**Headers:** Authorization with Bearer token (likely admin or post author only)

**Response:** Confirmation of deletion

### Post Comments

**Endpoint:** `GET /blogs/posts/{post_id}/comments/`

**Response:** All comments for the specified post (public endpoint)

### Comment Management

**Create Comment:**
**Endpoint:** `POST /blogs/posts/{post_id}/comments/`

**Headers:** Authorization with Bearer token

**Request Body:**
```json
{
    "content": "Comment text here"
}
```

**Response:** Created comment details

**Update Comment (PUT - Complete replacement):**
**Endpoint:** `PUT /blogs/posts/{post_id}/comments/{comment_id}/`

**Headers:** Authorization with Bearer token (comment author only)

**Request Body:**
```json
{
    "content": "Updated comment text"
}
```

**Response:** Updated comment details

**Update Comment (PATCH - Partial update):**
**Endpoint:** `PATCH /blogs/posts/{post_id}/comments/{comment_id}/`

**Headers:** Authorization with Bearer token (comment author only)

**Request Body:**
```json
{
    "content": "Partially updated comment text"
}
```

**Response:** Updated comment details

**Delete Comment:**
**Endpoint:** `DELETE /blogs/posts/{post_id}/comments/{comment_id}/`

**Headers:** Authorization with Bearer token (comment author or admin only)

**Response:** Confirmation of deletion

## Error Handling

The API returns appropriate HTTP status codes:
- 200/201: Success
- 400: Bad request (invalid data)
- 401: Unauthorized (authentication required)
- 403: Forbidden (not enough permissions)
- 404: Not found
- 500: Server error

Error responses include a message explaining the error.

## Frontend Integration Guidelines

### Authentication Flow

1. **Registration Process**:
   - Present registration form to user
   - Submit form to `/auth/register/` endpoint
   - Show OTP entry screen
   - Submit OTP to `/auth/verify-otp/` endpoint
   - Redirect to login or dashboard

2. **Login Process**:
   - Submit credentials to `/auth/login/` endpoint
   - Store received tokens (both access and refresh) securely
   - Access token in localStorage or secure cookie
   - Refresh token in HttpOnly cookie when possible
   - Include access token with all authenticated requests
   
3. **Token Management**:
   - Before token expiry, use refresh endpoint
   - Set up interceptor to handle 401 responses by refreshing token
   - If refresh fails, log out user and redirect to login

### Healthcare Forms

1. **Form Submission**:
   - Create a multi-step form for better user experience
   - Validate form fields on the frontend to match backend requirements
   - Allow form progress to be saved (consider local storage)
   - Submit complete form to the backend
   
2. **Form Updates**:
   - Populate form with existing data from `/healthcare/form/me/` endpoint
   - Allow users to edit specific sections
   - Submit only changed fields using PATCH

### AI Chat Integration

1. **Chat Interface**:
   - Create a new chat session when user first interacts
   - Display messages in conversation style UI
   - Show loading states while waiting for AI response
   - Support scrollable history of messages

### Blog Integration

1. **Blog Display**:
   - Public listing page for all posts
   - Individual post page with comments section
   - Comment form for authenticated users
   - Edit/delete options for user's own comments

2. **Blog Management** (for authorized users):
   - Create post interface with rich text editor
   - Edit/delete options for posts created by the user
   - Comment moderation features if needed

### General Guidelines

- Use a HTTP client like Axios or Fetch API
- Set up authentication headers for all protected routes
- Implement proper error handling and user feedback
- Consider using state management (Redux, Context API) for user auth state
- Create a responsive design that works well on mobile devices
- Consider accessibility for healthcare forms