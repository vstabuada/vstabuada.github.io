import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabase = createClient(
    'https://shirfddotjoqdlztfsxt.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoaXJmZGRvdGpvcWRsenRmc3h0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NjgxMjcsImV4cCI6MjA5NTE0NDEyN30.z4a43wJ7v6iy-MUzyV8dZ0Ejz0UeKcWNX-cBpG4MR_M'
)

console.log("conectado")

async function getUsers() {
    const { data, error } = await supabase.from('users').select('*')
    if (error) {
        console.error('Erro ao buscar usuários:', error)
        return { error }
    }
    return data
}

const usersData = await getUsers()

let submit = document.getElementById("submit")
let user = document.getElementById("user")
let password = document.getElementById("password")


function submitLogin() {
    const validUser = usersData.findIndex(u => u.user === user.value)

    if (validUser === -1) {
        alert("Esse usuário não existe.")
    } else if (usersData[validUser].password !== password.value) {
        alert("Senha incorreta.")
    } else {
        window.location.href = `${usersData[validUser].href}.html`
    }
}

submit.addEventListener("click", submitLogin)
document.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        submitLogin()
    }
})