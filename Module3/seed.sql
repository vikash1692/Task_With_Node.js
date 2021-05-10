-- Table: public.Module3_User

-- DROP TABLE public."Module3_User";

CREATE TABLE public."Module3_User"
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    login character varying COLLATE pg_catalog."default",
    password character varying COLLATE pg_catalog."default",
    "isDeleted" boolean,
    age integer,
    CONSTRAINT "Module3_User_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public."Module3_User"
    OWNER to postgres;