-- name: GetUserFavoritesOrderedByName :many
SELECT 
    'fund' as type,
    f.slug,
    f.name
FROM user_favorite uf
JOIN fund f ON uf.favorite_id = f.id
WHERE uf.user_id = $1 AND uf.favorite_type = 'fund'

UNION ALL

SELECT 
    'company' as type,
    c.slug,
    c.name
FROM user_favorite uf
JOIN company c ON uf.favorite_id = c.id
WHERE uf.user_id = $1 AND uf.favorite_type = 'company'
ORDER BY name;
