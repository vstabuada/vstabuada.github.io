import { createClient } from 'https://esm.sh/@supabase/supabase-js'
import tomSelect from 'https://cdn.jsdelivr.net/npm/tom-select@2.6.1/+esm'
import Toastify from 'https://cdn.jsdelivr.net/npm/toastify-js/+esm'


const supabase = createClient(
    'https://shirfddotjoqdlztfsxt.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoaXJmZGRvdGpvcWRsenRmc3h0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NjgxMjcsImV4cCI6MjA5NTE0NDEyN30.z4a43wJ7v6iy-MUzyV8dZ0Ejz0UeKcWNX-cBpG4MR_M'
)

new tomSelect("#paymentMethod", {
    controlInput: null,

    onItemAdd() {
        this.blur();
    }
});

const channel = supabase
    .channel('novas-vendas')
    .on(
        'postgres_changes',
        {
            event: 'INSERT',
            schema: 'public',
            table: 'vendas'
        },
        (payload) => {
            console.log('Nova venda:', payload.new);

            // Exibe notificação
            Toastify({
                text: `Nova venda: ${payload.new.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} (ID-${payload.new.id})`,
                destination: "tabuextrato.html?id=" + payload.new.id,
                duration: 5000,
                className: "toast-success",
                stopOnFocus: true,
                close: true,
            }).showToast();


        }
    )
    /*                 `Nova venda: ID-${payload.new.id} ${payload.new.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}` */
    .subscribe();





async function getProducts() {
    const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('id', { ascending: false })
    if (error) {
        console.error('Erro ao buscar produtos:', error)
        return { error }
    }

    const categorizedProducts = {}

    data.forEach(product => {
        if (!categorizedProducts[product.categoria]) {
            categorizedProducts[product.categoria] = []
        }
        categorizedProducts[product.categoria].push({
            name: product.nome,
            price: product.preco
        })
    })
    return categorizedProducts
}




let cart = [];
let salesHistory = [];

const categoriesEl =
    document.getElementById("categories");

const cartItems =
    document.getElementById("cartItems");

const subtotalEl =
    document.getElementById("subtotal");

/* PRODUTOS */

async function renderProducts(filter = "") {

    categoriesEl.innerHTML = "";

    const products = await getProducts()

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

window.increase = increase
window.decrease = decrease
window.removeItem = removeItem

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