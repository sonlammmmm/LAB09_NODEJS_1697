# API Test

---

## Auth API

> Base URL: `http:/alhost:300/loc0/api/v1/auth`

### 1. POST `/register` — Đăng ký

**Request**

```
POST http://localhost:3000/api/v1/auth/register
Content-Type: application/json
```

**Body** (JSON):

```json
{
  "username": "user1",
  "password": "123456",
  "email": "user1@gmail.com"
}
```

**Response** (200):

```json
{
  "_id": "6620...",
  "user": {
    "_id": "6610...",
    "username": "user1",
    "email": "user1@gmail.com"
  },
  "products": []
}
```

---

### 2. POST `/login` — Đăng nhập

**Request**

```
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json
```

**Body** (JSON):

```json
{
  "username": "user1",
  "password": "123456"
}
```

**Response** (200): Trả về token (string)

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> Sử dụng token này trong header `Authorization: Bearer <token>` cho các API bên dưới.

---

### 3. GET `/me` — Lấy thông tin user hiện tại

**Request**

```
GET http://localhost:3000/api/v1/auth/me
Authorization: Bearer <token>
```

**Body**: Không có

---

### 4. POST `/logout` — Đăng xuất

**Request**

```
POST http://localhost:3000/api/v1/auth/logout
Authorization: Bearer <token>
```

**Body**: Không có

**Response** (200):

```json
{
  "message": "logout"
}
```

---

## Message API

> Base URL: `http://localhost:3000/api/v1/messages`
>
> Tất cả route yêu cầu **Authorization**: `Bearer <token>`

---

## 1. GET `/` — Lấy message cuối cùng của mỗi cuộc hội thoại

Lấy tin nhắn cuối cùng giữa user hiện tại và từng user khác đã nhắn tin.

**Request**

```
GET http://localhost:3000/api/v1/messages
Authorization: Bearer <token>
```

**Body**: Không có

**Response** (200):

```json
[
  {
    "_id": "6620...",
    "from": {
      "_id": "6610...",
      "username": "user1",
      "fullName": "User One",
      "avatarUrl": "https://i.sstatic.net/l60Hf.png"
    },
    "to": {
      "_id": "6611...",
      "username": "user2",
      "fullName": "User Two",
      "avatarUrl": "https://i.sstatic.net/l60Hf.png"
    },
    "messageContent": {
      "type": "text",
      "text": "Hello!"
    },
    "createdAt": "2026-04-01T08:00:00.000Z",
    "updatedAt": "2026-04-01T08:00:00.000Z"
  }
]
```

---

## 2. GET `/:userID` — Lấy toàn bộ message giữa 2 user

Lấy tất cả tin nhắn giữa user hiện tại và user có `userID`.

**Request**

```
GET http://localhost:3000/api/v1/messages/6611abc123def456ghi789
Authorization: Bearer <token>
```

**Body**: Không có

**Response** (200):

```json
[
  {
    "_id": "6620...",
    "from": {
      "_id": "6610...",
      "username": "user1",
      "fullName": "User One",
      "avatarUrl": "https://i.sstatic.net/l60Hf.png"
    },
    "to": {
      "_id": "6611...",
      "username": "user2",
      "fullName": "User Two",
      "avatarUrl": "https://i.sstatic.net/l60Hf.png"
    },
    "messageContent": {
      "type": "text",
      "text": "Xin chào!"
    },
    "createdAt": "2026-04-01T07:00:00.000Z",
    "updatedAt": "2026-04-01T07:00:00.000Z"
  },
  {
    "_id": "6621...",
    "from": {
      "_id": "6611...",
      "username": "user2",
      "fullName": "User Two",
      "avatarUrl": "https://i.sstatic.net/l60Hf.png"
    },
    "to": {
      "_id": "6610...",
      "username": "user1",
      "fullName": "User One",
      "avatarUrl": "https://i.sstatic.net/l60Hf.png"
    },
    "messageContent": {
      "type": "text",
      "text": "Hello!"
    },
    "createdAt": "2026-04-01T08:00:00.000Z",
    "updatedAt": "2026-04-01T08:00:00.000Z"
  }
]
```

---

## 3. POST `/` — Gửi message

### 3a. Gửi tin nhắn dạng text

**Request**

```
POST http://localhost:3000/api/v1/messages
Authorization: Bearer <token>
Content-Type: application/json
```

**Body** (JSON):

```json
{
  "to": "6611abc123def456ghi789",
  "text": "Xin chào bạn!"
}
```

**Response** (200):

```json
{
  "_id": "6625...",
  "from": "6610...",
  "to": "6611abc123def456ghi789",
  "messageContent": {
    "type": "text",
    "text": "Xin chào bạn!"
  },
  "createdAt": "2026-04-01T09:00:00.000Z",
  "updatedAt": "2026-04-01T09:00:00.000Z"
}
```

---

### 3b. Gửi tin nhắn dạng file

**Request**

```
POST http://localhost:3000/api/v1/messages
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body** (form-data):

| Key    | Type | Value                          |
|--------|------|--------------------------------|
| `to`   | text | `6611abc123def456ghi789`       |
| `file` | file | chọn file từ máy tính          |

**Response** (200):

```json
{
  "_id": "6626...",
  "from": "6610...",
  "to": "6611abc123def456ghi789",
  "messageContent": {
    "type": "file",
    "text": "/uploads/1711958400000-image.png"
  },
  "createdAt": "2026-04-01T09:05:00.000Z",
  "updatedAt": "2026-04-01T09:05:00.000Z"
}
```

---

## Error Response

Khi có lỗi, tất cả route trả về:

```json
{
  "message": "error message"
}
```

| Status | Mô tả              |
|--------|---------------------|
| 404    | Chưa đăng nhập      |
| 500    | Lỗi server          |
