document.addEventListener("DOMContentLoaded", () => {
  // Produtos disponíveis
  const products = [
    { id: 1, name: "Smartphone", emoji: "📱", price: 1999.99 },
    { id: 2, name: "Notebook", emoji: "💻", price: 3499.90 },
    { id: 3, name: "Fone de Ouvido", emoji: "🎧", price: 299.99 },
    { id: 4, name: "Smartwatch", emoji: "⌚", price: 799.00 },
    { id: 5, name: "Câmera", emoji: "📷", price: 1299.00 },
    { id: 6, name: "Console", emoji: "🎮", price: 2499.00 },
    { id: 7, name: "Tablet", emoji: "📲", price: 1200.00 },
    { id: 8, name: "TV", emoji: "📺", price: 2799.00 },
    { id: 9, name: "Drone", emoji: "🚁", price: 2100.00 },
  ];

  const productsGrid = document.getElementById("productsGrid");
  const toAddressBtn = document.getElementById("toAddressBtn");
  const toConfirmBtn = document.getElementById("toConfirmBtn");
  const finishPurchaseBtn = document.getElementById("finishPurchaseBtn");

  // Estado da compra: IDs dos produtos selecionados
  let selectedProducts = new Set();

  // Criar os cards dos produtos
  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    const emoji = document.createElement("div");
    emoji.className = "product-emoji";
    emoji.textContent = product.emoji;
    card.appendChild(emoji);

    const name = document.createElement("div");
    name.className = "product-name";
    name.textContent = product.name;
    card.appendChild(name);

    const price = document.createElement("div");
    price.className = "product-price";
    price.textContent = `R$ ${product.price.toFixed(2).replace(".", ",")}`;
    card.appendChild(price);

    const btn = document.createElement("button");
    btn.textContent = "Adicionar";
    btn.setAttribute("aria-pressed", "false");
    btn.className = "btn btn-primary";
    btn.addEventListener("click", () => {
      if (selectedProducts.has(product.id)) {
        selectedProducts.delete(product.id);
        btn.textContent = "Adicionar";
        btn.setAttribute("aria-pressed", "false");
        card.style.backgroundColor = "#e7ecf0";
      } else {
        selectedProducts.add(product.id);
        btn.textContent = "Remover";
        btn.setAttribute("aria-pressed", "true");
        card.style.backgroundColor = "#d1f0d1";
      }
      toAddressBtn.disabled = selectedProducts.size === 0;
    });
    card.appendChild(btn);

    productsGrid.appendChild(card);
  });

  // Controle de abas
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");

  function activateTab(tabId) {
    tabs.forEach(tab => {
      const isActive = tab.id === tabId;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
      tab.tabIndex = isActive ? 0 : -1;
    });

    tabContents.forEach(content => {
      content.classList.toggle("active", content.id === tabId.replace("-btn", ""));
    });

    // Mover foco para aba ativa para acessibilidade
    const activeTab = document.getElementById(tabId);
    if (activeTab) activeTab.focus();
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      activateTab(tab.id);
    });
  });

  // Links do menu no header também funcionam para mudar abas
  document.querySelectorAll("header nav a").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const targetTab = link.getAttribute("data-tab");
      if (targetTab) activateTab(targetTab);
    });
  });

  // Botões navegação fluxo compra
  const backToProductsBtn = document.getElementById("backToProductsBtn");
  const backToAddressBtn = document.getElementById("backToAddressBtn");

  // Formulário endereço
  const addressForm = document.getElementById("addressForm");

  // Ir para aba endereço
  toAddressBtn.addEventListener("click", () => {
    activateTab("endereco-tab-btn");
    validateAddressForm();
  });

  // Voltar aos produtos
  backToProductsBtn.addEventListener("click", () => {
    activateTab("produtos-tab-btn");
  });

  // Confirmar endereço e ir para resumo
  toConfirmBtn.addEventListener("click", () => {
    if (addressForm.checkValidity()) {
      fillSummary();
      activateTab("confirmacao-tab-btn");
    } else {
      addressForm.reportValidity();
    }
  });

  // Voltar para endereço da aba confirmação
  backToAddressBtn.addEventListener("click", () => {
    activateTab("endereco-tab-btn");
  });

  // Finalizar compra
  finishPurchaseBtn.addEventListener("click", () => {
    alert("Compra finalizada! Muito obrigado pela preferência.");
    // Resetar estado
    selectedProducts.clear();
    productsGrid.querySelectorAll("button").forEach(btn => {
      btn.textContent = "Adicionar";
      btn.setAttribute("aria-pressed", "false");
      btn.parentElement.style.backgroundColor = "#e7ecf0";
    });
    toAddressBtn.disabled = true;
    addressForm.reset();
    toConfirmBtn.disabled = true;
    activateTab("produtos-tab-btn");
  });

  // Validar formulário para ativar botão Confirmar endereço
  function validateAddressForm() {
    toConfirmBtn.disabled = !addressForm.checkValidity();
  }

  addressForm.addEventListener("input", validateAddressForm);
  addressForm.addEventListener("change", validateAddressForm);

  // Preencher resumo da compra
  function fillSummary() {
    const summaryItems = document.getElementById("summaryItems");
    const summaryTotal = document.getElementById("summaryTotal");
    const summaryAddress = document.getElementById("summaryAddress");

    summaryItems.innerHTML = "";
    let total = 0;
    selectedProducts.forEach(id => {
      const p = products.find(prod => prod.id === id);
      if (p) {
        const li = document.createElement("li");
        li.textContent = `${p.emoji} ${p.name} — R$ ${p.price.toFixed(2).replace(".", ",")}`;
        summaryItems.appendChild(li);
        total += p.price;
      }
    });
    summaryTotal.textContent = `Total: R$ ${total.toFixed(2).replace(".", ",")}`;

    // Formatar endereço
    const data = new FormData(addressForm);
    const addressText =
      `${data.get("name")}\n` +
      `${data.get("street")}\n` +
      `${data.get("city")} - ${data.get("state")}\n` +
      `CEP: ${data.get("zip")}\n` +
      `Telefone: ${data.get("phone")}`;
    summaryAddress.textContent = addressText;
  }
});
