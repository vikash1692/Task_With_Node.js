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


-- Table: public.Group

-- DROP TABLE public."Group";

CREATE TABLE public."Group"
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    name character varying COLLATE pg_catalog."default",
    permissions character varying[] COLLATE pg_catalog."default",
    CONSTRAINT "Group_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public."Group"
    OWNER to postgres;


-- Table: public.UserGroup

-- DROP TABLE public."UserGroup";

CREATE TABLE public."UserGroup"
(
    "UserID" integer NOT NULL,
    "GroupID" integer NOT NULL,
    CONSTRAINT "fk_Group" FOREIGN KEY ("GroupID")
        REFERENCES public."Group" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID,
    CONSTRAINT "fk_User" FOREIGN KEY ("UserID")
        REFERENCES public."Module3_User" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE public."UserGroup"
    OWNER to postgres;