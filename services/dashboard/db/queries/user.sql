-- name: GetUserByUsername :one
SELECT id, username FROM users WHERE username = $1;

-- name: CreateUser :one
INSERT INTO users (username) VALUES ($1) RETURNING id, username;
