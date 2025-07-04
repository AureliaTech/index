-- name: GetDealTeamHighlightsByCompanyId :many
-- Returns every highlight that belongs to a given company together with
--   • author username
--   • full list of labels as JSONB array
-- Ordered by newest first
SELECT
  h.id,
  h.title,
  h.description,
  h.created_at,
  h.updated_at,
  h.author_id,
  u.username  AS author_username,
  h.company_id,
  COALESCE(lbl.labels, '[]'::jsonb) AS labels
FROM   deal_team_highlight      AS h
JOIN   users                    AS u  ON u.id = h.author_id
-- LATERAL sub-query aggregates all labels for that highlight in one go
LEFT   JOIN LATERAL (
  SELECT jsonb_agg(
           jsonb_build_object('id',    l.id,
                              'color', l.color,
                              'text',  l.text)
           ORDER BY l.text
         ) AS labels
  FROM   deal_team_highlight_label j
  JOIN   label                    l ON l.id = j.label_id
  WHERE  j.highlight_id = h.id
) AS lbl ON TRUE
WHERE  h.company_id = $1
ORDER  BY h.created_at DESC;

-- -------------------------------------------------------------------
-- name: GetDealTeamHighlightsFilteredByKeywordInDescription :many
SELECT
  h.id,
  h.title,
  h.description,
  h.created_at,
  h.updated_at,
  h.author_id,
  u.username  AS author_username,
  h.company_id,
  COALESCE(lbl.labels, '[]'::jsonb) AS labels
FROM   deal_team_highlight      AS h
JOIN   users                    AS u  ON u.id = h.author_id
LEFT   JOIN LATERAL (
  SELECT jsonb_agg(
           jsonb_build_object('id',    l.id,
                              'color', l.color,
                              'text',  l.text)
           ORDER BY l.text
         ) AS labels
  FROM   deal_team_highlight_label j
  JOIN   label                    l ON l.id = j.label_id
  WHERE  j.highlight_id = h.id
) AS lbl ON TRUE
WHERE  h.description ILIKE '%' || $1 || '%'
ORDER  BY h.created_at DESC;

-- -------------------------------------------------------------------
-- name: GetDealTeamHighlightsByLabels :many
SELECT
  h.id,
  h.title,
  h.description,
  h.created_at,
  h.updated_at,
  h.author_id,
  u.username  AS author_username,
  h.company_id,
  COALESCE(lbl.labels, '[]'::jsonb) AS labels
FROM   deal_team_highlight      AS h
JOIN   users                    AS u  ON u.id = h.author_id
LEFT   JOIN LATERAL (
  SELECT jsonb_agg(
           jsonb_build_object('id',    l.id,
                              'color', l.color,
                              'text',  l.text)
           ORDER BY l.text
         ) AS labels
  FROM   deal_team_highlight_label j
  JOIN   label                    l ON l.id = j.label_id
  WHERE  j.highlight_id = h.id
) AS lbl ON TRUE
WHERE  lbl.labels && $1::uuid[]
ORDER  BY h.created_at DESC;

-- name: GetLabels :many
SELECT id, color, text FROM label;

-- name: GetLabelsByText :many
SELECT id, color, text FROM label WHERE text = ANY($1);

-- name: CreateLabel :one
INSERT INTO label (id, color, text)
VALUES (gen_random_uuid(), $1, $2)
ON CONFLICT (color, text) DO UPDATE
SET    color = EXCLUDED.color,
       text  = EXCLUDED.text
RETURNING *;

-- name: CreateDealTeamHighlight :one
INSERT INTO deal_team_highlight (id, title, description, author_id, company_id)
VALUES (gen_random_uuid(), $1, $2, $3, $4)
RETURNING *;

-- name: AttachLabelToHighlight :exec
INSERT INTO deal_team_highlight_label (highlight_id, label_id)
VALUES ($1, $2)
ON CONFLICT DO NOTHING;

-- -------------------------------------------------------------------
-- name: GetDealTeamHighlightById :one
SELECT
  h.id,
  h.title,
  h.description,
  h.created_at,
  h.updated_at,
  h.author_id,
  u.username  AS author_username,
  h.company_id,
  COALESCE(lbl.labels, '[]'::jsonb) AS labels
FROM   deal_team_highlight      AS h
JOIN   users                    AS u  ON u.id = h.author_id
LEFT   JOIN LATERAL (
  SELECT jsonb_agg(
           jsonb_build_object('id',    l.id,
                              'color', l.color,
                              'text',  l.text)
           ORDER BY l.text
         ) AS labels
  FROM   deal_team_highlight_label j
  JOIN   label                    l ON l.id = j.label_id
  WHERE  j.highlight_id = h.id
) AS lbl ON TRUE
WHERE  h.id = $1;
