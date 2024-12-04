import { loader, main } from './index.js'

const baseURL = 'https://jsonplaceholder.typicode.com'

function createUserCard(user) {
	const card = /*html*/ `
        <article class="card" id="${user.id}">
            <h3 class="name">${user.name}</h3>
            <p class="username">username: ${user.username}</p>
            <p class="phone">Phone: ${user.phone}</p>
            <p class="email">Email: ${user.email}</p>
        </article>
    `

	return card
}

function createUserPage(user) {
	const userPage = /*html*/ `
        <section class="user-page">
            <h3 class="name">${user.name}</h3>
            <p class="username">username: ${user.username}</p>
            <p class="phone">Phone: ${user.phone}</p>
            <p class="email">Email: ${user.email}</p>
            <div class="address">
                <p>${user.address.city}</p>
                <p>${user.address.street}</p>
            </div>
            <div class="actions">
                <button id="back-btn">Back to user list</button>
            </div>
        </section>
    `

	return userPage
}

function createPost(post) {
	const postLi = /*html*/ `
        <li>
            <h4>${post.title}</h4>
            <p>${post.body}</p>
        </li>
    `
	return postLi
}

function createUserPosts(posts) {
	const userPosts = /*html*/ `
        <section class="user-posts">
            <h2>Posts</h2>
            <ul>
                ${posts.map(createPost).join('')}
            </ul>
        </section>
    `
	return userPosts
}

export async function getAllUsers() {
	const savedUsers = JSON.parse(localStorage.getItem('users'))
	if (savedUsers && Array.isArray(savedUsers) && savedUsers.length > 0) {
		return savedUsers
	}

	const res = await fetch(baseURL + '/users')
	const users = await res.json()

	localStorage.setItem('users', JSON.stringify(users))

	return users
}

async function getUserById(userId) {
	const savedUsers = JSON.parse(localStorage.getItem('users'))
	if (savedUsers && Array.isArray(savedUsers) && savedUsers.length > 0) {
		return savedUsers.find((user) => user.id == userId)
	}

	const res = await fetch(baseURL + `/users/${userId}`)
	const user = await res.json()
	return user
}

async function getUserPosts(userId) {
	let savedUserPosts = JSON.parse(localStorage.getItem('user_posts'))
	if (!savedUserPosts) {
		savedUserPosts = {}
	}

	const userPosts = savedUserPosts[userId]
	if (userPosts && userPosts.length > 0) {
		return userPosts
	}

	const res = await fetch(baseURL + `/users/${userId}/posts`)
	const posts = await res.json()

	savedUserPosts[userId] = posts
	localStorage.setItem('user_posts', JSON.stringify(savedUserPosts))

	return posts
}

async function handleOnCardClick(card) {
	insertLoaderToDOM()
	const user = await getUserById(card.id)
	const posts = await getUserPosts(card.id)

	const userPageAsHtmlString = createUserPage(user)
	main.innerHTML = userPageAsHtmlString

	const userPostsAsHtmlString = createUserPosts(posts)
	main.innerHTML += userPostsAsHtmlString

	const backBtn = document.querySelector('#back-btn')
	backBtn.addEventListener('click', displayAllUsers)
}

export function handleOnClick(event) {
	const { target } = event
	const closetsCard = target.closest('.card')
	if (closetsCard) handleOnCardClick(closetsCard)
}

function insertLoaderToDOM() {
	main.innerHTML = loader.outerHTML
}

function insertUsersToDOM(users) {
	const usersAsHtmlString = users.map((user) => createUserCard(user)).join('')
	main.innerHTML = usersAsHtmlString
}

export function displayAllUsers() {
	insertLoaderToDOM()
	getAllUsers().then((users) => {
		insertUsersToDOM(users)
	})
}
