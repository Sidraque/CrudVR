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
        window.addEventListener('resize', this.atualizarLayout);
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
        entidadeUsuario.setAttribute('text', {
            value: `Nome: ${nomeUsuario}\nEmail: ${email}\nIdade: ${idade}`,
            align: 'left',
            color: 'white',
            width: 1.2,
            wrapCount: 22,
            baseline: 'top',
            anchor: 'left',
            zOffset: 0.01
        });
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
        const componenteTexto = entidadeUsuario.getAttribute('text');
        if (!componenteTexto) return;

        const infoAtual = componenteTexto.value.split('\n');
        const nomeAtual = infoAtual[0].split(': ')[1];
        const emailAtual = infoAtual[1].split(': ')[1];
        const idadeAtual = infoAtual[2].split(': ')[1];

        const novoNome = prompt("Digite o novo nome do usuário:", nomeAtual);
        const novoEmail = prompt("Digite o novo email:", emailAtual);
        const novaIdade = prompt("Digite a nova idade:", idadeAtual);

        if (novoNome && novoEmail && novaIdade) {
            entidadeUsuario.setAttribute('text', {
                value: `Nome: ${novoNome}\nEmail: ${novoEmail}\nIdade: ${novaIdade}`,
                align: 'left',
                color: 'white',
                width: 1.2,
                wrapCount: 22,
                baseline: 'top',
                anchor: 'left',
                zOffset: 0.01
            });
        }
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
        const listaUsuarios = document.querySelector('#listaUsuarios');
        const quantidadeUsuarios = this.usuarios.length;
        let colunas = 2;
        
        if (quantidadeUsuarios > 6) {
            colunas = 3;
        }
        if (quantidadeUsuarios > 12) {
            colunas = 4;
        }

        listaUsuarios.setAttribute('layout', `type: grid; columns: ${colunas}; margin: 0.15; align: center`);
        
        const entidadeInterface = document.querySelector('#interface');
        entidadeInterface.setAttribute('position', `0 ${1.0 - (quantidadeUsuarios * 0.15)} -1.5`);
    }
});
