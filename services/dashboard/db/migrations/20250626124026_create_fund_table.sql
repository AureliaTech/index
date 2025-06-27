-- migrate:up
create table fund
(
    id         int generated always as identity,
    slug       varchar(255) not null unique,
    name       varchar(255) not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,

    primary key (id)
);

create index fund_slug_idx on fund (slug);

create trigger populate_slug_on_insert
    before insert
    on fund
    for each row
execute function generate_slug();

create trigger populate_slug_on_update
    before update
    on fund
    for each row
    when (new.name is distinct from old.name)
execute function generate_slug();

-- migrate:down
drop table fund;

