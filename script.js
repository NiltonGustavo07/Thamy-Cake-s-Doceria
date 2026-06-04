let carrinho = [];
let totalPedido = 0;


function adicionarAoPedido(nomeProduto, precoProduto) {
    
    const itemExistente = carrinho.find(item => item.nome === nomeProduto);

    if (itemExistente) {
        
        itemExistente.quantidade += 1;
    } else {
        
        carrinho.push({ nome: nomeProduto, preco: precoProduto, quantidade: 1 });
    }

    
    atualizarInterfaceCheckout();

    
    const checkoutSecao = document.getElementById('checkout-container');
    checkoutSecao.style.display = 'flex';
    checkoutSecao.scrollIntoView({ behavior: 'smooth' });
}


function atualizarInterfaceCheckout() {
    const containerItens = document.getElementById('lista-itens-pedido');
    const containerTotal = document.getElementById('valor-total-pedido');
    
    
    containerItens.innerHTML = "";
    totalPedido = 0;

    
    carrinho.forEach((item, indice) => {
        const subtotalItem = item.preco * item.quantidade;
        totalPedido += subtotalItem; 

       
        containerItens.innerHTML += `
            <div class="item-linha">
                <div class="item-info">
                    <span>${item.nome}</span>
                    <span>R$ ${subtotalItem.toFixed(2).replace('.', ',')}</span>
                </div>
                <div class="item-botoes">
                    <button class="btn-quantidade" onclick="diminuirQuantidade(${indice})">−</button>
                    <span class="quantidade-display">${item.quantidade}</span>
                    <button class="btn-quantidade" onclick="aumentarQuantidade(${indice})">+</button>
                </div>
            </div>
         `;
    });

    containerTotal.innerText = `R$ ${totalPedido.toFixed(2).replace('.', ',')}`;
}


function aumentarQuantidade(indice) {
    if (indice >= 0 && indice < carrinho.length) {
        carrinho[indice].quantidade += 1;
        atualizarInterfaceCheckout();
    }
}


function diminuirQuantidade(indice) {
    if (indice >= 0 && indice < carrinho.length) {
        if (carrinho[indice].quantidade > 1) {
            carrinho[indice].quantidade -= 1;
        } else {
            removerDoCarrinho(indice);
            return;
        }
        atualizarInterfaceCheckout();
    }
}


function removerDoCarrinho(indice) {
    if (indice >= 0 && indice < carrinho.length) {
        carrinho.splice(indice, 1);
        atualizarInterfaceCheckout();
        
        if (carrinho.length === 0) {
            const checkoutSecao = document.getElementById('checkout-container');
            checkoutSecao.style.display = 'none';
        }
    }
}


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


document.getElementById('form-pagamento').addEventListener('submit', function(e) {
    e.preventDefault();

    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio! Selecione um doce acima.");
        return;
    }

    
    const nomeCliente = document.getElementById('nome-cliente').value;
    const ruaCliente = document.getElementById('rua-cliente').value;
    const numeroCliente = document.getElementById('numero-cliente').value;
    const bairroCliente = document.getElementById('bairro-cliente').value;
    const referenciaCliente = document.getElementById('referencia-cliente').value || "Não informado";
    
    const metodoPagamento = document.querySelector('input[name="metodo-pagamento"]:checked').value;
    
    
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