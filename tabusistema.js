import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabase = createClient(
    'https://shirfddotjoqdlztfsxt.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoaXJmZGRvdGpvcWRsenRmc3h0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NjgxMjcsImV4cCI6MjA5NTE0NDEyN30.z4a43wJ7v6iy-MUzyV8dZ0Ejz0UeKcWNX-cBpG4MR_M'
)
/*

async function getProducts() {
    const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('id', { ascending: false })
    if (error) {
        console.error('Erro ao buscar produtos:', error)
        return { error }
    }
    console.log(data)
    return data
}


const products = getProducts()
*/
const products = {

    Pasteis: [

        { name: "Pastel de Carne", price: 12.00 },
        { name: "Pastel de Frango", price: 12.00 },
        { name: "Pastel de Queijo", price: 12.00 },
        { name: "Pastel de Carne com Queijo", price: 13.00 },
        { name: "Pastel de Carne Seca", price: 13.00 },
        { name: "Pastel de Camarão", price: 15.00 }

    ],

    Doses: [

        { name: "Copão de Gin", price: 11.35 },
        { name: "Copão de Vodka", price: 10.00 },
        { name: "Copão de Chanceler", price: 10.00 },
        { name: "Copão de Smirnoff", price: 20.00 },
        { name: "Copão de White Horse", price: 30.00 }

    ],

    Combos: [

        { name: "Combo de Gin", price: 45.00 },
        { name: "Combo de Vodka", price: 45.00 },
        { name: "Combo de Chanceler", price: 45.00 },
        { name: "Combo de Smirnoff", price: 90.00 },
        { name: "Combo de White Horse", price: 140.00 }

    ],

    Coquetéis: [

        { name: "Caipirinha - Limão", price: 15.00 },
        { name: "Caipirinha - Maracujá", price: 15.00 },
        { name: "Caipirinha - Morango", price: 15.00 },
        { name: "Caipiroska - Limão", price: 15.00 },
        { name: "Caipiroska - Maracujá", price: 15.00 },
        { name: "Caipiroska - Morango", price: 15.00 },
        { name: "Caipirinha Gourmet - Limão", price: 20.00 },
        { name: "Caipirinha Gourmet - Maracujá", price: 20.00 },
        { name: "Caipirinha Gourmet - Morango", price: 20.00 },
        { name: "Caipiroska Gourmet - Limão", price: 20.00 },
        { name: "Caipiroska Gourmet - Maracujá", price: 20.00 },
        { name: "Caipiroska Gourmet - Morango", price: 20.00 }

    ]

};
let cart = [];
let salesHistory = [];

const categoriesEl =
    document.getElementById("categories");

const cartItems =
    document.getElementById("cartItems");

const subtotalEl =
    document.getElementById("subtotal");

/* PRODUTOS */

function renderProducts(filter = "") {

    categoriesEl.innerHTML = "";








    // PAREI AQUI ------------------------------------------------- ARRUMAR CATEGORIA










    Object.keys(products).forEach(category => {

        const filtered =
            products[category].filter(product =>
                product.name
                    .toLowerCase()
                    .includes(filter.toLowerCase())
            );

        if (filtered.length === 0) return;

        const div =
            document.createElement("div");

        div.className = "category";

        div.innerHTML = `
            <div class="category-title">
                ${category}
            </div>

            <div class="products">
                ${filtered.map(product => `
                    <div
                        class="product"
                        onclick='addToCart(${JSON.stringify(product)})'
                    >
                        <div class="product-name">
                            ${product.name}
                        </div>

                        <div class="product-price">
                            ${product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </div>
                    </div>
                `).join("")}
            </div>
        `;

        categoriesEl.appendChild(div);

    });

}

/* CARRINHO */

function addToCart(product) {

    const existing =
        cart.find(item =>
            item.name === product.name
        );

    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }

    renderCart();

}

window.addToCart = addToCart

function increase(index) {

    cart[index].quantity++;

    renderCart();

}

function decrease(index) {

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    } else {

        cart.splice(index, 1);

    }

    renderCart();

}

function removeItem(index) {

    cart.splice(index, 1);

    renderCart();

}

function renderCart() {

    cartItems.innerHTML = "";

    let subtotal = 0;

    cart.forEach((item, index) => {

        const total =
            item.price * item.quantity;

        subtotal += total;

        const div =
            document.createElement("div");

        div.className = "cart-item";

        div.innerHTML = `
            <div class="item-left">

                <div class="item-name">
                    ${item.name}
                </div>

                <div class="item-price">
                    ${item.quantity}x •
                    ${item.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </div>

            </div>

            <div class="quantity-controls">

                <button
                    class="icon-btn minus-btn"
                    onclick="decrease(${index})"
                >
                    <i data-lucide="minus"></i>
                </button>

                <div class="qty-number">
                    ${item.quantity}
                </div>

                <button
                    class="icon-btn plus-btn"
                    onclick="increase(${index})"
                >
                    <i data-lucide="plus"></i>
                </button>

                <button
                    class="icon-btn delete-btn"
                    onclick="removeItem(${index})"
                >
                    <i data-lucide="trash-2"></i>
                </button>

            </div>

            <div class="item-total">
                ${total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </div>
        `;

        cartItems.appendChild(div);

    });

    subtotalEl.innerText =
        `${subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`;




    document.getElementById("totalItems")
        .innerText =
        cart.reduce(
            (acc, item) =>
                acc + item.quantity,
            0
        );

    document.getElementById("uniqueItems")
        .innerText =
        cart.length;

    document.getElementById("saleTime")
        .innerText =
        new Date()
            .toLocaleTimeString(
                "pt-BR",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );



    lucide.createIcons();
}

/* FINALIZAR */


async function finishSale() {

    let total = 0

    cart.forEach(item => { total += item.price * item.quantity })

    if (cart.length === 0) {

        alert("Adicione produtos.");

        return;

    }
    const venda = {
        produtos: cart.map(item => ({
            nome: item.name,
            quantidade: item.quantity,
            preco: item.price

        })
        ),
        total: total,
        data: new Date().toISOString(),
        metodo: document.getElementById("paymentMethod").value,
        obs: document.getElementById("note").value
    }
    console.log(venda)
    const { error } = await supabase
        .from("vendas")
        .insert([venda]);

    if (error) {
        alert("Erro ao adicionar venda");
        console.error(error);
        return;
    }

    alert("Venda finalizada!");

    cart = [];

    document
        .getElementById("note")
        .value = "";

    renderCart();

}

window.finishSale = finishSale

/* HISTÓRICO */

function openHistory() {

    document
        .getElementById("historyPopup")
        .style.display = "flex";

    renderHistory();

}

function closeHistory() {

    document
        .getElementById("historyPopup")
        .style.display = "none";

}

function renderHistory() {

    const historyList =
        document.getElementById("historyList");

    historyList.innerHTML = "";

    if (salesHistory.length === 0) {

        historyList.innerHTML =
            "<p>Nenhuma venda ainda.</p>";

        return;

    }

    salesHistory.forEach(sale => {

        const div =
            document.createElement("div");

        div.className = "history-item";

        div.innerHTML = `
            <strong>${sale.total}</strong>
            <br><br>

            ${sale.date}
            <br>

            Pagamento:
            ${sale.payment}

            <br><br>

            Observação:
            ${sale.note || "Nenhuma"}

            <br><br>

            Produtos:
            ${sale.items
                .map(item =>
                    `${item.quantity}x ${item.name}`
                )
                .join(", ")}
        `;

        historyList.appendChild(div);

    });

}

/* SEARCH */

document
    .getElementById("searchInput")
    .addEventListener("input", e => {

        renderProducts(e.target.value);

    });

/* INIT */

document.getElementById("date").innerText =
    new Date().toLocaleDateString("pt-BR");

renderProducts();


/* Config */

const configBtn = document.getElementById("configBtn")

configBtn.addEventListener("click", () => {
    window.location.href = "dashboard.html"
})