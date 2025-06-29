-- migrate:up
create table user_favorite
(
    id int generated always as identity,
    user_id uuid not null,
    created_at timestamp default current_timestamp,
    favorite_type varchar(255) not null check (favorite_type in ('fund', 'company')),
    favorite_id int not null,
    primary key (id),
    foreign key (user_id) references users(id) on delete cascade
);

create index user_favorite_user_id_idx on user_favorite (user_id);

-- triggers to enforce foreign key constraints with on delete cascade
create or replace function check_user_favorite_foreign_key()
returns trigger as $$
begin
    if new.favorite_type = 'fund' then
        if not exists (select 1 from fund where id = new.favorite_id) then
            raise exception 'Invalid favorite_id % for user_favorite with favorite_type %', new.favorite_id, new.favorite_type;
        end if;
    elsif new.favorite_type = 'company' then
        if not exists (select 1 from company where id = new.favorite_id) then
            raise exception 'Invalid favorite_id % for user_favorite with favorite_type %', new.favorite_id, new.favorite_type;
        end if;
    end if;
    return new;
end;
$$ language plpgsql;

create trigger user_favorite_polymorphic_foreign_key
    before insert or update on user_favorite
    for each row
    execute function check_user_favorite_foreign_key();

create or replace function delete_fund_favorite_func()
returns trigger as $$
begin
    delete from user_favorite
    where favorite_type = 'fund'
      and favorite_id = old.id;
    return null;
end;
$$ language plpgsql;

create trigger delete_fund_favorite
    after delete on fund
    for each row
    execute function delete_fund_favorite_func();

create or replace function delete_company_favorite_func()
returns trigger as $$
begin
    delete from user_favorite
    where favorite_type = 'company'
      and favorite_id = old.id;
    return null;
end;
$$ language plpgsql;

create trigger delete_company_favorite
    after delete on company
    for each row
    execute function delete_company_favorite_func();

-- migrate:down
drop trigger delete_company_favorite on company;
drop function delete_company_favorite_func();
drop trigger delete_fund_favorite on fund;
drop function delete_fund_favorite_func();
drop trigger user_favorite_polymorphic_foreign_key on user_favorite;
drop function check_user_favorite_foreign_key();
drop table user_favorite;
