import { _fetch, debounce } from "../external/scripts/api.js";

const PRODUCT_URL = "http://localhost:3000/products";
let mainImg = null;

function addSingleValues(product) {
    document.querySelectorAll("#form form input:not(#gallery-main, #submit, .gallery-input, .size-input), #form form textarea").forEach(element => {
        element.value = product[element.getAttribute("id")];
    })
}

function createGalleryFields(gallery) {
    document.querySelector("#gallery-other").innerHTML = "<button class=\"gallery-add\">Add</button><br>" + gallery.map(img => `
        <button class="delete-button gallery-delete">Delete</button>
        <input type="text" value="${img}" class="gallery-input"><br>
    `).join("")
}

function createSizes(_sizes) {
    document.querySelector("#size-list").innerHTML = "<button class=\"size-add\">Add</button><br>" + _sizes.map(size => `
        <button class="delete-button size-delete">Delete</button>
        <input type="text" value="${size}" class="size-input"><br>
    `).join("")
}

window.addEventListener("load", async event => {
    try {
        // Adding the form
        let form = await fetch("../external/product_manipulation_form.html");
        form = await form.text()
        document.querySelector("#form").innerHTML = form;

        // Getting the product ID if present in the query parameters
        let id = new URLSearchParams(window.location.search).get("id");
        if (id) {
            // Getting the product
            let product = await _fetch(`${PRODUCT_URL}?id=${id}`);
            product = await product.json();
            product = product[0];

            // Adding  product sizes to DOM
            createSizes(product.size);

            // Adding main gallery image
            document.querySelector("#gallery-main").setAttribute("value", product.image)

            // Adding images fields to DOM
            createGalleryFields(product.gallery.map(img => img.image));

            // Adding other single values to form in DOM
            addSingleValues(product);
        }
        else {
            document.querySelector("#gallery-other").innerHTML = "<button class=\"gallery-add\">Add</button><br>";
            document.querySelector("#size-list").innerHTML = "<button class=\"size-add\">Add</button><br>"
        }
    } catch (error) {
        console.error(error);
    }
})

// Activating the gallery delete button
document.querySelector("#form").addEventListener("click", function (event) {
    if (!event.target.classList.contains("gallery-delete")) return;

    let temp = []
    document.querySelectorAll(".gallery-delete+input").forEach(input => temp.push(input.value))
    temp = temp.filter(img => img != event.target.nextElementSibling.value)
    createGalleryFields(temp)
})

// Activating the size delete button
document.querySelector("#form").addEventListener("click", function (event) {
    if (!event.target.classList.contains("size-delete")) return;

    let temp = []
    document.querySelectorAll(".size-delete+input").forEach(input => temp.push(input.value))
    temp = temp.filter(size => size != event.target.nextElementSibling.value)
    createSizes(temp);
})

// Activating the gallery add button
document.querySelector("#form").addEventListener("click", function (event) {
    if (!event.target.classList.contains("gallery-add")) return;

    document.querySelector("#gallery-other").innerHTML += `
        <button class="delete-button gallery-delete">Delete</button>
        <input type="text"><br>
    `
})

// Activating the size add button
document.querySelector("#form").addEventListener("click", function (event) {
    if (!event.target.classList.contains("size-add")) return;

    document.querySelector("#size-list").innerHTML += `
        <button class="delete-button size-delete">Delete</button>
        <input type="text"><br>
    `
})