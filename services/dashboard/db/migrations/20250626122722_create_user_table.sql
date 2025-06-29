-- migrate:up
create table users
(
    id uuid not null unique,
    username varchar(255) not null unique,
    primary key (id)
);

create index users_id_idx on users (id);
create index users_username_idx on users (username);

-- migrate:down
drop table users;

