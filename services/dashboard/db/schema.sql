SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: check_user_favorite_foreign_key(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_user_favorite_foreign_key() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
$$;


--
-- Name: delete_company_favorite_func(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.delete_company_favorite_func() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    delete from user_favorite
    where favorite_type = 'company'
      and favorite_id = old.id;
    return null;
end;
$$;


--
-- Name: delete_fund_favorite_func(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.delete_fund_favorite_func() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    delete from user_favorite
    where favorite_type = 'fund'
      and favorite_id = old.id;
    return null;
end;
$$;


--
-- Name: generate_slug(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.generate_slug() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
    base_slug    varchar(255);
    unique_slug  varchar(255);
    sequence_num integer := 0;
begin
    base_slug := lower(regexp_replace(new.name, '[^a-zA-Z0-9]+', '-', 'g'));
    unique_slug := base_slug;

    -- Check for existing slugs and ensure uniqueness
    while exists (select 1 from companies where slug = unique_slug and id != new.id)
        loop
            sequence_num := sequence_num + 1;
            unique_slug := base_slug || '-' || sequence_num;
        end loop;

    new.slug := unique_slug;

    return new;
end;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: company; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.company (
    id integer NOT NULL,
    slug character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: company_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.company ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.company_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: fund; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fund (
    id integer NOT NULL,
    slug character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: fund_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.fund ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.fund_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying NOT NULL
);


--
-- Name: user_favorite; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_favorite (
    id integer NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    favorite_type character varying(255) NOT NULL,
    favorite_id integer NOT NULL,
    CONSTRAINT user_favorite_favorite_type_check CHECK (((favorite_type)::text = ANY ((ARRAY['fund'::character varying, 'company'::character varying])::text[])))
);


--
-- Name: user_favorite_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.user_favorite ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.user_favorite_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    username character varying(255) NOT NULL
);


--
-- Name: company company_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT company_pkey PRIMARY KEY (id);


--
-- Name: company company_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT company_slug_key UNIQUE (slug);


--
-- Name: fund fund_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fund
    ADD CONSTRAINT fund_pkey PRIMARY KEY (id);


--
-- Name: fund fund_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fund
    ADD CONSTRAINT fund_slug_key UNIQUE (slug);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: user_favorite user_favorite_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_favorite
    ADD CONSTRAINT user_favorite_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: company_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX company_slug_idx ON public.company USING btree (slug);


--
-- Name: fund_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX fund_slug_idx ON public.fund USING btree (slug);


--
-- Name: user_favorite_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_favorite_user_id_idx ON public.user_favorite USING btree (user_id);


--
-- Name: users_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_id_idx ON public.users USING btree (id);


--
-- Name: users_username_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_username_idx ON public.users USING btree (username);


--
-- Name: company delete_company_favorite; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER delete_company_favorite AFTER DELETE ON public.company FOR EACH ROW EXECUTE FUNCTION public.delete_company_favorite_func();


--
-- Name: fund delete_fund_favorite; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER delete_fund_favorite AFTER DELETE ON public.fund FOR EACH ROW EXECUTE FUNCTION public.delete_fund_favorite_func();


--
-- Name: company populate_slug_on_insert; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER populate_slug_on_insert BEFORE INSERT ON public.company FOR EACH ROW EXECUTE FUNCTION public.generate_slug();


--
-- Name: fund populate_slug_on_insert; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER populate_slug_on_insert BEFORE INSERT ON public.fund FOR EACH ROW EXECUTE FUNCTION public.generate_slug();


--
-- Name: company populate_slug_on_update; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER populate_slug_on_update BEFORE UPDATE ON public.company FOR EACH ROW WHEN (((new.name)::text IS DISTINCT FROM (old.name)::text)) EXECUTE FUNCTION public.generate_slug();


--
-- Name: fund populate_slug_on_update; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER populate_slug_on_update BEFORE UPDATE ON public.fund FOR EACH ROW WHEN (((new.name)::text IS DISTINCT FROM (old.name)::text)) EXECUTE FUNCTION public.generate_slug();


--
-- Name: user_favorite user_favorite_polymorphic_foreign_key; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER user_favorite_polymorphic_foreign_key BEFORE INSERT OR UPDATE ON public.user_favorite FOR EACH ROW EXECUTE FUNCTION public.check_user_favorite_foreign_key();


--
-- Name: user_favorite user_favorite_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_favorite
    ADD CONSTRAINT user_favorite_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


--
-- Dbmate schema migrations
--

INSERT INTO public.schema_migrations (version) VALUES
    ('20250626090600'),
    ('20250626091032'),
    ('20250626122722'),
    ('20250626124026'),
    ('20250626132815');
