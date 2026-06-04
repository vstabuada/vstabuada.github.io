import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
const supabase = createClient(
    'https://shirfddotjoqdlztfsxt.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoaXJmZGRvdGpvcWRsenRmc3h0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NjgxMjcsImV4cCI6MjA5NTE0NDEyN30.z4a43wJ7v6iy-MUzyV8dZ0Ejz0UeKcWNX-cBpG4MR_M'
)

const salesContainer = document.getElementById("salesContainer");
const filterBtn = document.getElementById("filterBtn");


const params = new URLSearchParams(window.location.search);

const saleID = params.get("id");

if (saleID) document.getElementById("saleId").value = saleID;

async function loadSales(
    startDate = null,
    endDate = null,
    saleId = saleID
) {

    salesContainer.innerHTML =
        "<p>Carregando vendas...</p>";

    let query = supabase
        .from("vendas")
        .select("*")
        .order("data", { ascending: false });

    if (startDate) {
        query = query.gte("data", startDate);
    }

    if (endDate) {
        query = query.lte(
            "data",
            endDate + "T23:59:59"
        );
    }

    if (saleId) {
        query = query.eq("id", saleId);
    }

    const { data, error } = await query;

    if (error) {

        salesContainer.innerHTML = `
      <p>Erro ao carregar vendas.</p>
    `;

        console.error(error);
        return;
    }

    renderSales(data);
}



function renderSales(sales) {

    if (sales.length === 0) {

        salesContainer.innerHTML = `
      <p>Nenhuma venda encontrada.</p>
    `;

        return;
    }

    salesContainer.innerHTML = "";

    sales.forEach(sale => {

        let productsHTML = "";

        sale.produtos.forEach(product => {

            productsHTML += `
        <div class="product">
          <span>${product.nome}</span>

          <span>
            ${product.quantidade}x —
            R$ ${product.preco.toFixed(2).replace(".", ",")}
          </span>
        </div>
      `;
        });

        const card = document.createElement("div");

        card.classList.add("sale-card");
        if (saleID) card.classList.add("highlight");

        card.innerHTML = `
      <div class="sale-header">

        <div class="sale-id">
          Venda #${sale.id}
        </div>

        <div class="sale-date">
          ${new Date(sale.data).toLocaleString("pt-BR")}
        </div>

      </div>

      <div class="products">
        ${productsHTML}
      </div>

      <div id="obs">${sale.obs || "Nenhuma observação."}</div>

      <div class="total">
      <span id="paymentMethod">Método de Pagamento: ${sale.metodo}</span>
      <span>Total: R$ ${sale.total.toFixed(2).replace(".", ",")}</span>
        
      </div>
    `;

        salesContainer.appendChild(card);

    });

}

function filterSales() {
    const startDate =
        document.getElementById("startDate").value;

    const endDate =
        document.getElementById("endDate").value;

    const saleId =
        document.getElementById("saleId").value;

    loadSales(startDate, endDate, saleId);
}

document.addEventListener("keypress", e => {
    console.log(e.key)
    if (e.key === "Enter") {
        filterSales();
    }
});

document.addEventListener("keypress", e => {
    if (e.key === "w") {
        const saleIdInput = document.getElementById("saleId");
        let currentId = parseInt(saleIdInput.value) || 0;
        currentId++;
        saleIdInput.value = currentId;
        filterSales();
    }
});
document.addEventListener("keypress", e => {
    if (e.key === "s") {
        const saleIdInput = document.getElementById("saleId");
        let currentId = parseInt(saleIdInput.value) || 0;
        if (currentId > 0) {
            currentId--;
            saleIdInput.value = currentId;
            filterSales();
        }
    }
});

document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        document.getElementById("startDate").value = "";
        document.getElementById("endDate").value = "";
        document.getElementById("saleId").value = "";
        loadSales();
    }
});

filterBtn.addEventListener("click", filterSales);



loadSales();