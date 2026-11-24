create table public.users (
  id uuid not null default gen_random_uuid (),
  firstname character varying(100) not null,
  lastname character varying(100) not null,
  mail character varying(255) not null,
  password_hash character varying(255) not null,
  two_factor_enabled boolean not null default false,
  two_factor_secret text null,
  status character varying(20) not null default 'ACTIF'::character varying,
  role character varying(20) not null default 'USER'::character varying,
  created_by_id uuid null,
  created_at timestamp with time zone not null default CURRENT_TIMESTAMP,
  constraint users_pkey primary key (id),
  constraint fk_users_created_by foreign KEY (created_by_id) references users (id) on delete RESTRICT,
  constraint chk_users_not_self_created check (
    (
      (created_by_id is null)
      or (created_by_id <> id)
    )
  ),
  constraint chk_users_role check (
    (
      (role)::text = any (
        (
          array[
            'USER'::character varying,
            'ADMIN'::character varying,
            'SUPERADMIN'::character varying
          ]
        )::text[]
      )
    )
  ),
  constraint chk_users_status check (
    (
      (status)::text = any (
        (
          array[
            'ACTIF'::character varying,
            'BLOQUE'::character varying
          ]
        )::text[]
      )
    )
  )
) TABLESPACE pg_default;

create unique INDEX IF not exists uq_users_mail_lower on public.users using btree (lower((mail)::text)) TABLESPACE pg_default;

create index IF not exists idx_users_created_by on public.users using btree (created_by_id) TABLESPACE pg_default;