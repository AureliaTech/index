-- migrate:up
CREATE TABLE deal_team_highlight (
    id int generated always as identity primary key,
    description text not null,
    title varchar(255) not null,
    author_id int not null,
    company_id int not null,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    FOREIGN KEY (company_id) REFERENCES company(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE label (
  id int generated always as identity primary key,
  color  varchar(32)  NOT NULL,
  text   varchar(255) NOT NULL,
  UNIQUE (color, text)     
);

CREATE TABLE deal_team_highlight_label (       
  highlight_id int  REFERENCES deal_team_highlight(id) ON DELETE CASCADE,
  label_id     int   REFERENCES label(id)             ON DELETE RESTRICT,
  PRIMARY KEY (highlight_id, label_id)
);

CREATE INDEX idx_deal_team_highlight_company_id ON deal_team_highlight(company_id);
CREATE INDEX idx_deal_team_highlight_author_id ON deal_team_highlight(author_id);

-- migrate:down
DROP INDEX IF EXISTS idx_deal_team_highlight_company_id;
DROP INDEX IF EXISTS idx_deal_team_highlight_author_id;
DROP TABLE deal_team_highlight_label;
DROP TABLE label;
DROP TABLE deal_team_highlight;
