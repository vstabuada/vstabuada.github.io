import { createClient } from 'https://esm.sh/@supabase/supabase-js'
import { supabase } from '../../backend/database.js';

console.log("connected")

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






const authenticateUser = async function () {

    const email = document.getElementById("user").value.trim();
    const password = document.getElementById("password").value;

    //errorMessage.textContent = '';

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        console.error(error);

        //errorMessage.textContent = 'E-mail ou senha incorretos.';
        return;
    }

    console.log('Usuário autenticado:', data.user);

    window.location.href = '/src/tabusystem/tabusystem.html';

}






function submitLogin() {
    const validUser = usersData.findIndex(u => u.user === document.getElementById("user").value.trim())

    if (validUser === -1) {
        authenticateUser()
    } else if (usersData[validUser].password !== document.getElementById("password").value) {
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



