// Variável para armazenar o usuário atual (usando localStorage)
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

// Função para atualizar o status de login no ícone
function updateLoginStatus() {
    const loginIcon = document.getElementById("login-icon");
    if (currentUser) {
        loginIcon.textContent = "👤"; // Exibe o ícone do usuário logado
        loginIcon.onclick = () => {
            if (confirm("Deseja sair da sua conta?")) {
                localStorage.removeItem("currentUser"); // Remove o usuário logado
                currentUser = null;
                location.reload(); // Recarrega a página para atualizar o status
            }
        };
    } else {
        loginIcon.textContent = "Login"; // Exibe "Login" quando não estiver logado
        loginIcon.href = "login.html"; // Redireciona para a página de login
    }
}

// Função para login do usuário
function loginUser(username, password) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((user) => user.username === username && user.password === password);
    if (user) {
        localStorage.setItem("currentUser", JSON.stringify(username)); // Armazena o usuário logado
        currentUser = username;
        location.href = "index.html"; // Redireciona para a página de produtos após login
    } else {
        alert("Usuário ou senha incorretos."); // Exibe erro se não encontrar o usuário
    }
}

// Função para registrar um novo usuário
function registerUser(username, password) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find((user) => user.username === username)) {
        alert("Usuário já existe."); // Alerta se o usuário já existir
        return;
    }
    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users)); // Armazena os novos dados de usuário
    localStorage.setItem("currentUser", JSON.stringify(username)); // Loga o novo usuário
    currentUser = username;
    location.href = "index.html"; // Redireciona para a página de produtos após cadastro
}

// Função para processar o formulário de login ou cadastro
function handleAuth(event) {
    event.preventDefault(); // Impede o envio do formulário

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Verifica se o botão clicado é para login ou cadastro
    const submitButton = event.target.querySelector("button");
    if (submitButton.textContent === "Entrar") {
        loginUser(username, password); // Chama a função de login
    } else {
        registerUser(username, password); // Chama a função de cadastro
    }
}

// Função para alternar entre os formulários de login e cadastro
function toggleForm(event) {
    event.preventDefault();
    const submitButton = document.getElementById("submit-btn");
    if (submitButton.textContent === "Entrar") {
        submitButton.textContent = "Cadastrar";
        document.getElementById("toggle-btn").textContent = "Já tem conta? Faça login.";
    } else {
        submitButton.textContent = "Entrar";
        document.getElementById("toggle-btn").textContent = "Não tem conta? Cadastre-se.";
    }
}

// Renderiza os produtos na página inicial
function renderProducts() {
    const products = [
        { id: 1, name: "Bolo de Chocolate", price: 90.00, image: "assets/img/menu/bolo1.jpg", category: "filter-starters" },
        { id: 2, name: "Bolo de Morango", price: 85.00, image: "assets/img/menu/bolo2.jpg", category: "filter-starters" },
        { id: 3, name: "Bolo de ninho", price: 100.00, image: "assets/img/menu/bolo3.jpg", category: "filter-starters" },
        { id: 4, name: "Bolo de pote Morango", price: 15.00, image: "assets/img/menu/bolo_pote1.jpg", category: "filter-specialty" },
        { id: 5, name: "Bolo de pote morango e ninho", price: 15.00, image: "assets/img/menu/bolo_pote2.jpg", category: "filter-specialty" },
        { id: 6, name: "Bolo de pote limão", price: 15.00, image: "assets/img/menu/bolo_pote3.jpg", category: "filter-specialty" },
        { id: 7, name: "Beijinho", price: 15.00, image: "assets/img/menu/doce1.jpg", category: "filter-salads" },
        { id: 8, name: "Bicho de pé", price: 15.00, image: "assets/img/menu/doce4.jpg", category: "filter-salads" },
        { id: 9, name: "Brigadeiro", price: 15.00, image: "assets/img/menu/doce3.jpg", category: "filter-salads" }
    ];

    // Seleciona o contêiner onde os produtos serão exibidos
    const productContainer = document.getElementById("product-container");  
    productContainer.innerHTML = ""; // Limpar qualquer conteúdo anterior

    // Agrupar os produtos por categoria
    const categories = ["filter-starters", "filter-specialty", "filter-salads"];
    
    categories.forEach((category) => {
        const filterDiv = document.createElement("div");
        filterDiv.classList.add("row", category); // Cria uma nova linha com a classe do filtro

        // Filtra os produtos pela categoria
        const filteredProducts = products.filter((product) => product.category === category);

        filteredProducts.forEach((product) => {
            // Criar a div para cada produto
            const productDiv = document.createElement("div");
            productDiv.classList.add("col-lg-4", "menu-item", "isotope-item", category);

            // Adicionar o conteúdo HTML do produto dentro da div
            productDiv.innerHTML = `
                <img src="${product.image}" class="menu-img" alt="${product.name}">
                <div class="menu-content">
                    <a href="#">${product.name}</a><span>R$ ${product.price.toFixed(2)}</span>
                </div>
                <div class="menu-ingredients">
                    Delicioso ${product.name.toLowerCase()}
                </div>
                <button onclick="addToCart(${product.id})">Adicionar ao Carrinho</button>
            `;

            // Adicionar o produto ao filtro
            filterDiv.appendChild(productDiv);
        });

        // Adicionar o grupo de produtos ao contêiner de produtos
        productContainer.appendChild(filterDiv);
    });
}


// Função para adicionar produtos ao carrinho
function addToCart(productId) {
    if (!currentUser) {
        alert("Você precisa estar logado para adicionar produtos ao carrinho.");
        location.href = "login.html";
        return;
    }

    const products = JSON.parse(localStorage.getItem("products")) || [];
    const selectedProduct = products.find((product) => product.id === productId);
    if (!selectedProduct) return;

    let cart = JSON.parse(localStorage.getItem(`${currentUser}_cart`) || "[]");
    cart.push(selectedProduct);
    localStorage.setItem(`${currentUser}_cart`, JSON.stringify(cart));

    updateCartCount();
    updateCartPreview();
}

// Atualiza a contagem do carrinho no ícone
function updateCartCount() {
    const cartCount = document.getElementById("cart-count");
    const cart = JSON.parse(localStorage.getItem(`${currentUser}_cart`) || "[]");
    cartCount.textContent = cart.length;
}

// Exibe prévia do carrinho ao passar o mouse
function updateCartPreview() {
    const cartPreview = document.getElementById("cart-preview");
    if (!cartPreview) return;

    const cart = JSON.parse(localStorage.getItem(`${currentUser}_cart`) || "[]");
    cartPreview.innerHTML = ""; // Limpa a prévia

    if (cart.length === 0) {
        cartPreview.innerHTML = "<p>Seu carrinho está vazio.</p>";
        return;
    }

    cart.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("cart-item");
        productDiv.innerHTML = `
            <p>${product.name} - R$ ${product.price.toFixed(2)}</p>
        `;
        cartPreview.appendChild(productDiv);
    });
}

// Redireciona para a página do carrinho
function goToCart() {
    location.href = "cart.html";
}

// Inicialização da página de login
if (document.location.pathname.includes("login.html")) {
    document.getElementById("auth-form").addEventListener("submit", handleAuth);
    document.getElementById("toggle-btn").addEventListener("click", toggleForm);
}

// Inicialização da página de produtos
if (document.location.pathname.includes("index.html")) {
    updateLoginStatus();
    renderProducts();
    updateCartCount();

    const cartIcon = document.getElementById("cart-icon");
    cartIcon.addEventListener("mouseenter", updateCartPreview);
    cartIcon.addEventListener("click", goToCart);
}

// Inicialização da página do carrinho
if (document.location.pathname.includes("cart.html")) {
    const cartItems = document.getElementById("cart-items");
    const cart = JSON.parse(localStorage.getItem(`${currentUser}_cart`) || "[]");

    cartItems.innerHTML = ""; // Limpa a lista de produtos

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Seu carrinho está vazio.</p>";
    } else {
        let total = 0;

        cart.forEach(product => {
            total += product.price;
            const productDiv = document.createElement("div");
            productDiv.classList.add("cart-item");
            productDiv.innerHTML = `
                <p>${product.name} - R$ ${product.price.toFixed(2)}</p>
            `;
            cartItems.appendChild(productDiv);
        });

        // Exibe o total no carrinho
        const totalDiv = document.createElement("div");
        totalDiv.innerHTML = `<h3>Total: R$ ${total.toFixed(2)}</h3>`;
        cartItems.appendChild(totalDiv);
    }

    document.querySelector("button").addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Adicione produtos ao carrinho antes de finalizar a compra.");
        } else {
            location.href = "pagamento.html";
        }
    });
}

// Função para calcular o frete aleatório
function calculateFrete(cep) {
    // Simula um cálculo de frete, se o CEP for válido
    if (/^\d{5}-\d{3}$/.test(cep)) {
        const shippingFee = (Math.random() * (50 - 10) + 10).toFixed(2);
        const total = parseFloat(localStorage.getItem("total-price"));
        const totalWithShipping = (total + parseFloat(shippingFee)).toFixed(2);

        document.getElementById("frete").textContent = `Frete: R$ ${shippingFee}`;
        document.getElementById("total-with-shipping").textContent = `R$ ${totalWithShipping}`;

        return shippingFee;
    } else {
        alert("CEP inválido.");
        return null;
    }
}

// Função para gerar QR Code para o Pix
function generatePixQRCode() {
    const qr = new QRious({
        element: document.getElementById("qr-code"),
        value: "https://api.qrserver.com/v1/create-qr-code/?data=PIX-EXEMPLO", // Substitua com uma URL do Pix real
        size: 200
    });
}

// Função para exibir formulário de Cartão de Crédito/Débito
function showCreditDebitForm() {
    document.getElementById("credit-debit-section").style.display = "block";
    document.getElementById("pix-section").style.display = "none";
}

// Função para esconder os formulários e exibir o QR Code para Pix
function showPixSection() {
    document.getElementById("credit-debit-section").style.display = "none";
    document.getElementById("pix-section").style.display = "block";
    generatePixQRCode(); // Gera o QR Code quando o Pix for selecionado
}

// Função para verificar se todos os campos do cartão estão preenchidos
function isCardFormValid() {
    const cardName = document.getElementById("card-name").value;
    const cardNumber = document.getElementById("card-number").value;
    const expiryDate = document.getElementById("expiry-date").value;
    const cvv = document.getElementById("cvv").value;

    return cardName && cardNumber && expiryDate && cvv;
}

// Atualização das informações de pagamento e resumo
if (document.location.pathname.includes("pagamento.html")) {
    const cart = JSON.parse(localStorage.getItem(`${currentUser}_cart`) || "[]");
    const total = cart.reduce((sum, product) => sum + product.price, 0);
    
    localStorage.setItem("total-price", total); // Armazena o total da compra para uso posterior
    document.getElementById("total-price").textContent = `R$ ${total.toFixed(2)}`;

    // Alterna entre as opções de pagamento
    const paymentRadios = document.querySelectorAll('input[name="payment-method"]');
    paymentRadios.forEach(radio => {
        radio.addEventListener("change", function() {
            const paymentMethod = this.value;
            if (paymentMethod === "pix") {
                showPixSection();
            } else if (paymentMethod === "credit-card" || paymentMethod === "debit-card") {
                showCreditDebitForm();
            }
        });
    });

    // Cálculo de frete quando o CEP for informado
    document.getElementById("calc-frete-btn").addEventListener("click", function() {
        const cep = document.getElementById("cep").value;
        calculateFrete(cep);
    });

    // Finalização da compra
    document.getElementById("finalize-purchase").addEventListener("click", function() {
        const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
        const shippingFee = calculateFrete(document.getElementById("cep").value);
        
        if (!shippingFee) return; // Se o frete não for válido, impede a finalização

        // Verifica se o formulário do cartão está preenchido
        if ((selectedPaymentMethod === "credit-card" || selectedPaymentMethod === "debit-card") && !isCardFormValid()) {
            alert("Por favor, preencha todos os campos do cartão.");
            return;
        }

        setTimeout(() => {
            alert(`Compra finalizada com sucesso! Método de pagamento: ${selectedPaymentMethod.toUpperCase()}`);
            localStorage.removeItem(`${currentUser}_cart`); // Limpa o carrinho após a compra
            location.href = "index.html"; // Redireciona para a página inicial após a compra
        }, 1000);
    });
}

