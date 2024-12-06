/* Here is where I will start coding */

//Functions start here (with comments)
//Copied from glitch web

// Function #1
function createElemWithText(elementType = "p", textContent = "", className) {
    const elem = document.createElement(elementType);
    elem.textContent = textContent;
    if (className) elem.className = className;
    return elem;
}

// Function #2
function createSelectOptions(users) {
    if (!users) return undefined;
    return users.map(user => {
        const option = document.createElement("option");
        option.value = user.id;
        option.textContent = user.name;
        return option;
    });
}

// Function #3
function toggleCommentSection(postId) {
    if (!postId) return undefined; // Check for missing postId
    const section = document.querySelector(`section[data-post-id="${postId}"]`);
    if (!section) return null; // Return null if no matching section is found
    section.classList.toggle("hide"); // Toggle 'hide' class
    return section; // Return the section element
}


// Function #4
function toggleCommentButton(postId) {
    if (!postId) return undefined; // Check for missing postId
    const button = document.querySelector(`button[data-post-id="${postId}"]`);
    if (!button) return null; // Return null if no matching button is found
    button.textContent = button.textContent === "Show Comments" 
        ? "Hide Comments" 
        : "Show Comments"; // Toggle button text
    return button; // Return the button element
}


// Function #5
function deleteChildElements(parentElement) {
    if (!(parentElement instanceof HTMLElement)) return undefined; // Validate the input
    let child = parentElement.lastElementChild;
    while (child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
    return parentElement; // Return the cleaned element
}


// Function #6: addButtonListeners
function addButtonListeners() {
    // Select all buttons nested inside the main element
    const mainElement = document.querySelector("main");
    if (!mainElement) return undefined; // Ensure the main element exists

    const buttons = mainElement.querySelectorAll("button");
    if (!buttons.length) return buttons; // Return empty NodeList if no buttons found

    // Loop through the NodeList of buttons
    buttons.forEach(button => {
        const postId = button.dataset.postId; // Get the postId from button.dataset.postId
        if (postId) {
            button.addEventListener("click", event => {
                // Call toggleComments with event and postId as parameters
                toggleComments(event, postId);
            });
        }
    });

    // Return the NodeList of buttons
    return buttons;
}




// Function #7
function removeButtonListeners() {
    const buttons = document.querySelectorAll("main button");
    if (buttons) {
        buttons.forEach(button => {
            const postId = button.dataset.postId;
            if (postId) {
                button.removeEventListener("click", function(event) {
                    toggleComments(event, postId);
                });
            }
        });
    }
    return buttons;
}

// Function #8
function createComments(comments) {
    if (!comments) return undefined;
    const fragment = document.createDocumentFragment();
    comments.forEach(comment => {
        const article = document.createElement("article");
        const h3 = createElemWithText("h3", comment.name);
        const p1 = createElemWithText("p", comment.body);
        const p2 = createElemWithText("p", `From: ${comment.email}`);
        article.append(h3, p1, p2);
        fragment.appendChild(article);
    });
    return fragment;
}

// Function #9
function populateSelectMenu(users) {
    const selectMenu = document.getElementById("selectMenu");
    if (!selectMenu || !users) return undefined;
    const options = createSelectOptions(users);
    options.forEach(option => selectMenu.appendChild(option));
    return selectMenu;
}


// Function #10
async function getUsers() {
    const url = "https://jsonplaceholder.typicode.com/users";
    try {
        const response = await fetch(url);
        const users = await response.json();
        return users;
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}

// Function #11
async function getUserPosts(userId) {
    if (!userId) return undefined; // Return undefined if no userId is provided
    const url = `https://jsonplaceholder.typicode.com/posts?userId=${userId}`;
    try {
        const response = await fetch(url);
        const posts = await response.json();
        return posts; // Return posts data
    } catch (error) {
        console.error(`Error fetching posts for userId ${userId}:`, error);
    }
}


// Function #12
async function getUser(userId) {
    if (!userId) return undefined; // Return undefined if no userId is provided
    const url = `https://jsonplaceholder.typicode.com/users/${userId}`;
    try {
        const response = await fetch(url);
        const user = await response.json();
        return user; // Return user data
    } catch (error) {
        console.error(`Error fetching user with id ${userId}:`, error);
    }
}


// Function #13
async function getPostComments(postId) {
    if (!postId) return undefined; // Return undefined if no postId is provided
    const url = `https://jsonplaceholder.typicode.com/comments?postId=${postId}`;
    try {
        const response = await fetch(url);
        const comments = await response.json();
        return comments; // Return comments data
    } catch (error) {
        console.error(`Error fetching comments for postId ${postId}:`, error);
    }
}


// Function #14
async function displayComments(postId) {
    if (!postId) return undefined; // Return undefined for missing postId
    const section = document.createElement("section");
    section.dataset.postId = postId;
    section.classList.add("comments", "hide");
    try {
        const comments = await getPostComments(postId);
        const fragment = createComments(comments); // Use createComments to build comment elements
        section.appendChild(fragment);
    } catch (error) {
        console.error(`Error displaying comments for postId ${postId}:`, error);
    }
    return section; // Return the populated section element
}


// Function #15
async function createPosts(posts) {
    if (!posts) return undefined;
    const fragment = document.createDocumentFragment();
    for (const post of posts) {
        const article = document.createElement("article");
        const h2 = createElemWithText("h2", post.title);
        const p1 = createElemWithText("p", post.body);
        const p2 = createElemWithText("p", `Post ID: ${post.id}`);
        const author = await getUser(post.userId);
        const p3 = createElemWithText("p", `Author: ${author.name} with ${author.company.name}`);
        const p4 = createElemWithText("p", author.company.catchPhrase);
        const button = createElemWithText("button", "Show Comments");
        button.dataset.postId = post.id;

        const section = await displayComments(post.id);
        article.append(h2, p1, p2, p3, p4, button, section);
        fragment.appendChild(article);
    }
    return fragment;
}

// Function #16
function displayPosts(posts) {
    const mainElement = document.querySelector("main");
    if (!mainElement) return undefined;

    mainElement.innerHTML = ""; // Clear existing content

    if (!posts || posts.length === 0) {
        const paragraph = createElemWithText("p", "Select an Employee to display their posts.", "default-text");
        mainElement.appendChild(paragraph);
        return paragraph; // Return paragraph element
    }

    const fragment = document.createDocumentFragment();
    posts.forEach(post => {
        const article = document.createElement("article");
        article.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.body}</p>
            <button data-post-id="${post.id}">Toggle Comments</button>
        `;
        fragment.appendChild(article);
    });

    mainElement.appendChild(fragment); // Append the fragment to the main element
    return fragment; // Return document fragment
}



// Function #17
function toggleComments(event, postId) {
    if (!event || !postId) return undefined;

    const target = event.target;
    const section = toggleCommentSection(postId); // Assume this is implemented elsewhere
    const button = toggleCommentButton(postId); // Assume this is implemented elsewhere

    return [section, button];
}


// Function #18: refreshPosts
async function refreshPosts(posts) {
    if (!posts) return undefined; // Return undefined if no posts

    const removeButtons = removeButtonListeners();

    const mainElement = document.querySelector("main");
    const main = deleteChildElements(mainElement);

    const fragment = await displayPosts(posts);

    const addButtons = addButtonListeners();

    return [removeButtons, main, fragment, addButtons];
}

// Function #19: selectMenuChangeEventHandler
async function selectMenuChangeEventHandler(event) {
    if (!event || !event.target) return undefined; // Validate event

    const selectMenu = event.target;
    selectMenu.disabled = true;

    try {
        const userId = event.target.value || 1;

        const posts = await getUserPosts(userId);

        const refreshPostsArray = await refreshPosts(posts);

        return [userId, posts, refreshPostsArray];
    } catch (error) {
        console.error("Error handling menu change:", error);
    } finally {
        // Step j: Enable the select menu
        selectMenu.disabled = false;
    }
}





// Function #20
async function initPage() {
    const users = await getUsers(); // Fetch the users from the API
    const select = populateSelectMenu(users); // Populate the select menu with user data
    return [users, select];
}

// Function #21
function initApp() {
    initPage(); // Initialize the page
    const selectMenu = document.getElementById("selectMenu"); // Select the #selectMenu element
    selectMenu.addEventListener("change", selectMenuChangeEventHandler); // Add change event listener
}








// Initialize the app after the DOM content has loaded
document.addEventListener("DOMContentLoaded", initApp);






