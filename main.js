
const apiEndPoint = "http://localhost:3000/user";
const todoListUL = document.querySelector(".todo-list-wrap ul")
const todoListWrap = document.querySelector(".todo-list-wrap")
const input = document.querySelector(".single-box input")
const submitBtn = document.querySelector(".submit-button")

// Error Message
const errMassge = function (err, inBody){
    const message = document.createElement('div')
    message.classList.add("filid-message")
    message.innerHTML = `${err}`
    inBody.prepend(message)
}

const displyData = function(data){
    todoListUL.innerHTML = "" 
    data?.map(item => {
        const html = `
            <li class="d-flex list align-items-center" data-id="${item?.id}">
                <span>${item?.id} - ${item?.text}</span> 
                <span class="end">
                    <button class="btn btn-success get-update" id="#update-modal" data-bs-toggle="modal" data-bs-target="#update-modal">Edit</button> 
                    <button class="delete-btn btn btn-danger">Delete</button>
                </span>
            </li>
        `
        todoListUL.insertAdjacentHTML("afterbegin", html)
    })
}

// Get post Show
const getPostShow = async function(){
    try {
        const getData = await axios.get(apiEndPoint)
        const data = getData.data
        displyData(data)
    } catch (err) {
        errMassge(err, todoListUL)
    }
}
getPostShow()

// New Post create
const getPost = async function (newPost){
    try {
        await axios.post(apiEndPoint, newPost,
            {headers: { 'Content-Type': 'application/json;charset=UTF-8', "Access-Control-Allow-Origin": "*", "Accept": "application/json" }}
        );
        getPostShow()
    } catch(err){
        errMassge(err, todoListUL)
    }
}

// New post action
submitBtn.addEventListener('click', async function(e){
    e.preventDefault()
    if(input.value === '') return false
    const post = {
        text: input.value 
    }
    await getPost(post)
    input.value = ""
})


// Post delete
const deletePost = async function(id){
    await axios.delete(`${apiEndPoint}/${id}`)
    await getPostShow()
}

// Delete Post Action
todoListUL.addEventListener('click', function(e){
    e.preventDefault()
    const targetSel = e.target.classList.contains('delete-btn')
    const id = e.target.closest('.list').dataset.id
    if(targetSel){
        deletePost(id)
    }
})

// Post Update target select & input value set
todoListUL.addEventListener('click', async function(e){
    e.preventDefault()
    const targeUpdate = e.target.classList.contains('get-update')
    const id = e.target.closest(".list").dataset.id
    const res = await axios.get(`${apiEndPoint}/${id}`)
    const post = res.data
    if(targeUpdate) {
        document.querySelector(".form-control").value = post.text,
        document.querySelector(".update-submit-btn").value= post.id
    }
})
// Post update / Put 
const postUpdate = async function(updatePost, id){
    await axios.put(`${apiEndPoint}/${id}`, updatePost)
    await getPostShow()
}

// Update button action
document.querySelector(".update-submit-btn").addEventListener('click', (e)=>{
    e.preventDefault()
    const id = e.target.value
    const updatePost = {
        text: document.querySelector(".form-control").value
    }
    postUpdate(updatePost, id)
})


