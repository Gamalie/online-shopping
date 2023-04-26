class Product{
    //deal with a single product

    constructor(product){
        this.product=product
    }

    render(){
        //rendering a single product
        let html = `
        
        <div class="item">
        <img src=${this.product.productImg} alt="${this.product.productName}" >
        <div class="product-item__content">
          <h2>${this.product.productName}</h2>
          <h3>\$ ${this.product.productPrice}</h3>
          <p>${this.product.productDescription}</p>
          <button onclick="new Product().updateProduct(${this.product.id})">update</button>
          <button onclick="new Product().addToCart(${this.product.id})">Add to Cart</button>
         <button onclick="new Product().deleteProduct(${this.product.id})" ><ion-icon name="trash-outline"></ion-icon></button>
        </div>
     </div>
        
        `

        return html
    }
    async deleteProduct(id) {
        await fetch(`http://localhost:3000/products/${id}`, {
            method:'DELETE',
            headers:{
                "Content-Type": "application/json"
            }
        })
    }
    async updateProduct(id){
        const response = await fetch(`http://localhost:3000/products/${id}`)
        const product = await response.json()
      
       this.prePopulate(product)
       const btn = document.querySelector("#btn")
       btn.addEventListener('click', (e)=>{
        e.preventDefault()
        
        const updatedProduct= new Product().readValues();
        if(btn.innerText==="Update Product"){
            console.log("Updating");
            this.sendUpdate({...updatedProduct, id})
           }
       })

    }

    async sendUpdate(product){
        
        await fetch(`http://localhost:3000/products/${product.id}`, {
            method:'PUT',
            body:JSON.stringify(product),
            headers:{
                "Content-Type": "application/json"
            }
        })
    }
    prePopulate(product){
        document.querySelector("#p_name").value=product.productName
        document.querySelector("#p_image").value = product.productImg
        document.querySelector("#p_price").value =product.productPrice
        document.querySelector("#p_description").value=product.productDescription
        document.querySelector("#btn").textContent= `Update Product`
    }

    readValues(){
        const productName= document.querySelector("#p_name").value
        const productImg = document.querySelector("#p_image").value
        const productPrice =document.querySelector("#p_price").value
        const productDescription =document.querySelector("#p_description").value
        return {productName,productImg,productDescription, productPrice};
    }
    async addProduct(){
        const newProduct =new Product().readValues();
        await fetch(' http://localhost:3000/products', {
            method:'POST',
            body:JSON.stringify(newProduct),
            headers:{
                "Content-Type": "application/json"
            }
        })
    }

    async addToCart(id){
        const cartdb = await fetch(`http://localhost:3000/products/${id}`)
        const cart = await cartdb.json()
      
         const carts = await fetch(' http://localhost:3000/cart', {
            method:'POST',
            body:JSON.stringify(cart),
            headers:{
                "Content-Type": "application/json"
            }
        })
   
        
    }
    
}

const btn = document.querySelector("#btn")

    btn.addEventListener('click', ()=>{
        if(btn.innerText==='Add Product'){
            new Product().addProduct()
        }
        
    })


     async function cartView(){
        //rendering a single product
        const addCart = document.querySelector(".form-group")
        addCart.style.display="none"
        // console.log('hi')
        const cartvi = await fetch(' http://localhost:3000/cart')
        const carV = await cartvi.json()
        let htmlCar =''

        carV .forEach(element => {
            let htmlC = `
       
        <div class="item">
        <img src=${element.productImg} alt="${element.productName}" >
        <div class="product-item__content">
          <h2>${element.productName}</h2>
          <h3>\$ ${element.productPrice}</h3>
          <p>${element.productDescription}</p>
          <button onclick="new Product().updateProduct(${element.id})">update</button>
         <button onclick="new Product().deleteProduct(${element.id})" ><ion-icon name="trash-outline"></ion-icon></button>
        </div>
     </div>
        
        `
        htmlCar+=htmlC
        });
   

    const addCart1 = document.querySelector(".form-content")
    addCart1.innerHTML= htmlCar

    }
    const viewCartButton =document.querySelector('#VC')  
    viewCartButton.addEventListener('click',cartView)
class ProductList{
//deal with all products

     async render(){
        //get list of products and render- api call
        let products= await this.fetchProduct()
        // console.log(products);
        let html=''
        for(let product of products){
            const productHTML = new Product(product).render()
            html +=productHTML
        }
        return html
     }

     async fetchProduct(){
        const response = await fetch('http://localhost:3000/products')
        const products = await response.json()
        return products
     }
}


class App{
    static async Init(){
        let productList=new ProductList()
        let htmlProducts = await productList.render()
        // console.log((htmlProducts));
        let app= document.querySelector('#app')
        app.innerHTML=htmlProducts
    }    
}


App.Init()
// class CustomElement extends HTMLElement{
//     static async Init(){
//         let productList=new ProductList()
//         let htmlProducts = await productList.render()
//         // console.log((htmlProducts));
//         let app= document.querySelector('#app')
//         app.innerHTML=htmlProducts
//     }  
// }
// CustomElement.Init()
// CustomElement.define( "product-item" , CustomElement);

