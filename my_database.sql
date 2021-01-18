--
-- PostgreSQL database dump
--

-- Dumped from database version 12.5 (Ubuntu 12.5-1.pgdg16.04+1)
-- Dumped by pg_dump version 12.5 (Ubuntu 12.5-1.pgdg18.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: overdubs; Type: TABLE; Schema: public; Owner: pglulvrbgsvxhi
--

CREATE TABLE public.overdubs (
    id uuid NOT NULL,
    url character varying(255) NOT NULL,
    title character varying(255) NOT NULL,
    nudge double precision NOT NULL,
    gain double precision NOT NULL,
    owner_id uuid NOT NULL,
    created_date timestamp without time zone,
    modified_date timestamp without time zone
);


ALTER TABLE public.overdubs OWNER TO pglulvrbgsvxhi;

--
-- Name: users; Type: TABLE; Schema: public; Owner: pglulvrbgsvxhi
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    username character varying(128) NOT NULL,
    password character varying(128) NOT NULL,
    created_date timestamp without time zone,
    modified_date timestamp without time zone
);


ALTER TABLE public.users OWNER TO pglulvrbgsvxhi;

--
-- Data for Name: overdubs; Type: TABLE DATA; Schema: public; Owner: pglulvrbgsvxhi
--

COPY public.overdubs (id, url, title, nudge, gain, owner_id, created_date, modified_date) FROM stdin;
1621f7d1-dace-42ee-91d1-78c3062e14f4	https://remote-band.s3.eu-central-1.amazonaws.com/2020-07-09T15%3A50%3A08.841Z	meme-themes-1	-0.18	1	856e169b-dc0a-4aa3-b92f-84e973a4f98c	2020-07-09 16:09:55.925	2020-07-09 16:09:55.925
3d0c5d29-f81f-44ad-af42-7493d87a41e5	https://remote-band.s3.amazonaws.com/2020-07-15T08:34:57.683Z	meme-themes-1	-0.18	1	856e169b-dc0a-4aa3-b92f-84e973a4f98c	2020-07-15 08:35:02.811	2020-07-15 08:35:02.811
d7fa662b-ac23-4513-a831-86fbb1f1dc64	https://remote-band.s3.amazonaws.com/2020-07-15T08:38:23.808Z	meme-themes-1	-0.18	1	856e169b-dc0a-4aa3-b92f-84e973a4f98c	2020-07-15 08:38:27.133	2020-07-15 08:38:27.133
27457edb-51b4-4532-a509-196ffc6b5972	https://remote-band.s3.amazonaws.com/2020-07-16T13:25:39.667Z	ode-to-joy	-0.18	1	856e169b-dc0a-4aa3-b92f-84e973a4f98c	2020-07-16 13:25:38.974	2020-07-16 13:25:38.974
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: pglulvrbgsvxhi
--

COPY public.users (id, username, password, created_date, modified_date) FROM stdin;
a9b580a3-a173-48ea-b2cb-85c1321151b7	sam-admin	$2b$08$RAaKMw/IYMt/iMAWrgtaMe9b9QyE9h3mvw0PmCPuUdhn03aoLCR9i	2020-07-09 10:12:31.81	2020-07-09 10:12:31.811
2d581352-44c0-4d13-bc04-1fe453a77534	sam-admin-1	$2b$08$nhif4.8qQ/67wOlZPFSZyek8xqRk8SZaDB6L0M5KxovmzSWDPHhhW	2020-07-09 10:23:45.097	2020-07-09 10:23:45.099
856e169b-dc0a-4aa3-b92f-84e973a4f98c	spwt-group1	$2b$08$7LqpKGI1PJKh7Kitlr5IteB3bN8ImmmD8xF2AMYzsoqAcQqKcOXie	2020-07-09 12:07:37.7	2020-07-09 12:07:37.701
\.


--
-- Name: overdubs overdubs_pkey; Type: CONSTRAINT; Schema: public; Owner: pglulvrbgsvxhi
--

ALTER TABLE ONLY public.overdubs
    ADD CONSTRAINT overdubs_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: pglulvrbgsvxhi
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: pglulvrbgsvxhi
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: LANGUAGE plpgsql; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON LANGUAGE plpgsql TO pglulvrbgsvxhi;


--
-- PostgreSQL database dump complete
--

