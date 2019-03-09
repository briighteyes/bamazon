var inquirer = require('inquirer');
var mysql = require('mysql');
var divider = "\n-------------------------------------------\n";

//CREATE CONNECTION TO MYSQL
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'icca8671',
    database: 'bamazon'
});

connection.connect(function (err) {
    if (err) throw err;
    promptUser();
});


function promptUser() {
    inquirer.prompt([
        {
            name: 'action',
            type: 'rawlist',
            message: 'What would you like to do?',
            choices: [
                'View all products for sale',
                'View low inventory',
                'Increase existing products in the inventory',
                'Add a new product',
            ]
        }
    ]
    ).then(function (answer) {

        switch (answer.action) {

            case 'View all products for sale':
                viewAllProducts();
                break;

            case 'View low inventory':
                viewLowInventory();
                break;

            case 'Increase existing products in the inventory':
                addExisting();
                break;

            case 'Add a new product':
                addNew();


        }
    })
}

//DISPLAYS ALL PRODUCTS IN THE COMMAND LINE
function viewAllProducts() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("\nItem Number: " + res[i].item_id + "\nProducts: " + res[i].product_name + "\nDepartment: " + res[i].department_name + "\nPrice: " + res[i].price + "\nIn Stock: " + res[i].stock_quantity + "\n\n");
        }

    })
}

//DISPLAYS ALL PRODUCTS WITH A STOCK QUANTITY OF LESS THAN 5
function viewLowInventory() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 5) {

                console.log("\nItem Number: " + res[i].item_id + "\nProducts: " + res[i].product_name + "\nDepartment: " + res[i].department_name + "\nPrice: " + res[i].price + "\nIn Stock: " + res[i].stock_quantity + "\n\n");
            }
        }
    })
}

//ALLOWS USER TO INCREASE A PRODUCT THAT IS INVENTORY
function addExisting() {
    inquirer.prompt([
        {
            name: 'product',
            type: 'input',
            message: 'Enter the item number of the product you wish to increase.',
            filter: Number
        },
        {
            name: 'quantity',
            type: 'input',
            message: 'How many would you like to add?',
            filter: Number
        }
    ]).then(function (answer) {
        connection.query("SELECT * FROM products WHERE ?", { item_id: answer.product }, function (err, res) {
            console.log(divider + "\nYou have successfuly increased " + res[0].product_name + " by the amount of " + answer.quantity);
            console.log("\n\nItem Number: " + res[0].item_id + "\nProducts: " + res[0].product_name + "\nDepartment: " + res[0].department_name + "\nPrice: " + res[0].price + "\nIn Stock: " + (res[0].stock_quantity + answer.quantity) + "\n" + divider);

            connection.query('UPDATE products SET stock_quantity = ' + (res[0].stock_quantity + answer.quantity) + ' WHERE item_id = ' + answer.product);

            connection.end();
        })
    })
}


//ALLOWS USER TO ADD NEW PRODUCT
function addNew() {
    inquirer.prompt([
        {
            name: 'name',
            type: 'input',
            message: 'Enter the name of the product you would like to add.'
        },
        {
            name: 'department',
            type: 'input',
            message: 'What department will your product be found in?',
        },
        {
            name: 'price',
            type: 'input',
            message: 'Please enter the retail price for your product.',
        },
        {
            name: 'quantity',
            type: 'input',
            message: 'Enter the quantity of the product in stock.'
        },
    ]).then(function (answer) {

        connection.query("INSERT INTO products SET ?", {
            product_name: answer.name,
            department_name: answer.department,
            price: answer.price,
            stock_quantity: answer.quantity
        },
            console.log(divider + 'We have successfully added your product.' + divider + "\nProduct: " + answer.name + "\nDepartment: " + answer.department + "\nPrice: " + answer.price + "\nIn Stock: " + answer.quantity + "\n" + divider));

    })

}


