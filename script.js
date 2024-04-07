const toggleAddRssFeedWrapperButton = document.querySelector(".main-header button");
const addRssFeedWrapper = document.querySelector(".add-rss-feed-wrapper");
const addRssFeed = document.querySelector(".add-rss-feed");
const addRssFeedInputText = addRssFeed.querySelector("input[type=text]");
const addRssFeedButton = addRssFeed.querySelector("button");
const urlErrorDisplay = addRssFeed.querySelector(".url-error-display");
const mainContent = document.querySelector("main");
const defaultColor = "";
let db;

document.addEventListener("DOMContentLoaded", (e) => {
    checkBrowserSupportIndexedDb()
})

function adjustableGridColumn() {

}

// Fonction pour vérifier la pris en charge d'IndexedDb par le navigateur
function checkBrowserSupportIndexedDb() {
    if (!window.indexedDB) {
        window.alert(
            "Votre navigateur ne supporte pas ou n'autorise pas l'utilisation de base de données locales.<br>L'application est inutilisable sans base de données.",
        );
    } else {
        createOrOpenindexedDb()
    }
}

// Fonction pour Créer une base de données ou l'ouvrir si déjà créée
function createOrOpenindexedDb() {
    // Ouvrir ou créer une base de données IndexedDB
    const request = indexedDB.open("RSSReaderDB", 1);

    // Gérer la création ou la mise à jour de la base de données
    request.onupgradeneeded = function (event) {
        const db = event.target.result;
        // Définir la structure de l'objet à stocker dans la base de données
        const rssFeedObject =
            db.createObjectStore("rssFeed", { keyPath: "rssFeedKey", autoIncrement: true });
        rssFeedObject.createIndex("rssFeedUrl", "rssFeedUrl", { unique: true });
        rssFeedObject.createIndex("rssFeedTitle", "rssFeedTitle", { unique: true });
        rssFeedObject.createIndex("rssFeedContent", "rssFeedContent", { unique: false });
        rssFeedObject.createIndex("rssFeedCategory", "rssFeedCategory", { unique: false });

        const rssFeedCategoriesObject =
            db.createObjectStore("rssFeedCategories", { keyPath: "rssFeedCategoriesKey", autoIncrement: true });
        rssFeedCategoriesObject.createIndex("rssFeedCategory", "rssFeedCategory", { unique: true });
        console.log("Base de données crée avec succés !");
    };

    // Gérer la réussite de l'ouverture de la base de données
    request.onsuccess = function (event) {
        db = event.target.result;
        console.log("Base de données ouverte avec succés !");
        displayCards()
        toggleRssFeedDisplayMessage()
    };

    // Gérer les erreurs lors de l'ouverture de la base de données
    request.onerror = function (event) {
        console.error("Erreur lors de la création ou de l'ouverture de la base de données : ", event.target.errorCode);
    };
}

// Fonction pour reformater une date
function formatDate(articleDate) {
    // Récuperer la date actuelle
    const currentDate = new Date();
    console.log(currentDate);

    // Analyser la date d'origine
    const date = new Date(articleDate);
    // Obtenir les composants de la date
    const day = date.getDate();
    const month = date.getMonth() + 1; // Les mois commencent à 0, donc ajoutez 1
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    // Construire la date dans le nouveau format
    let dateFormated = `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year} ${hour < 10 ? '0' : ''}${hour}:${minute < 10 ? '0' : ''}${minute}:${second < 10 ? '0' : ''}${second}`;
    if (articleDate === null) {
        dateFormated = "NC"
    }
    return dateFormated;
}

//Fonction pour Récupérer un objet JSON d'un flux rss en utilisant une API
async function fetchRssDataFromApi(url) {
    // Récupérer les données à partir de l'URL spécifiée en utilisant l'API rss2json
    const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`);
    // Vérifier si la réponse HTTP est OK
    if (!response.ok) {
        throw new Error("Erreur de statut HTTP : " + response.status);
    }
    return await response.json();
}

// Fonction pour Ajouter un objet dans la base de données
function addObjectAtIndexedDB(storeName, objectToAdd) {
    const transaction = db.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.add(objectToAdd);
    request.onsuccess = function (event) {
        console.log("Données ajoutées avec succès à la base de données");
    };
    request.onerror = function (event) {
        console.error("Erreur lors de l'ajout des données à la base de données : ", event.target.error);
    };
}

// Fonction pour Supprimer un objet dans la base de données
function deleteObjectAtIndexedDB(storeName, objectDataKey) {
    const transaction = db.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.delete(parseInt(objectDataKey));
    request.onsuccess = function (event) {
        console.log("Données supprimés avec succès de la base de données");
    };
    request.onerror = function (event) {
        console.error("Erreur lors de la suppression des données de la base de données : ", event.target.error);
    };
}

// Fonction pour Mettre à jour un objet dans la base de données
function updateObjectAtIndexedDB(storeName, objectDataKey, contentToUpdate, contentData) {
    const transaction = db.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.get(parseInt(objectDataKey));

    request.onsuccess = function (event) {
        const data = request.result;
        data[contentToUpdate] = contentData;
        console.log("Objet récupéré avec succés");

        const requestUpdate = store.put(data);
        requestUpdate.onsuccess = function (event) {
            console.log("Objet mise à jour avec succés");
        };

        requestUpdate.onerror = function (event) {
            console.log("Echec de la mise à jour de l'objet");
        };
    };
    request.onerror = function (event) {
        console.error("Erreur lors de la récupération de l'objet : ", event.target.error);
    };
}

// Fonction pour Renvoyer un objet dbResult récupéré dans la base de données
function getDataFromIndexedDB(storeName, operationType, dataKey = null) {
    return new Promise((resolve, reject) => {
        // Ouvrir une transaction de lecture sur le magasin d'objets
        const transaction = db.transaction([storeName], "readonly");
        const store = transaction.objectStore(storeName);

        let request;

        if (operationType === "get") {
            // Convertir la chaîne de caractère en nombre entier
            dataKey = parseInt(dataKey);
            // Récupérer un objet par sa clé
            request = store.get(dataKey);

        } else if (operationType === "getAll") {
            // Récupérer tous les objets dans le magasin d'objets
            request = store.getAll();

        } else {
            // Opération invalide
            reject("Opération non prise en charge");
            return;
        }

        // Gérer la réussite de la récupération des données
        request.onsuccess = function () {
            const dbResult = request.result;
            resolve(dbResult);
        };

        // Gérer les erreurs lors de la récupération des données
        request.onerror = function () {
            console.error("Erreur lors de la récupération des données de la base de données");
            reject("Erreur lors de la récupération des données de la base de données");
        };
    });
}

// Fonction pour Afficher ou non le message "Aucun flux Rss" en vérifiant si la base de données contient un flux
function toggleRssFeedDisplayMessage() {

    getDataFromIndexedDB("rssFeed", "getAll")
        .then(dbResult => {
            if (dbResult.length === 0) {
                const nothingToDisplayWrapper = document.createElement("div");
                nothingToDisplayWrapper.classList.add("nothing-to-display-wrapper");
                nothingToDisplayWrapper.innerHTML = "<p>Rien à afficher pour le moment !<br><span>Tu peux ajouter ton premier flux RSS.</span></p>";
                const button = document.createElement("button");
                button.classList.add("add-btn", "circle-btn");
                nothingToDisplayWrapper.appendChild(button);
                button.addEventListener("click", function (e) {
                    toggleRssFeedFormWrapper()
                })
                mainContent.parentNode.appendChild(nothingToDisplayWrapper);
            } else {
                const nothingToDisplayWrapper = document.querySelector(".nothing-to-display-wrapper");
                if (nothingToDisplayWrapper) {
                    mainContent.parentNode.removeChild(nothingToDisplayWrapper);
                };

            }
        })
}

/*------------ Ajout d'un flux RSS -------------------*/

// Ajouter un écouteur d'événement sur le clic du bouton d'ouverture de la fenêtre d'ajout d'une url
toggleAddRssFeedWrapperButton.addEventListener('click', () => {
    toggleRssFeedFormWrapper();
});

// Fonction pour Ouvrir ou fermer la fenêtre d'ajout d'un flux RSS
function toggleRssFeedFormWrapper() {
    // Vider le champ de saisie d'url et l'affichage d'erreurs
    addRssFeedInputText.value = "";
    urlErrorDisplay.innerHTML = "";

    // Obtenir l'état actuel du formulaire à partir de l'attribut data-state
    const currentState = addRssFeedWrapper.getAttribute("data-state");

    // Déterminer si le formulaire est actuellement ouvert ou fermé
    const isOpen = currentState === "open";

    // Mettre à jour l'apparence du bouton de basculement en fonction de l'état du formulaire
    toggleAddRssFeedWrapperButton.style.transform = isOpen ? "rotateZ(0deg)" : "rotateZ(45deg)";

    // Afficher ou masquer le formulaire en fonction de son état actuel
    addRssFeedWrapper.style.display = isOpen ? "none" : "flex";

    // Mettre à jour l'attribut data-state du formulaire pour refléter son nouvel état
    addRssFeedWrapper.setAttribute("data-state", isOpen ? "close" : "open");
}

// Ajouter un écouteur d'événement sur le clic du bouton d'ajout d'un flux RSS
addRssFeedButton.addEventListener("click", (e) => {
    e.preventDefault();
    // Vérifier si le bouton n'est pas désactivé avant de continuer
    if (!addRssFeedButton.disabled) {
        // Récupérer l'URL à partir du champ de texte dans le formulaire d'ajout de flux RSS
        const urlString = addRssFeed.querySelector("input[type=text]").value;
        // Si le bouton n'est pas désactivé, appeler la fonction fetchAndProcessRSS() pour récupérer et traiter le flux RSS
        checkAndProcessUrl(urlString);
    }
});

// Ajouter un écouteur d'événement sur le champ de texte de saisie d'ajout d'un flux RSS
addRssFeedInputText.addEventListener("input", () => {
    // Vérifier si le champ n'est pas vide
    if (urlErrorDisplay.textContent.trim() != "") {
        // Si le champ n'est pas vide, effacer le contenu de l'élément d'affichage de l'erreur
        urlErrorDisplay.innerHTML = "";
    }
});

/*------------ Fin Ajout d'un flux RSS -------------------*/

/*------------ Vérifier et traiter l'url saisie d'ajout d'un flux RSS -------------------*/

// Fonction pour Vérifier et traiter l'url saisie
async function checkAndProcessUrl(url) {
    // Récupérer l'URL à partir du champ de texte dans la fenêtre d'ajout d'un flux RSS
    const urlString = url;

    // Définir le regex pour vérifier le début de l'URL
    const validStartRegex = /^(ftp|http|https):\/\//;

    // Définir le regex pour vérifier le reste de l'URL sans espaces
    const validRemainingRegex = /^[^\s]*$/;

    // Extraire le reste de l'URL après le début spécifié
    const remainingURL = urlString.replace(validStartRegex, '');

    try {
        // Vérifier si le champ de l'URL est vide
        if (urlString === "") {
            throw new Error("Le champ de l'URL est vide.");
        }

        // Vérifier si l'URL commence par "ftp://", "http://" ou "https://"
        if (!validStartRegex.test(urlString)) {
            throw new Error("L'URL doit commencer par http:// | https:// | ou ftp://.");
        }

        // Vérifier si le reste de l'URL est valide sans espaces
        if (!validRemainingRegex.test(remainingURL)) {
            throw new Error("Le format de l'URL est invalide.");
        }

        // Vérifier si l'URL existe déjà dans la base de données
        const exists = await checkUrlInIndexedDb(urlString);

        if (exists) {
            throw new Error("L'URL existe déjà dans la base de données.");
        }

        // Créer un objet URL à partir de la chaîne d'URL
        const url = new URL(urlString);

        // Appeler la fonction fetchXmlData() pour récupérer les données à partir de l'URL
        fetchRssData(url);
        console.log("est passé")
    } catch (error) {
        // Afficher une erreur en cas d'échec de l'analyse de l'url
        urlErrorDisplay.innerHTML = error;
        console.error("Erreur lors de l'analyse de l'URL : ", error);
    }
}

// Fonction pour Vérifier si l'url existe dans la base de données
function checkUrlInIndexedDb(url) {
    return new Promise((resolve, reject) => {
        getDataFromIndexedDB("rssFeed", "getAll")
            .then(dbResult => {
                const exists = dbResult.some(rssFeedObject => {
                    return rssFeedObject.rssFeedContent.feed.url === url;
                });
                resolve(exists);
            })
            .catch(error => {
                reject(error);
            });
    });
}

/*------------ Fin Vérifier et traiter l'url saisie d'ajout d'un flux RSS -------------------*/

/*------------ Traiter et enregistrer les données d'un flux RSS dans la base de données locales -------------------*/

// Récupérer les données du flux RSS
function fetchRssData(url) {
    // Afficher une icône de chargement
    addRssFeedButton.classList.add("loading-icon");

    // Récupérer les données à partir de l'URL spécifiée en utilisant l'API
    fetchRssDataFromApi(url)
        .then(data => {
            // Créer un objet avec les données du flux RSS et l'ajouter à la base de données
            const rssFeedObject = {
                rssFeedUrl: data.feed.link,
                rssFeedTitle: data.feed.title,
                rssFeedContent: data,
                rssFeedCategory: []
            };

            addObjectAtIndexedDB("rssFeed", rssFeedObject)

            // Fermer la fenêtre d'ajout d'url
            toggleRssFeedFormWrapper();

            // Enlever le message "Aucun flux RSS"
            toggleRssFeedDisplayMessage()

            // Récupérer les données du dernier flux RSS ajouté et Afficher la carte du flux RSS
            getDataFromIndexedDB("rssFeed", "getAll")
                .then(dbResult => {
                    const lastObject = dbResult[dbResult.length - 1];
                    mainContent.appendChild(cardWrapper(lastObject))
                    displayArticle(lastObject.rssFeedKey);
                })
                .catch((error) => {
                    console.error("Erreur lors de l'affichage du flux RSS' : ", error);
                })
        })
        .catch((error) => {
            // Afficher une erreur en cas d'échec de récupération ou de traitement des données
            urlErrorDisplay.innerHTML = "Erreur lors de la récupération et du traitement des données : " + error;
            console.error("Erreur lors de la récupération et du traitement des données : ", error);
        })
        .finally(() => {
            // Masquer l'icône de chargement
            addRssFeedButton.classList.remove("loading-icon");
        });
}

/*------------ Fin Traiter et enregistrer les données d'un flux RSS dans la base de données locales -------------------*/

// Renvoyer un model de carte
function cardWrapper(cardContent) {
    // Créer l'élément div pour la carte
    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('card-wrapper');
    cardWrapper.setAttribute("data-key", cardContent.rssFeedKey);
    cardWrapper.setAttribute("tabindex", "0");
    const cardHeader = document.createElement("header");
    cardHeader.innerHTML = `<h2 class="card-title">${cardContent.rssFeedTitle}</h2>`;

    cardWrapper.appendChild(cardHeader);
    cardHeader.appendChild(cardEditButton());
    cardHeader.appendChild(cardRefreshButton());
    cardWrapper.appendChild(cardNavButton("prev-article-btn", "prev"));
    cardWrapper.appendChild(cardNavButton("next-article-btn", "next"));

    return cardWrapper;
}

// Renvoyer un article
function cardArticle(dataItemValue, cardArticleContent) {
    const cardArticle = document.createElement("article");
    cardArticle.classList.add("card-article");
    cardArticle.setAttribute("data-item", dataItemValue);
    const articleTitle = document.createElement("h2");
    articleTitle.classList.add("article-title");


    cardArticle.innerHTML =
        `<h2 class="article-title">${cardArticleContent.articleTitle}</h2>
    <div class="article-image">
        <img src="${cardArticleContent.articleImgSrc}" alt="Image de l'article">
    </div>
    <p class="article-description">${cardArticleContent.articleDescription}</p>
    <footer>
    <span class="article-author">Auteur : ${cardArticleContent.articleAuthor}</span>
    <span class="article-category">Catégorie : ${cardArticleContent.articleCategory}</span>
    <a class="article-link" href="${cardArticleContent.articleLink}" target="_blank" rel="noopener noreferrer">Lien de l'article</a>
    <span class="article-date">${cardArticleContent.articleDate}</span>
    </footer>`;


    return cardArticle;
}

// Renvoyer l'édition de la carte pour éditer les caractéristiques du flux RSS
function cardEdit(cardTitle, cardFeedUrl) {
    const cardEditWrapper = document.createElement("div");
    cardEditWrapper.classList.add("card-edit-wrapper");
    cardEditWrapper.setAttribute("data-state", "close");
    const header = document.createElement("header");
    header.innerHTML = `<input type="text" value="${cardTitle}">`;
    header.appendChild(cardDeleteButton());
    cardEditWrapper.appendChild(header);
    const cardEditContentWrapper = document.createElement("div");
    cardEditContentWrapper.classList.add("card-edit-content-wrapper");
    cardEditContentWrapper.innerHTML = `
    <div class="card-edit-content">
    <div class="card-edit-feed-url">
    <span></span>
    <span>${cardFeedUrl}</span>
    </div>
    <div class="tags-wrapper">
    <span class="tags-icon"></span>
    <span class="tag-item">Actualités</span>
    <span class="tag-item">Technologie</span>
    <span class="tag-item">Science</span>
    <span class="tag-item">Santé</span>
    <span class="tag-item">Voyage</span>
    <span class="tag-item">Cuisine</span>
    <span class="tag-item">Sport</span>
    <span class="tag-item">Finance</span>
    <span class="tag-item">Divertissement</span>
    <span class="tag-item">Musique</span>
    <span class="tag-item">Cinéma</span>
    <span class="tag-item">Automobile</span>
    <span class="tag-item">Politique</span>
    <span class="tag-item">Religion</span>
    <span class="tag-item">Éducation</span>

    <button class="add-btn circle-btn"></button>
    </div>
    </div>`;
    const cardEditContentBtnWrapper = document.createElement("div");
    cardEditContentBtnWrapper.classList.add("card-edit-content-btn-wrapper");
    cardEditContentBtnWrapper.appendChild(cardSaveButton());
    cardEditContentWrapper.appendChild(cardEditContentBtnWrapper);
    cardEditWrapper.appendChild(cardEditContentWrapper);

    return cardEditWrapper;
}

// Renvoyer un bouton pour sauvegarder l'édition d'un flux RSS d'une carte
function cardSaveButton() {
    const button = document.createElement("button");
    button.classList.add("save-btn", "circle-btn");

    button.addEventListener("click", function (e) {
        const cardWrapper = e.target.parentNode.closest(".card-wrapper");
        const cardDataKey = cardWrapper.getAttribute("data-key");
        const cardTitle = cardWrapper.querySelector("header .card-title");
        const rssFeedCustomTitle = cardWrapper.querySelector(".card-edit-wrapper header input").value;
        updateObjectAtIndexedDB("rssFeed", cardDataKey, "rssFeedTitle", rssFeedCustomTitle);
        const cardEditWrapper = cardWrapper.querySelector(".card-edit-wrapper");
        cardWrapper.removeChild(cardEditWrapper);
        cardTitle.textContent = rssFeedCustomTitle;
        console.log("Click on save button")
    });

    return button;
}

// Renvoyer un bouton pour naviguer d'un article à l'autre d'un flux RSS d'une carte
function cardNavButton(cssClass, dataNavValue) {
    const button = document.createElement("button");

    // Définir les classes
    button.classList.add(cssClass);
    // Définir l'attribut sur le bouton
    button.setAttribute("data-nav", dataNavValue);

    button.addEventListener('click', function (e) {
        const cardWrapper = e.target.parentNode;
        const cardWrapperDataKey = cardWrapper.getAttribute("data-key");
        const currentCardArticle = cardWrapper.querySelector("article");
        let currentCardArticleDataItemValue = parseInt(currentCardArticle.getAttribute("data-item"));

        getDataFromIndexedDB("rssFeed", "get", cardWrapper.getAttribute("data-key"))
            .then(dbResult => {

                const itemsArray = dbResult.rssFeedContent.items;

                if (e.target.getAttribute("data-nav") === "next") {

                    if (currentCardArticleDataItemValue < itemsArray.length - 1) {
                        cardWrapper.removeChild(currentCardArticle);
                        currentCardArticleDataItemValue += 1;
                        displayArticle(cardWrapperDataKey, currentCardArticleDataItemValue)
                        currentCardArticle.setAttribute("data-item", currentCardArticleDataItemValue);
                    }

                } else if (e.target.getAttribute("data-nav") === "prev") {

                    if (currentCardArticleDataItemValue >= 1) {
                        cardWrapper.removeChild(currentCardArticle);
                        currentCardArticleDataItemValue -= 1;
                        displayArticle(cardWrapperDataKey, currentCardArticleDataItemValue)
                        currentCardArticle.setAttribute("data-item", currentCardArticleDataItemValue);
                    }
                }
            })
    })

    return button;
}

// Renvoyer un bouton pour rafraîchir le flux RSS d'une carte
function cardRefreshButton() {
    const button = document.createElement("button");
    button.classList.add("refresh-btn", "circle-btn");

    button.addEventListener('click', function (e) {
        const cardWrapper = e.target.closest(".card-wrapper");
        const cardWrapperDataKey = cardWrapper.getAttribute("data-key");
        const currentCardArticle = cardWrapper.querySelector("article");

        // Réupérer dans la base de données l'url du flux rss à mettre à jour en utilisant la clé de la carte
        getDataFromIndexedDB("rssFeed", "get", cardWrapperDataKey)
            .then((dbResult) => {
                // Afficher une icône de chargement
                e.target.classList.add("loading-icon");
                // Récupérer les données à partir de l'URL spécifiée en utilisant l'API rss2json
                fetchRssDataFromApi(dbResult.rssFeedContent.feed.url)
                    .then(data => {
                        // Mettre à jour les données du flux RSS dans la base de données
                        updateObjectAtIndexedDB("rssFeed", cardWrapperDataKey, "rssFeedContent", data)
                    })
                    .catch((error) => {
                        // Afficher une erreur en cas d'échec de récupération ou de traitement des données
                        urlErrorDisplay.innerHTML = "Erreur lors de la récupération et du traitement des données : " + error;
                        console.error("Erreur lors de la récupération et du traitement des données : ", error);
                    })
                    .finally(() => {
                        //Mettre à jour l'article
                        cardWrapper.removeChild(currentCardArticle);
                        displayArticle(cardWrapperDataKey)
                        // Masquer l'icône de chargement
                        e.target.classList.remove("loading-icon");
                    });
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération de l'objet :", error);
            });
        console.log("Click on refresh button")
    })

    return button;
}

// Renvoyer un bouton d'édition pour éditer le flux RSS d'une carte
function cardEditButton() {
    const button = document.createElement("button");
    button.classList.add("edit-btn", "circle-btn");

    button.addEventListener('click', function (e) {
        const cardWrapper = e.target.closest(".card-wrapper");
        const cardWrapperDataKey = cardWrapper.getAttribute("data-key");
        getDataFromIndexedDB("rssFeed", "get", cardWrapperDataKey)
            .then(dbResult => {
                cardWrapper.appendChild(cardEdit(dbResult.rssFeedTitle, dbResult.rssFeedContent.feed.url));
            })
            .catch(error => {
                console.error("Erreur survenue lors de l'affichage de l'édition de la carte : ", error)
            })
        console.log("Click on edit button");
    })

    return button;
}

// Renvoyer un bouton de suppresion pour supprimer un flux RSS
function cardDeleteButton() {
    const button = document.createElement("button");
    button.classList.add("delete-btn", "circle-btn");

    button.addEventListener('click', function (e) {
        if (confirm("Êtes-vous sûr de vouloir supprimer le flux RSS ?")) {
            const cardWrapper = e.target.closest(".card-wrapper");
            const cardWrapperDataKey = cardWrapper.getAttribute("data-key");
            deleteObjectAtIndexedDB("rssFeed", cardWrapperDataKey);
            mainContent.removeChild(cardWrapper);
            toggleRssFeedDisplayMessage()
        };
        console.log("Click on delete button");
    })

    return button;
}

// Afficher les cartes
function displayCards() {
    getDataFromIndexedDB("rssFeed", "getAll")
        .then(dbResult => {
            if (dbResult.length > 0) {
                for (i = 0; i < dbResult.length; i++) {
                    const item = dbResult[i].rssFeedContent.items[0];

                    const cardContent = {
                        rssFeedKey: dbResult[i].rssFeedKey,
                        rssFeedTitle: dbResult[i].rssFeedTitle,
                    };
                    mainContent.appendChild(cardWrapper(cardContent));
                    displayArticle(cardContent.rssFeedKey)
                }
            }
        })
        .catch(error => {
            console.error("Erreur survenue lors de l'affichage des flux RSS : ", error)
        })
}

// Afficher un article
function displayArticle(cardDataKeyValue, dataItemValue = 0) {
    getDataFromIndexedDB("rssFeed", "get", cardDataKeyValue)
        .then(dbResult => {
            const cardWrapper = document.querySelector(`.card-wrapper[data-key="${cardDataKeyValue}"]`);

            const item = dbResult.rssFeedContent.items[dataItemValue];
            const cardArticleContent = {
                articleItem: dataItemValue,
                articleTitle: item.title || "",
                articleImgSrc: (item.enclosure && item.enclosure.link) ? item.enclosure.link : "assets/img/default_image.webp",
                articleDescription: (item.content) ? item.content.replace(/<[^>]+>/g, '') : "",
                articleAuthor: item.author || "",
                articleCategory: (item.categories && item.categories.length > 0) ? item.categories[0] : "",
                articleLink: item.link || "",
                articleDate: (item.pubDate) ? formatDate(item.pubDate) : ""
            };
            cardWrapper.appendChild(cardArticle(dataItemValue, cardArticleContent));
        })
        .catch(error => {
            console.error("Erreur survenue lors de l'affichage de l'article : ", error)
        })
}



/*------ A voir ------*/

async function test() {
    try {
        // Récupérer les données à partir de l'URL spécifiée en utilisant l'API
        const response = await fetch('https://corsproxy.io/?' + encodeURIComponent('https://www.jeuxvideo.com/news/1871764/ce-film-de-disney-qui-continue-de-terroriser-les-enfants-43-ans-apres-sa-sortie-ce-n-est-ni-bambi-ni-la-belle-et-la-bete.htm'));

        // Vérifier si la réponse HTTP est OK
        if (!response.ok) {
            throw new Error("Erreur de statut HTTP : " + response.status);
        }
        console.log(response);
        // Transformer la réponse en JSON
        const data = await response.text();
        const htmlData = document.createElement("div");
        htmlData.innerHTML = data;
        const articleData = htmlData.querySelector("article");
        // Faire quelque chose avec les données récupérées
        console.log(articleData.textContent);

    } catch (error) {
        // Gérer les erreurs
        console.error("Erreur lors de la récupération des données : ", error);
    }
}
