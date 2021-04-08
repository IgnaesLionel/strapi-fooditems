const foodDiv = document.querySelector(".food");
const url = "http://localhost:1337"

let allFood = [];
let lastAddedItem = null;

// get du formulaire
const addfoodForm = document.forms.addfood;
const foodTitle = addfoodForm.foodtitle;
const expirationdate = addfoodForm.expirationdate;

//Methode Get
const getFood = () => {
    setTimeout(() => {
        fetch(`${url}/fooditems?_sort=expirationdate:ASC`)
        .then(data => data.json())
        .then(result => {
            allFood = result;
            renderFood(allFood)
            if (lastAddedItem !== null) {
                flashLastAddedItem(lastAddedItem)
            }
        })
        .catch((err) => { console.error(err) })
        console.log("refresh")
    }, 500)
   
}

// Injection de la requete Get sur index.html
const renderFood = (food) => {
    let list = [];
    food.forEach(f => {
        const dateFR = convertInFrenchDataString(f.expirationdate)
        const item = `<li id=${f.id}><button>x</button> ${f.title} à consommer avant le ${dateFR} </li>`;
        list = [...list, item]

    })
    foodDiv.innerHTML = `<ul>${list.join("")}</ul>`;
}

// Recupération des données du formulaire 
const addFood = (e) => {
    e.preventDefault()
    const title = foodTitle.value.trim();
    const date = expirationdate.value;

    //mise en forme dans un objet
    const payload = {
        title: title,
        expirationdate: date,
        category: 'default'
    }

    //vide le formulaire
    pushFood(payload);
    foodTitle.value = "";
    expirationdate.value = "";
    getFood() // recup pour refresh
}

//Methode POST
const pushFood = (dataToPush) => {
    fetch(`${url}/fooditems`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToPush),
    }).then((response) => response.json())
        .then((data) => lastAddedItem = data)
        .catch((err) => { console.error(err) })

}

// Flash css du dernier ajouté
const flashLastAddedItem = (newitem) => {
    const lastAddedItemElement = document.getElementById(`${newitem.id}`)
    lastAddedItemElement.classList.add("just-added")
    setTimeout(() => {
        lastAddedItemElement.classList.remove("just-added")
    }, 2000)
}



const convertInFrenchDataString = (dateString) => {
    const dateFragments = dateString.split("-");
    return `${dateFragments[2]}/${dateFragments[1]}/${dateFragments[0]}`
}

// recupération de l'id du boutton clické
const getClickedId = (e) => {
  
    if (e.target.nodeName.toLowerCase() !== "button") { return }
    /*   const parentLi = e.target.parentElement; */ // 
    const foodItemId = e.target.parentNode.id;
    /*     console.log(parentLi) */
    deletefood(foodItemId)
}


// Delete methode
const deletefood = (id) => {
    
    fetch(`${url}/fooditems/${id}`,{
        method: "DELETE"
    })/* .then(res => console.log(res.json())) */;
    getFood()

}

foodDiv.addEventListener("click", getClickedId)


// Initialisation de la recupération des données
init();
function init() {
    getFood()
}




addfoodForm.addEventListener("submit", addFood)


