
begin;

create table host_names(
    id              serial      not null primary key,
    host_name       text        not null,
    unique(host_name)
);

create table companies(
    id              serial      not null primary key,
    company_name    text        not null,
    unique(company_name)
);

create table host_company_mappings(
    id              serial      not null,
    host_name_id     serial      not null references host_names(id) primary key,
    company_id      serial      not null references companies(id)
);

create table company_categories(
    company_id      serial      not null primary key references companies(id),
    categories      text[]      not null
);

create table categories(
    id          serial  not null unique,
    category    text    not null primary key
);

create table locations(
    id              serial not null unique,
    city_name       text   not null,
    area_name       text   not null,
    country_name    text   not null,
    primary key(city_name, area_name, country_name)
);

create table company_locations(
    id              serial not null unique,
    company_id      serial not null primary key references companies(id),
    location_id     serial not null references locations(id)
);



commit;