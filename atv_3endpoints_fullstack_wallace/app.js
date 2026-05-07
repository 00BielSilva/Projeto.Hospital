

async function carregar_pacientes () {fetch('http://localhost:5000/pacientes')
.then(response => response.json())
.then(pacientes => {
    const lista = document.getElementById('lista-pacientes')
    lista.setAttribute('class','lista')

    pacientes.forEach(c => {
        const ol = document.createElement('ol')
        ol.innerHTML = `Nome: ${c.nomePaciente}
        <div id="botoes">
        <button onclick="prep_edit('${c.id}','${c.nomePaciente}')" id="btn_editar">Editar</button>
        <button onclick="excluir('${c.id}')" id="btn_excluir">Deletar</button>
        </div>
        `
        lista.appendChild(ol)
    })

})
}

async function carregar_medicos (){
fetch('http://localhost:5000/medicos')
.then(response => response.json())
.then(x => {
    const lista = document.getElementById('lista-medicos')

    x.forEach(c => {
        const ol = document.createElement('ol')
        ol.innerHTML = `Nome: ${c.nome} - Especialidade: ${c.especialidade}`
        lista.appendChild(ol)
    })

})
}
async function buscarNome() {
    const nomeDigitado = document.getElementById('nomePaciente').value.toLowerCase()
 
    const pacientes =   await fetch('http://localhost:5000/pacientes').then(r => r.json())
    const medicos =     await fetch('http://localhost:5000/medicos').then(r => r.json())
    const consultas =   await fetch('http://localhost:5000/consultas').then(r => r.json())

    const resultado = consultas.map(consulta => {
        const paciente = pacientes.find(p => p.id === consulta.idPaciente)
        const medico = medicos.find(m => m.id === consulta.idMedico)
        
     
        return {
            nomePaciente: paciente?.nomePaciente,
            nomeMedico: medico?.nome,
            especialidade: medico?.especialidade,
            data: consulta?.data
        }

        
    })
    
    .filter(item => item.nomePaciente.toLowerCase().includes(nomeDigitado))


    const apresentar = document.getElementById('filtro-pesquisa')
    
    apresentar.innerHTML = ''
   
    resultado.forEach(item => {
        
        const ol = document.createElement('ol')
        ol.innerHTML = `Nome do paciene: ${item.nomePaciente} <br> Nome do médico: ${item.nomeMedico}<br> Especialidade: ${item.especialidade} <br> Data: ${item.data}`
        apresentar.appendChild(ol)
    })
}
async function cadastrarPaciente(){
   const pacienteNovo = document.getElementById('novo-paciente').value.toLowerCase()
   await fetch('http://localhost:5000/pacientes',{
    method:'POST',
    headers:{
        "Content-Type":"application/json"
    },
    body:JSON.stringify({
        nomePaciente:pacienteNovo
    })
   })

   .then(response => response.json())
   .then(dados =>{
    alert('Paciente Cadastrado com Sucesso!')
    console.log(dados);

   })

}
let userEdit = null
function prep_edit(id,nome){
    userEdit = id
     document.getElementById('novo-paciente').value = nome
}
async function editar(){
    if(!userEdit){
        alert("Clique para editar algum paciente primeiro")
        return
    }
    const pacienteNovo = document.getElementById('novo-paciente').value
    await fetch(`http://localhost:5000/pacientes/${userEdit}`, {
        method:'PUT',
        headers: {
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            nomePaciente:pacienteNovo
        })
    })
        
    
alert("Usuário atualizado com sucesso")
editUser = null
window.location.reload()
}
async function excluir(id){
    const confirmar = confirm("Deseja excluir esse caba?")
    if(!confirmar){
        return
    }
    await fetch(`http://localhost:5000/pacientes/${id}`, {
        method:'DELETE'
    })
    alert('Usuário removido com sucesso!')
    window.location.reload()
}

carregar_pacientes()
carregar_medicos()