-- name: GetFunds :many
SELECT slug, name FROM fund ORDER BY name;

-- name: GetFundBySlug :one
SELECT slug, name FROM fund WHERE slug = $1;

-- name: GetFundBySlugWithFavoriteData :one
SELECT slug, name, is_favorite FROM fund f
LEFT JOIN (
    SELECT true as is_favorite
    FROM user_favorite
    WHERE user_id = $1 AND favorite_type = 'fund'
) uf ON f.id = uf.favorite_id
WHERE f.slug = $1;

-- name: CreateFund :one
INSERT INTO fund (name) VALUES ($1) RETURNING slug, name;

-- name: UpdateFund :one
UPDATE fund SET name = $2 WHERE slug = $1 RETURNING slug, name;

-- name: DeleteFund :exec
DELETE FROM fund WHERE slug = $1;