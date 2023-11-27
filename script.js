function addItem() {
    const productInput = document.getElementById('product');
    const priceInput = document.getElementById('price');
    const shoppingList = document.getElementById('shopping-list');
 
    const product = productInput.value;
    const price = priceInput.value;
 
    if (product && price) {
      // Obter dados do localStorage
      const localData = JSON.parse(localStorage.getItem('shoppingList')) || [];
 
      // Adicionar novo item aos dados locais
      localData.push({ product, price });
 
      // Armazenar dados atualizados no localStorage
      localStorage.setItem('shoppingList', JSON.stringify(localData));
 
      // Adicionar item à lista na página
      const listItem = document.createElement('li');
      listItem.innerHTML = `<span>${product}</span><span>${price}</span>`;
      shoppingList.appendChild(listItem);
 
      // Limpar os campos de entrada
      productInput.value = '';
      priceInput.value = '';
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  }
 
  // Recuperar e exibir dados do localStorage ao carregar a página
  window.onload = function () {
    const shoppingList = document.getElementById('shopping-list');
    const localData = JSON.parse(localStorage.getItem('shoppingList')) || [];
 
    localData.forEach(item => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `<span>${item.product}</span><span>${item.price}</span>`;
      shoppingList.appendChild(listItem);
    });
  };

    