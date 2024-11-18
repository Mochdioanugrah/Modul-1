const API_URL = "http://localhost:8000/api.php";

// Fetch all orders
async function fetchOrders() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const orders = await response.json();
        renderOrders(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        alert("Failed to fetch orders. Please check the server.");
    }
}

// Render orders in the table
function renderOrders(orders) {
    const orderTableBody = document.getElementById("orderTableBody");
    orderTableBody.innerHTML = "";

    if (orders.length === 0) {
        orderTableBody.innerHTML = `<tr><td colspan="4">No orders found</td></tr>`;
        return;
    }

    orders.forEach((order) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${order.customerName}</td>
            <td>${order.address}</td>
            <td>${order.quantity}</td>
            <td>
                <button class="btn btn-edit" onclick="editOrder(${order.id})">Edit</button>
                <button class="btn btn-delete" onclick="deleteOrder(${order.id})">Delete</button>
            </td>
        `;
        orderTableBody.appendChild(row);
    });
}

// Add a new order
async function addOrder(order) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(order),
        });

        if (!response.ok) {
            throw new Error("Failed to add order.");
        }

        const result = await response.json();
        alert(result.message || "Order added successfully!");
        fetchOrders();
    } catch (error) {
        console.error("Error adding order:", error);
        alert("Failed to add the order. Please try again.");
    }
}

// Edit an order
async function editOrder(id) {
    const customerName = prompt("Enter new customer name:");
    const address = prompt("Enter new address:");
    const quantity = prompt("Enter new quantity:");

    if (!customerName || !address || isNaN(quantity) || quantity <= 0) {
        alert("All fields are required, and quantity must be a valid positive number!");
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id,
                customerName,
                address,
                quantity: parseInt(quantity, 10),
                _method: "PUT",
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to update order.");
        }

        const result = await response.json();
        alert(result.message || "Order updated successfully!");
        fetchOrders();
    } catch (error) {
        console.error("Error updating order:", error);
        alert("Failed to update the order. Please try again.");
    }
}

// Delete an order
async function deleteOrder(id) {
    if (!confirm("Are you sure you want to delete this order?")) {
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id,
                _method: "DELETE",
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to delete order.");
        }

        const result = await response.json();
        alert(result.message || "Order deleted successfully!");
        fetchOrders();
    } catch (error) {
        console.error("Error deleting order:", error);
        alert("Failed to delete the order. Please try again.");
    }
}

// Form submission
document.getElementById("orderForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const customerName = document.getElementById("customerName").value.trim();
    const address = document.getElementById("address").value.trim();
    const quantity = parseInt(document.getElementById("quantity").value);

    if (!customerName || !address || isNaN(quantity) || quantity <= 0) {
        alert("Please fill in all fields correctly!");
        return;
    }

    addOrder({ customerName, address, quantity });
    document.getElementById("orderForm").reset();
});

// Initial fetch
fetchOrders();
