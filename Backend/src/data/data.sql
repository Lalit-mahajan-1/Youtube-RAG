create table if not exits users (
    id serial primary key,
    name varchar(100) not null , 
    email varchar (100) unique not null , 
    password varchar(8) not null, 
    created_at timestamp default now()
)