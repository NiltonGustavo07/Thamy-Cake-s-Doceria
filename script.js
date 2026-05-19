
let carrinho = [];
let totalPedido = 0;

// Função chamada quando o cliente clica em "Adicionar ao Pedido"
function adicionarAoPedido(nomeProduto, precoProduto) {
    // Procura se o produto já está no carrinho
    const itemExistente = carrinho.find(item => item.nome === nomeProduto);

    if (itemExistente) {
        // Se já existir, aumenta a quantidade
        itemExistente.quantidade += 1;
    } else {
        // Se for novo, adiciona o objeto no array
        carrinho.push({ nome: nomeProduto, preco: precoProduto, quantidade: 1 });
    }

    // Recalcula o total e atualiza a tela
    atualizarInterfaceCheckout();

    // Abre e rola a tela até o formulário de fechamento
    const checkoutSecao = document.getElementById('checkout-container');
    checkoutSecao.style.display = 'flex';
    checkoutSecao.scrollIntoView({ behavior: 'smooth' });
}

// Função que faz a matemática de somar e escreve na tela
function atualizarInterfaceCheckout() {
    const containerItens = document.getElementById('lista-itens-pedido');
    const containerTotal = document.getElementById('valor-total-pedido');
    
    // Limpa o texto anterior
    containerItens.innerHTML = "";
    totalPedido = 0;

    // Passa de item em item calculando os subtotais
    carrinho.forEach(item => {
        const subtotalItem = item.preco * item.quantidade;
        totalPedido += subtotalItem; // Soma no acumulador geral

        // Cria a linha visual do produto para o cliente ver
        containerItens.innerHTML += `
            <div class="item-linha">
                <span>${item.quantidade}x ${item.nome}</span>
                <span>R$ ${subtotalItem.toFixed(2).replace('.', ',')}</span>
            </div>
        `;
    });

    // Atualiza o valor do elemento HTML na tela formatado em moeda real
    containerTotal.innerText = `R$ ${totalPedido.toFixed(2).replace('.', ',')}`;
}

// Controla os campos visíveis (Troco ou QR Code)
function mudarMetodoPagamento() {
    const metodo = document.querySelector('input[name="metodo-pagamento"]:checked').value;
    const campoTroco = document.getElementById('campo-troco');
    const campoPix = document.getElementById('campo-pix');

    campoTroco.style.display = 'none';
    campoPix.style.display = 'none';

    if (metodo === 'Dinheiro') {
        campoTroco.style.display = 'flex';
    } else if (metodo === 'Pix') {
        campoPix.style.display = 'block';
    }
}

// Captura do envio para montar o texto formatado para o WhatsApp com o endereço
document.getElementById('form-pagamento').addEventListener('submit', function(e) {
    e.preventDefault();

    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio! Selecione um doce acima.");
        return;
    }

    // Captura os dados do cliente e endereço
    const nomeCliente = document.getElementById('nome-cliente').value;
    const ruaCliente = document.getElementById('rua-cliente').value;
    const numeroCliente = document.getElementById('numero-cliente').value;
    const bairroCliente = document.getElementById('bairro-cliente').value;
    const referenciaCliente = document.getElementById('referencia-cliente').value || "Não informado";
    
    const metodoPagamento = document.querySelector('input[name="metodo-pagamento"]:checked').value;
    
    // Monta a listagem de produtos
    let textoProdutos = "";
    carrinho.forEach(item => {
        textoProdutos += `• ${item.quantidade}x ${item.nome} (R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')})\n`;
    });

    let detalhesPagamento = `Forma de Pagamento: *${metodoPagamento}*`;
    if (metodoPagamento === 'Dinheiro') {
        const troco = document.getElementById('valor-troco').value;
        if(troco) detalhesPagamento += ` (${troco})`;
    }

    const numeroWhatsApp = "5574999335607"; 

    // Mensagem estruturada com os dados de entrega inclusos
    const mensagem = `🧁 *NOVO PEDIDO - THAMY CAKES* 🧁\n\n` +
                     `👤 *Cliente:* ${nomeCliente}\n\n` +
                     `📍 *Endereço de Entrega:*\n` +
                     `• Rua: ${ruaCliente}, Nº ${numeroCliente}\n` +
                     `• Bairro: ${bairroCliente}\n` +
                     `• Referência: ${referenciaCliente}\n\n` +
                     `🛒 *Itens Encomendados:*\n${textoProdutos}\n` +
                     `💰 *Total Geral:* R$ ${totalPedido.toFixed(2).replace('.', ',')}\n` +
                     `💳 *${detalhesPagamento}*`;
    
    const mensagemFormatada = encodeURIComponent(mensagem);
    const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemFormatada}`;
    
    window.open(linkWhatsApp, '_blank');
});