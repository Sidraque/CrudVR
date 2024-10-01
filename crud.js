AFRAME.registerComponent('gerenciador-crud-usuario', {
    init: function () {
        this.usuarios = [];
        this.contadorUsuarios = 0;
        this.el.addEventListener('mouseenter', this.lidarComMouseEnter.bind(this));
        this.nomesReais = [
            "Ana Silva", "João Santos", "Maria Oliveira", "Pedro Costa",
            "Carla Rodrigues", "Lucas Ferreira", "Beatriz Almeida", "Gustavo Pereira",
            "Fernanda Lima", "Rafael Souza", "Juliana Martins", "André Gomes",
            "Mariana Castro", "Bruno Cardoso", "Camila Nunes", "Thiago Ribeiro"
        ];
        this.atualizarLayout = this.atualizarLayout.bind(this);
        this.lidarComSalvarEdicao = this.lidarComSalvarEdicao.bind(this);
        this.lidarComFecharEdicao = this.lidarComFecharEdicao.bind(this);
    },

    lidarComMouseEnter: function (evento) {
        const elementoHover = evento.target;
        if (elementoHover.classList.contains('clicavel')) {
            const componenteTexto = elementoHover.getAttribute('text');
            if (componenteTexto && componenteTexto.value === 'Adicionar Usuário') {
                this.criarUsuario();
            } else if (elementoHover.classList.contains('botao-editar')) {
                this.atualizarUsuario(elementoHover.closest('.usuario'));
            } else if (elementoHover.classList.contains('botao-excluir')) {
                this.excluirUsuario(elementoHover.closest('.usuario'));
            }
        }
    },

    criarUsuario: function () {
        this.contadorUsuarios++;
        const nomeUsuario = this.nomesReais[Math.floor(Math.random() * this.nomesReais.length)];
        const email = nomeUsuario.toLowerCase().replace(' ', '.') + '@exemplo.com';
        const idade = Math.floor(Math.random() * 50) + 18;

        const entidadeUsuario = document.createElement('a-entity');
        entidadeUsuario.setAttribute('geometry', 'primitive: plane; width: 1.3; height: 0.7');
        entidadeUsuario.setAttribute('material', 'color: #3498db; opacity: 0.9;');

        // Adicionando o texto dentro da caixa azul
        const texto = document.createElement('a-text');
        texto.setAttribute('value', `Nome: ${nomeUsuario}\nEmail: ${email}\nIdade: ${idade}`);
        texto.setAttribute('align', 'center');
        texto.setAttribute('color', 'white');
        texto.setAttribute('width', 1.2);
        texto.setAttribute('wrapCount', 22);
        texto.setAttribute('baseline', 'center');
        texto.setAttribute('position', '0 0 0.01');
        texto.setAttribute('scale', '1.5 1.5 1');

        entidadeUsuario.appendChild(texto);

        entidadeUsuario.setAttribute('class', 'usuario');
        entidadeUsuario.setAttribute('position', '0 0 0.01');

        const botaoEditar = this.criarBotao('✎', 'botao-editar', '0.5 -0.22 0.02');
        const botaoExcluir = this.criarBotao('✖', 'botao-excluir', '0.5 -0.4 0.02');

        entidadeUsuario.appendChild(botaoEditar);
        entidadeUsuario.appendChild(botaoExcluir);
        this.usuarios.push(entidadeUsuario);
        document.querySelector('#listaUsuarios').appendChild(entidadeUsuario);

        this.atualizarLayout();
    },

    atualizarUsuario: function (entidadeUsuario) {
        if (!entidadeUsuario) return;
        const texto = entidadeUsuario.querySelector('a-text').getAttribute('value');
        const [nome, email, idade] = texto.split('\n').map(linha => linha.split(': ')[1]);

        const modal = document.querySelector('#modalEdicao');
        modal.querySelector('#inputNome a-text').setAttribute('value', nome);
        modal.querySelector('#inputEmail a-text').setAttribute('value', email);
        modal.querySelector('#inputIdade a-text').setAttribute('value', idade);

        modal.setAttribute('visible', true);

        // Armazena o usuário sendo editado
        this.usuarioEditando = entidadeUsuario;

        // Eventos de salvar e fechar
        document.querySelector('#botaoSalvar').addEventListener('click', this.lidarComSalvarEdicao);
        document.querySelector('#botaoFechar').addEventListener('click', this.lidarComFecharEdicao);
    },

    lidarComSalvarEdicao: function () {
        const modal = document.querySelector('#modalEdicao');
        const nome = modal.querySelector('#inputNome a-text').getAttribute('value');
        const email = modal.querySelector('#inputEmail a-text').getAttribute('value');
        const idade = modal.querySelector('#inputIdade a-text').getAttribute('value');

        if (this.usuarioEditando) {
            const texto = this.usuarioEditando.querySelector('a-text');
            texto.setAttribute('value', `Nome: ${nome}\nEmail: ${email}\nIdade: ${idade}`);
        }

        this.fecharModalEdicao();
    },

    lidarComFecharEdicao: function () {
        this.fecharModalEdicao();
    },

    fecharModalEdicao: function () {
        const modal = document.querySelector('#modalEdicao');
        modal.setAttribute('visible', false);
        this.usuarioEditando =         null;

        // Remove os eventos de salvar e fechar para evitar múltiplas associações
        document.querySelector('#botaoSalvar').removeEventListener('click', this.lidarComSalvarEdicao);
        document.querySelector('#botaoFechar').removeEventListener('click', this.lidarComFecharEdicao);
    },

    excluirUsuario: function (entidadeUsuario) {
        if (!entidadeUsuario) return;
        const index = this.usuarios.indexOf(entidadeUsuario);
        if (index > -1) {
            this.usuarios.splice(index, 1);
        }
        entidadeUsuario.parentNode.removeChild(entidadeUsuario);
        this.atualizarLayout();
    },

    criarBotao: function (simbolo, nomeClasse, posicao) {
        const botao = document.createElement('a-plane');
        botao.setAttribute('color', nomeClasse === 'botao-editar' ? '#f39c12' : '#e74c3c');
        botao.setAttribute('scale', '0.2 0.2 0.2');
        botao.setAttribute('position', posicao);
        botao.setAttribute('text', `value: ${simbolo}; align: center; color: white; zOffset: 0.01`);
        botao.setAttribute('class', `clicavel ${nomeClasse}`);
        
        botao.addEventListener('mouseenter', () => {
            botao.setAttribute('scale', '0.25 0.25 0.25');
        });
        botao.addEventListener('mouseleave', () => {
            botao.setAttribute('scale', '0.2 0.2 0.2');
        });

        return botao;
    },

    atualizarLayout: function () {
        // Utilizando layout do A-Frame para reorganizar os elementos dos usuários
        const listaUsuarios = document.querySelector('#listaUsuarios');
        listaUsuarios.removeAttribute('layout'); // Remover o layout para garantir que a posição manual funcione corretamente

        // Atualizar as posições dos usuários manualmente, se necessário
        this.usuarios.forEach((usuario, index) => {
            const coluna = index % 4;
            const linha = Math.floor(index / 4);
            const posicaoX = coluna * 2; // Ajuste a distância entre colunas
            const posicaoY = -linha * 1.5; 
            usuario.setAttribute('position', `${posicaoX} ${posicaoY} 0`);
        });
    }
});
