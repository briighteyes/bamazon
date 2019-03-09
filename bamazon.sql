use bamazon;

create table products(

item_id integer auto_increment, 
product_name varchar(150) not null, 
department_name varchar(150) not null, 
price decimal(10,2) not null, 
stock_quantity integer(10) not null, 
primary key (item_id)

);