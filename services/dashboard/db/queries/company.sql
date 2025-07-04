
-- name: GetCompanies :many
SELECT slug, name, id FROM company ORDER BY name;

-- name: GetCompanyBySlug :one
SELECT slug, name, id FROM company WHERE slug = $1;

-- name: GetCompanyBySlugWithFavoriteData :one
SELECT slug, name, is_favorite FROM company c
LEFT JOIN (
    SELECT true as is_favorite
    FROM user_favorite
    WHERE user_id = $1 AND favorite_type = 'company'
) uf ON c.id = uf.favorite_id
WHERE c.slug = $1;

-- name: CreateCompany :one
INSERT INTO company (name) VALUES ($1) RETURNING slug, name;

-- name: UpdateCompany :one
UPDATE company SET name = $2 WHERE slug = $1 RETURNING slug, name;

-- name: DeleteCompany :exec
DELETE FROM company WHERE slug = $1;
