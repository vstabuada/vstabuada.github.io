import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabase = createClient(
    'https://shirfddotjoqdlztfsxt.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoaXJmZGRvdGpvcWRsenRmc3h0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NjgxMjcsImV4cCI6MjA5NTE0NDEyN30.z4a43wJ7v6iy-MUzyV8dZ0Ejz0UeKcWNX-cBpG4MR_M'
)

const tableBody =
    document.getElementById("productsTableBody");

const searchInput =
    document.getElementById("searchInput");

async function loadProducts(search = "") {

    let query = supabase
        .from("produtos")
        .select("*")
        .order("id", { ascending: false });

    if (search) {
        query = query.ilike(
            "nome",
            `%${search}%`
        );
    }

    const { data, error } = await query;

    if (error) {
        console.error(error);
        return;
    }

    renderProducts(data);

}

function renderProducts(products) {

    tableBody.innerHTML = "";

    products.forEach(product => {

        const lucro =
            product.preco - product.custo;

        const margem =
            ((lucro / product.preco) * 100)
            || 0;

        const row = document.createElement("tr");

        row.innerHTML = `

      <td>${product.id}</td>

      <td>
        <input
          class="edit-input product-name"
          value="${product.nome}"
        >
      </td>
      
      <td>
        <input
          class="edit-input product-category"
          value="${product.categoria}"
        >
      </td>

      <td>
        <input
          type="number"
          step="0.01"
          class="edit-input product-price"
          value="${product.preco}"
        >
      </td>

      <td>
        <input
          type="number"
          step="0.01"
          class="edit-input product-cost"
          value="${product.custo}"
        >
      </td>

      <td>
        R$ ${lucro
                .toFixed(2)
                .replace(".", ",")}
      </td>

      <td class="${margem >= 0
                ? "margin-positive"
                : "margin-negative"
            }">

        ${margem.toFixed(1)}%

      </td>

      <td>

        <div class="action-buttons">

          <button
            class="save-btn"
            data-id="${product.id}"
          >
            Salvar
          </button>

          <button
            class="delete-btn"
            data-id="${product.id}"
          >
            Excluir
          </button>

        </div>

      </td>
    `;

        tableBody.appendChild(row);

    });

    bindButtons();

}

function bindButtons() {

    document
        .querySelectorAll(".save-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                async () => {

                    const row =
                        button.closest("tr");

                    const id =
                        button.dataset.id;

                    const nome =
                        row.querySelector(
                            ".product-name"
                        ).value;

                    const categoria =
                        row.querySelector(
                            ".product-category"
                        ).value;

                    const preco = parseFloat(
                        row.querySelector(
                            ".product-price"
                        ).value
                    );

                    const custo = parseFloat(
                        row.querySelector(
                            ".product-cost"
                        ).value
                    );

                    if (!nome || !categoria || isNaN(preco) || isNaN(custo)) {
                        alert("Preencha todos os campos");
                        return;
                    }

                    const { error } = await supabase
                        .from("produtos")
                        .update({
                            nome,
                            categoria,
                            preco,
                            custo
                        })
                        .eq("id", id);

                    if (error) {
                        alert("Erro ao salvar");
                        console.error(error);
                        return;
                    }

                    loadProducts(searchInput.value);

                }
            );

        });

    document
        .querySelectorAll(".delete-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                async () => {

                    const confirmDelete = confirm(
                        "Deseja excluir este produto?"
                    );

                    if (!confirmDelete) return;

                    const id =
                        button.dataset.id;

                    const { error } = await supabase
                        .from("produtos")
                        .delete()
                        .eq("id", id);

                    if (error) {
                        console.error(error);
                        return;
                    }

                    loadProducts(searchInput.value);

                }
            );

        });

}

async function addProduct() {

    const nome =
        document
            .getElementById("productName")
            .value
            .trim();

    const categoria =
        document
            .getElementById("productCategory")
            .value
            .trim();

    const preco = parseFloat(
        document
            .getElementById("productPrice")
            .value
    );

    const custo = parseFloat(
        document
            .getElementById("productCost")
            .value
    );

    if (!nome || !categoria || isNaN(preco) || isNaN(custo)) {
        alert("Preencha todos os campos");
        return;
    }

    const { error } = await supabase
        .from("produtos")
        .insert([
            {
                nome,
                categoria,
                preco,
                custo
            }
        ]);

    if (error) {
        console.error(error);
        alert("Erro ao adicionar produto");
        return;
    }

    document.getElementById("productName").value = "";
    document.getElementById("productCategory").value = "";
    document.getElementById("productPrice").value = "";
    document.getElementById("productCost").value = "";

    loadProducts(searchInput.value);

}

searchInput.addEventListener(
    "input",
    () => {
        loadProducts(searchInput.value);
    }
);

document
    .getElementById("addProductBtn")
    .addEventListener("click", addProduct);

loadProducts();