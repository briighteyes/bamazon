var mysql = require("mysql");
var inquirer = require("inquirer");


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "icca8671",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    display();
});


//DISPLAYS ALL THE PRODUCTS IN STOCK
function display() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("\nItem Number: " + res[i].item_id + "\nProducts: " + res[i].product_name + "\nDepartment: " + res[i].department_name + "\nPrice: " + res[i].price + "\nIn Stock: " + res[i].stock_quantity + "\n\n");
        }
        promptCustomer();

    })
}

function promptCustomer() {
    inquirer
        .prompt([
            {
                name: "item",
                type: "input",
                message: "Enter the Item Number of the Product you wish to purchase.",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "quantity",
                type: "input",
                message: "How many units of this product would you like to purhcase?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function (answer) {
            
            connection.query("SELECT * FROM products WHERE ?", { item_id: answer.item }, function (err, res) {
                if (res[0].stock_quantity > answer.quantity) {
						console.log("\n-------------------------------------------\n");

                    console.log("\nYou have chosen to purchase " + answer.quantity + " of the " + res[0].product_name + "\n");
                    connection.query('UPDATE products SET stock_quantity = ' + (res[0].stock_quantity - answer.quantity) + ' WHERE item_id = ' + answer.item);
            

						console.log('Your total is : $' + res[0].price * answer.quantity);
						console.log('Pleasure doing business');
						console.log("\n-------------------------------------------\n");

						// End the database connection
						connection.end();
					
                }
                else {
                    console.log("Insufficient Quantity")
                }

            });
        })}
