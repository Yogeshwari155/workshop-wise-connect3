--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.5

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
-- Name: enterprises; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.enterprises (
    id integer NOT NULL,
    user_id integer NOT NULL,
    company_name text NOT NULL,
    domain text,
    location text,
    website text,
    status text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.enterprises OWNER TO neondb_owner;

--
-- Name: enterprises_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.enterprises_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.enterprises_id_seq OWNER TO neondb_owner;

--
-- Name: enterprises_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.enterprises_id_seq OWNED BY public.enterprises.id;


--
-- Name: registrations; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.registrations (
    id integer NOT NULL,
    user_id integer NOT NULL,
    workshop_id integer NOT NULL,
    reason text,
    experience text,
    expectations text,
    status text DEFAULT 'pending'::text NOT NULL,
    payment_screenshot text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.registrations OWNER TO neondb_owner;

--
-- Name: registrations_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.registrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.registrations_id_seq OWNER TO neondb_owner;

--
-- Name: registrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.registrations_id_seq OWNED BY public.registrations.id;


--
-- Name: user_profiles; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.user_profiles (
    id integer NOT NULL,
    user_id integer NOT NULL,
    name text NOT NULL,
    phone text DEFAULT ''::text,
    location text DEFAULT ''::text,
    bio text DEFAULT ''::text,
    company text DEFAULT ''::text,
    skills text DEFAULT ''::text,
    experience text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_profiles OWNER TO neondb_owner;

--
-- Name: user_profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.user_profiles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_profiles_id_seq OWNER TO neondb_owner;

--
-- Name: user_profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.user_profiles_id_seq OWNED BY public.user_profiles.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    role text DEFAULT 'user'::text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: workshops; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.workshops (
    id integer NOT NULL,
    enterprise_id integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    date timestamp without time zone NOT NULL,
    "time" text NOT NULL,
    duration text NOT NULL,
    mode text NOT NULL,
    location text,
    price integer DEFAULT 0 NOT NULL,
    is_free boolean DEFAULT true NOT NULL,
    seats integer NOT NULL,
    registered_seats integer DEFAULT 0 NOT NULL,
    registration_mode text DEFAULT 'automated'::text NOT NULL,
    tags text[],
    image text,
    status text DEFAULT 'pending'::text NOT NULL,
    meet_link text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    instructor text DEFAULT 'TBD'::text NOT NULL,
    agenda text DEFAULT 'TBD'::text NOT NULL
);


ALTER TABLE public.workshops OWNER TO neondb_owner;

--
-- Name: workshops_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.workshops_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.workshops_id_seq OWNER TO neondb_owner;

--
-- Name: workshops_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.workshops_id_seq OWNED BY public.workshops.id;


--
-- Name: enterprises id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.enterprises ALTER COLUMN id SET DEFAULT nextval('public.enterprises_id_seq'::regclass);


--
-- Name: registrations id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.registrations ALTER COLUMN id SET DEFAULT nextval('public.registrations_id_seq'::regclass);


--
-- Name: user_profiles id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_profiles ALTER COLUMN id SET DEFAULT nextval('public.user_profiles_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: workshops id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.workshops ALTER COLUMN id SET DEFAULT nextval('public.workshops_id_seq'::regclass);


--
-- Data for Name: enterprises; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.enterprises (id, user_id, company_name, domain, location, website, status, created_at, updated_at) FROM stdin;
1	2	TechCorp Solutions	Technology	San Francisco, CA	https://techcorp.com	approved	2025-06-27 08:40:07.857758	2025-06-27 08:40:07.857758
2	3	Growth Academy	Business & Marketing	New York, NY	https://growthacademy.com	approved	2025-06-27 08:40:09.179505	2025-06-27 08:40:09.179505
3	7	leon Tech	Technology	Chennai,TamilNadu	htttps://companys.com	approved	2025-06-27 08:57:02.549248	2025-06-27 09:10:59.662
\.


--
-- Data for Name: registrations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.registrations (id, user_id, workshop_id, reason, experience, expectations, status, payment_screenshot, created_at, updated_at) FROM stdin;
1	6	5		\N	\N	confirmed	\N	2025-06-27 09:21:31.093565	2025-06-27 09:21:31.093565
2	6	2		\N	\N	approved	ChatGPT Image Jun 25, 2025, 10_18_19 AM.png	2025-06-27 09:22:25.314402	2025-06-27 09:23:26.345
3	6	7		\N	\N	confirmed	\N	2025-06-27 10:29:30.978137	2025-06-27 10:29:30.978137
\.


--
-- Data for Name: user_profiles; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.user_profiles (id, user_id, name, phone, location, bio, company, skills, experience, created_at, updated_at) FROM stdin;
1	6	Ree							2025-06-27 09:24:19.912345	2025-06-27 09:24:27.938
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, name, email, password, role, created_at, updated_at) FROM stdin;
1	Admin User	admin@workshopwise.com	$2b$12$HnhHhwKfP7molSimO6UFBeYiaufinvGB9sicfkXK0S1LrutYYoM2e	admin	2025-06-27 08:40:06.799918	2025-06-27 08:40:06.799918
2	TechCorp Representative	contact@techcorp.com	$2b$12$pFF1l7T8VmBQBjC41MS9OeH2k6okCKHxTBzkFSEWQj5Dr0td3u0iW	enterprise	2025-06-27 08:40:07.622271	2025-06-27 08:40:07.622271
3	Growth Academy Team	hello@growthacademy.com	$2b$12$rG4QpMaf1ZOJdSlyeqT.MucyZxjwXub2gqGDizPDZ9iUbb9ZXGhK2	enterprise	2025-06-27 08:40:08.944593	2025-06-27 08:40:08.944593
4	Priya Sharma	priya@example.com	$2b$12$bHSaJEVMpb7Gc/8FaSbKb.uPsbqBOVZFfw6Nt6FzSmgIhqCFkuHiK	user	2025-06-27 08:40:10.22257	2025-06-27 08:40:10.22257
5	Rajesh Kumar	rajesh@example.com	$2b$12$6Lqs/1Li27ow4UgMHRRZaOR8Yql0ebjwjI/56eODUSznpCJpjZ4zq	user	2025-06-27 08:40:11.022939	2025-06-27 08:40:11.022939
7	leo	leon@company.com	$2b$12$ZHgHIJXe6yXX7dewZatmR.Lb2ynomY1y4XLMh2Kyr.zdRmx5Hvegq	enterprise	2025-06-27 08:57:02.296478	2025-06-27 08:57:02.296478
6	Ree	reena@example.com	$2b$12$zCopwy9Jj5nO/bu81YHmYe2rYwX82qAiHKItwzVVEb7MpoWt11K5C	user	2025-06-27 08:53:09.508362	2025-06-27 09:24:28.181
9	JOHN	jim@company.com	$2b$12$DOA7M07JR.a6yStm0ECxCOtMtSEb0DjcWgsTE0mi8bsEDY/rAGgfS	enterprise	2025-06-27 10:37:48.935914	2025-06-27 10:37:48.935914
\.


--
-- Data for Name: workshops; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.workshops (id, enterprise_id, title, description, date, "time", duration, mode, location, price, is_free, seats, registered_seats, registration_mode, tags, image, status, meet_link, created_at, updated_at, instructor, agenda) FROM stdin;
7	3	Coding for Beginners: Build Your First Website	 Teach HTML, CSS, and basic JavaScript by building a personal webpage.\r\n\r\n	2025-07-09 00:00:00	10:00 AM-03:00 PM 	3 days	online		0	t	20	1	automated	{basics}	/uploads/56f793df8060cda6294cf931271a2aec	approved	https://meet.google.com/astr0oa6ne6	2025-06-27 10:26:07.986943	2025-06-27 10:29:30.614	Praveen	Introduction to the web & browsers\r\n\r\nWriting your first HTML page\r\n\r\nAdding styles with CSS\r\n\r\nMaking it interactive with simple JavaScript\r\n\r\nUploading to GitHub Pages or Netlify
1	1	Advanced React Development	Learn advanced React patterns and best practices for building scalable applications	2025-02-15 00:00:00	10:00 AM	3 hours	online	\N	0	t	30	0	automated	{React,JavaScript,Frontend}	\N	approved	https://meet.google.com/abc-def-ghi	2025-06-27 08:40:08.099925	2025-06-27 08:40:08.099925	Industry Expert	Comprehensive workshop covering key concepts and practical applications
3	2	Digital Marketing Mastery	Master digital marketing strategies and tools for business growth	2025-02-25 00:00:00	2:00 PM	4 hours	online	\N	1500	f	50	0	automated	{Marketing,Digital,Business}	\N	approved	https://meet.google.com/xyz-abc-def	2025-06-27 08:40:09.415008	2025-06-27 08:40:09.415008	Industry Expert	Comprehensive workshop covering key concepts and practical applications
4	2	Leadership & Team Management	Develop essential leadership skills for managing high-performing teams	2025-03-01 00:00:00	10:00 AM	6 hours	offline	Growth Academy Office, Manhattan	3000	f	20	0	manual	{Leadership,Management,"Soft Skills"}	\N	approved	\N	2025-06-27 08:40:09.415008	2025-06-27 08:40:09.415008	Industry Expert	Comprehensive workshop covering key concepts and practical applications
5	3	UI/UX	DESIGNING FROM ZERO TO HERO	2025-07-11 00:00:00	10:00 AM-03:00 PM 	3 days	online		0	t	20	1	automated	{basics}	/api/placeholder/400x300?text=Tech+Workshop&bg=4f46e5&color=white	approved	https://meet.google.com/agj5kwazbj4	2025-06-27 09:12:27.570516	2025-06-27 09:21:30.733	Industry Expert	Comprehensive workshop covering key concepts and practical applications
2	1	Full Stack Development Bootcamp	Complete full stack development course covering frontend and backend technologies	2025-02-20 00:00:00	9:00 AM	8 hours	hybrid	Tech Hub, Downtown San Francisco	2500	f	25	1	manual	{"Full Stack",JavaScript,Node.js,React}	\N	approved	\N	2025-06-27 08:40:08.099925	2025-06-27 09:23:25.162	Industry Expert	Comprehensive workshop covering key concepts and practical applications
6	3	Emerging Tech for Everyone	Introduce participants to key trends and hands-on tools in emerging technologies.	2025-07-10 00:00:00	10:00 AM-03:00 PM 	3 days	offline	Chennai,TamilNadu	4000	f	30	0	manual	{basics}	/api/placeholder/400x300?text=Tech+Workshop&bg=4f46e5&color=white	approved	\N	2025-06-27 09:38:06.963655	2025-06-27 09:39:09.559	Rithu	Welcome & Icebreaker (15 min)\n\nKeynote: The Future of Technology (30 min)\n\nSession 1: Artificial Intelligence Basics (45 min)\n\nWhat is AI? Where do we see it daily?\n\nSimple demo with an AI chatbot\n\nSession 2: Internet of Things (IoT) & Smart Devices (45 min)\n\nInteractive demo with IoT kits\n\nBreak (15 min)\n\nSession 3: Virtual Reality/Augmented Reality (45 min)\n\nTry VR headsets or mobile AR apps\n\nSession 4: Cybersecurity Essentials (45 min)\n\nHow to protect your data; password managers, MFA\n\nGroup Activity: Design a Smart City solution (1 hour)\n\nClosing & Certificates (15 min)
\.


--
-- Name: enterprises_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.enterprises_id_seq', 4, true);


--
-- Name: registrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.registrations_id_seq', 3, true);


--
-- Name: user_profiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.user_profiles_id_seq', 2, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.users_id_seq', 9, true);


--
-- Name: workshops_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.workshops_id_seq', 7, true);


--
-- Name: enterprises enterprises_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.enterprises
    ADD CONSTRAINT enterprises_pkey PRIMARY KEY (id);


--
-- Name: registrations registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT registrations_pkey PRIMARY KEY (id);


--
-- Name: user_profiles user_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: workshops workshops_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.workshops
    ADD CONSTRAINT workshops_pkey PRIMARY KEY (id);


--
-- Name: enterprises enterprises_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.enterprises
    ADD CONSTRAINT enterprises_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: registrations registrations_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT registrations_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: registrations registrations_workshop_id_workshops_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT registrations_workshop_id_workshops_id_fk FOREIGN KEY (workshop_id) REFERENCES public.workshops(id) ON DELETE CASCADE;


--
-- Name: user_profiles user_profiles_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: workshops workshops_enterprise_id_enterprises_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.workshops
    ADD CONSTRAINT workshops_enterprise_id_enterprises_id_fk FOREIGN KEY (enterprise_id) REFERENCES public.enterprises(id);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

