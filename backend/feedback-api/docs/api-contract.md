# Feedback API Contract

## Response Convention

The frontend request layer expects:

```json
{
  "code": "0000",
  "msg": "success",
  "data": {}
}
```

## Auth

### `POST /auth/login`

Request:

```json
{
  "userName": "Admin",
  "password": "123456"
}
```

Response:

```json
{
  "code": "0000",
  "msg": "success",
  "data": {
    "token": "jwt-token",
    "refreshToken": "refresh-token"
  }
}
```

### `GET /auth/getUserInfo`

Response:

```json
{
  "code": "0000",
  "msg": "success",
  "data": {
    "userId": "usr_xxx",
    "userName": "Admin",
    "roles": ["R_ADMIN"],
    "buttons": []
  }
}
```

## Public Feedback

### `GET /feedback/forms`

Query:

- `keyword`
- `caseType`
- `status`
- `startDate`
- `endDate`

Response:

```json
{
  "code": "0000",
  "msg": "success",
  "data": [
    {
      "id": "F-001",
      "title": "Pantry Feedback",
      "description": "Collect suggestions for pantry supplies.",
      "status": "enabled",
      "caseType": "normal",
      "startAt": "2026-04-01",
      "endAt": null,
      "questionCount": 5,
      "estimatedMinutes": 2,
      "responseCount": 48,
      "tags": ["Always open", "Office"]
    }
  ]
}
```

### `GET /feedback/forms/:formId`

Response:

```json
{
  "code": "0000",
  "msg": "success",
  "data": {
    "id": "F-001",
    "title": "Pantry Feedback",
    "description": "Collect suggestions for pantry supplies.",
    "status": "enabled",
    "caseType": "normal",
    "startAt": "2026-04-01",
    "endAt": null,
    "estimatedMinutes": 2,
    "responseCount": 48,
    "tags": ["Always open", "Office"],
    "questions": [
      {
        "id": "Q-001",
        "title": "What should we improve?",
        "description": "",
        "type": "text",
        "required": true,
        "options": []
      }
    ]
  }
}
```

### `POST /feedback/forms/:formId/submit`

Request:

```json
{
  "formId": "F-001",
  "anonymous": true,
  "answers": [
    {
      "questionId": "Q-001",
      "value": "More healthy snacks"
    }
  ]
}
```

Response:

```json
{
  "code": "0000",
  "msg": "success",
  "data": true
}
```

## Admin Feedback Forms

### `GET /admin/feedback/forms`

Response:

- same shape as `GET /feedback/forms`

### `POST /admin/feedback/forms`

### `PUT /admin/feedback/forms/:formId`

Request:

```json
{
  "title": "Quarterly Manager Feedback",
  "description": "Internal upward feedback.",
  "status": "enabled",
  "startAt": "2026-05-01",
  "endAt": "2026-05-15",
  "estimatedMinutes": 6,
  "tags": ["Confidential", "Leadership"],
  "questions": [
    {
      "id": "Q-001",
      "title": "How clear is your manager?",
      "description": "",
      "type": "star",
      "required": true,
      "options": []
    }
  ]
}
```

Response:

- same shape as `GET /feedback/forms/:formId`

### `PATCH /admin/feedback/forms/:formId/status`

Request:

```json
{
  "status": "disabled"
}
```

Response:

```json
{
  "code": "0000",
  "msg": "success",
  "data": true
}
```

## Admin Responses

### `GET /admin/feedback/forms/:formId/responses`

Response:

```json
{
  "code": "0000",
  "msg": "success",
  "data": [
    {
      "id": "R-001",
      "formId": "F-001",
      "submittedAt": "2026-04-15 09:20",
      "submitterName": null,
      "anonymous": true,
      "answers": [
        {
          "questionId": "Q-001",
          "value": "More healthy snacks"
        }
      ]
    }
  ]
}
```

### `GET /admin/feedback/forms/:formId/responses/summary`

Response:

```json
{
  "code": "0000",
  "msg": "success",
  "data": {
    "totalResponses": 48,
    "anonymousResponses": 30
  }
}
```

## Future Endpoints

- `GET /admin/feedback/forms/:formId/export`
- `GET /admin/feedback/forms/:formId/questions/:questionId/summary`
- `PATCH /users/change-password`
