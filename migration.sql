create table user_account (
    id uuid primary key,
    password char(60) not null,
    email varchar(255) not null unique
);

create table user_profile (
    id uuid primary key,
    account_id uuid not null references user_account(id) on delete cascade,
    display_name varchar(30) not null,
    profile_name varchar(30) not null unique,
    bio varchar(255)
);
