-- migrate:up
create or replace function generate_slug()
    returns trigger as
$$
declare
    base_slug    varchar(255);
    unique_slug  varchar(255);
    sequence_num integer := 0;
begin
    base_slug := lower(regexp_replace(new.name, '[^a-zA-Z0-9]+', '-', 'g'));
    unique_slug := base_slug;

    -- Check for existing slugs and ensure uniqueness
    while exists (select 1 from company where slug = unique_slug and id != new.id)
        loop
            sequence_num := sequence_num + 1;
            unique_slug := base_slug || '-' || sequence_num;
        end loop;

    new.slug := unique_slug;

    return new;
end;
$$ language plpgsql;

-- migrate:down
drop function generate_slug();
