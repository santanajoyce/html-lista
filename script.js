// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
// Your web app's Firebase configuration


  // Import the functions you need from the SDKs you need
  
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCULC_Nhnsq2hAde8E6ybO29kToEdDQF58",
    authDomain: "lista-compras-481ff.firebaseapp.com",
    projectId: "lista-compras-481ff",
    storageBucket: "lista-compras-481ff.appspot.com",
    messagingSenderId: "1041571891457",
    appId: "1:1041571891457:web:a3ec862f115264a2bb3300"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);





// Get a reference to the Firestore database
const db = getFirestore(app);


const productInput = document.getElementById('product');
const priceInput = document.getElementById('price');
const shoppingList = document.getElementById('shopping-list');


const addItem = document.getElementById('add-item'); //botão






addItem.addEventListener("click", async function() {
   console.log('função addItem é chamada');
   const product = productInput.value;
   const price = priceInput.value;


   if (product && price) {
       const item = { product, price };


       // Store item in localStorage
       const localData = JSON.parse(localStorage.getItem('shoppingList')) || [];
       localData.push(item);
       localStorage.setItem('shoppingList', JSON.stringify(localData));


       // Send item to Firestore
       const doc = await sendItemToFirestore(item);


       // Add item to the list on the page
       const listItem = document.createElement('li');
       listItem.innerHTML = `<span>${product}</span><span>$ ${price}</span>`;
       listItem.setAttribute('data-doc-id', doc.id);
       shoppingList.appendChild(listItem);


       // Clear input fields
       productInput.value = '';
       priceInput.value = '';


       // Configurar eventos de exclusão para o novo elemento
       listItem.setAttribute('data-doc-id', doc.id);
       listItem.addEventListener("click", async function(){
           try {
               const docId = this.getAttribute('data-doc-id');
               await deleteItemFromFirestore(docId);
           } catch (error) {
               console.error('Erro ao apagar o item do Firestore:', error);
           }
       });
   } else {
       alert('Por favor, preencha todos os campos.');
   }
});




async function sendItemToFirestore(item) {
   const collectionRef = collection(db, 'shopping-list');
   const docRef = await addDoc(collectionRef, item);
   console.log('Item enviado ao Firestore com sucesso');


   // Incluir o ID gerado pelo Firestore no objeto item
   return { ...item, id: docRef.id };
}


// Retrieve and display data from localStorage on page load
window.onload = async function () {
   await displayFirestoreData();
};


async function displayFirestoreData() {
   try {
       // Limpar a lista no DOM
       shoppingList.innerHTML = '';


       // Recuperar e exibir dados do Firestore
       const querySnapshot = await getDocs(collection(db, 'shopping-list'));
       querySnapshot.forEach((doc) => {
           const listItem = document.createElement('li');
           listItem.innerHTML = `<span>${doc.data().product}</span><span>R$ ${doc.data().price}</span>`;
           listItem.setAttribute('data-doc-id', doc.id);
           shoppingList.appendChild(listItem);
       });


       // Configurar eventos de exclusão para todos os elementos
       setupDeleteEventListeners();
   } catch (error) {
       console.error('Erro ao exibir dados do Firestore:', error);
   }
}




// Function to delete item from Firestore (call this function when needed)
async function deleteItemFromFirestore(docId) {
   try {
       // Remove item from Firestore
       await deleteDoc(doc(db, 'shopping-list', docId));
       console.log('Item apagado do Firestore com sucesso');


       // Remove item from localStorage
       const localData = JSON.parse(localStorage.getItem('shoppingList')) || [];
       const updatedLocalData = localData.filter(item => item.id !== docId);
       localStorage.setItem('shoppingList', JSON.stringify(updatedLocalData));
       console.log('Item removido do localStorage com sucesso');


       // Remove item from the DOM
       const listItem = document.querySelector(`li[data-doc-id="${docId}"]`);
       if (listItem) {
           listItem.remove();
           console.log('Elemento da lista removido do DOM com sucesso');
       } else {
           console.warn('Elemento da lista não encontrado no DOM');
       }


       // Atualizar a exibição do Firestore
       await displayFirestoreData();
   } catch (error) {
       console.error('Erro ao apagar o item:', error);
   }
}


function setupDeleteEventListeners() {
   const listItems = document.querySelectorAll('li[data-doc-id]');
   listItems.forEach(listItem => {
       listItem.addEventListener("click", async function() {
           try {
               const docId = this.getAttribute('data-doc-id');
               await deleteItemFromFirestore(docId);
           } catch (error) {
               console.error('Erro ao apagar o item do Firestore:', error);
           }
       });
   });
}




shoppingList.addEventListener("click", function(event) {
   const listItem = event.target.closest('li[data-doc-id]');
   if (listItem) {
       const docId = listItem.getAttribute('data-doc-id');
       deleteItemFromFirestore(docId);
   }else{
       console.error()
   }
});

    